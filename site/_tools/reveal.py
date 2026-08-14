#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""スクロール駆動の出現を、実際に送って測る（CDP 版）。

  前提:  python3 -m http.server 8899   （site/ で）
  使い方: python3 reveal2.py [ページ名の一部 ...]
  戻り値: 0 なら合格。1 なら「読めないまま残るもの」か「出現が働いていない」

■ なぜ枠（iframe）+ --dump-dom をやめたか ― 実測して判った

  _tools/reveal.py は  --headless --dump-dom --virtual-time-budget=120000  で
  枠の中の頁を送っていた。この組合せは使えない：

    ・--virtual-time-budget を付けると、タイマだけが早送りされて
      **描画の機会が作られない**。IntersectionObserver の観測手順も
      requestAnimationFrame も、描画の機会に紐づいて走る。だから
      「IO の通知が0回」に見える。IO は壊れていない。計り方が壊れていた。
      （実測：同じ枠ページを --virtual-time-budget 付きで走らせると
        結果を書き込む <pre> が空のまま返る。外すと --dump-dom が
        いつまでも返らない。どちらでも測れない）
    ・--dump-dom は「1回だけ DOM を吐く」ので、送りながら何度も読めない。

  代わりに --remote-debugging-port で CDP を開き、Runtime.evaluate で
  scrollTo と getComputedStyle を直に叩く。枠も要らない。
  実測：IO の callback は 1→7 回、isIntersecting は 0→22 件と
  scrollY にきちんと追従した（index.html / 1440x900）。
  「枠は scrollTo で送れる」という仮説は正しい。ただし枠は要らなかった。

■ 測ること

  A. 読み込んで6秒待った時点で、**初回画面の中**に読めない印が無いか。
     画面の外で伏せられているのは出現が働いている証拠なので、事故ではない
     （前の版はそれも失格に数えていた。数え方が厳しすぎた）
  B. 下まで送ったあと、印の付いた要素が1つも「読めないまま」でないか
       ・読めない＝実効不透明度<0.5 か clip-path が inset(... 100% ...)
       ・実効＝先祖の opacity を全部掛けた値
  C. ★ data-lr-in は付いたのに読めないもの（＝ animation が走らなかった）
     これは5段の逃げ道が全部素通しする種類の事故なので独立に数える
  D. 送っている間、画面の中に在って読めない印の最大数
  E. 送る前に画面の下で伏せられているものが1つ以上あるか（出現が働いている証拠）
  F. 送っている間に版面の高さが変わらないか（CLS）
"""
import base64, json, os, re, socket, struct, subprocess, sys, tempfile, time
import urllib.request

CHROME = '/Users/nsohiro/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'http://127.0.0.1:8899/'
VIEWS = [(1440, 900), (390, 844)]
PAGES = ['index.html', 'beginner/index.html', 'campaign/index.html',
         'course_plan/index.html', 'faq/index.html', 'how_to_choose/index.html',
         'shopinfo/index.html', 'trial/index.html',
         'singlefolder/reservation.html', 'singlefolder/staff_1.html',
         'singlefolder/staff_3.html', 'singlefolder/staff_3_1.html',
         'singlefolder/staff_4.html', 'singlefolder/staff_5.html',
         'singlefolder/staff_6.html', '404.html']


# ── 最小の WebSocket / CDP（標準ライブラリだけ。pip 不要） ──────────────
class WS(object):
    def __init__(self, url):
        m = re.match(r'ws://([^:/]+):(\d+)(/.*)', url)
        host, port, path = m.group(1), int(m.group(2)), m.group(3)
        self.s = socket.create_connection((host, port), timeout=60)
        key = base64.b64encode(os.urandom(16)).decode()
        self.s.sendall(('GET %s HTTP/1.1\r\nHost: %s:%d\r\nUpgrade: websocket\r\n'
                        'Connection: Upgrade\r\nSec-WebSocket-Key: %s\r\n'
                        'Sec-WebSocket-Version: 13\r\n\r\n'
                        % (path, host, port, key)).encode())
        buf = b''
        while b'\r\n\r\n' not in buf:
            buf += self.s.recv(4096)
        self.buf = buf.split(b'\r\n\r\n', 1)[1]
        self.i = 0

    def _r(self, n):
        while len(self.buf) < n:
            d = self.s.recv(65536)
            if not d:
                raise EOFError
            self.buf += d
        out, self.buf = self.buf[:n], self.buf[n:]
        return out

    def send(self, obj):
        p = json.dumps(obj).encode()
        n = len(p)
        h = b'\x81'
        if n < 126:
            h += bytes([0x80 | n])
        elif n < 65536:
            h += bytes([0x80 | 126]) + struct.pack('>H', n)
        else:
            h += bytes([0x80 | 127]) + struct.pack('>Q', n)
        k = os.urandom(4)
        self.s.sendall(h + k + bytes(b ^ k[i % 4] for i, b in enumerate(p)))

    def recv(self):
        while True:
            f, op = b'', 1
            while True:
                b0, b1 = self._r(2)
                fin, op = b0 & 0x80, (b0 & 0x0f) or op
                n = b1 & 0x7f
                if n == 126:
                    n = struct.unpack('>H', self._r(2))[0]
                elif n == 127:
                    n = struct.unpack('>Q', self._r(8))[0]
                f += self._r(n)
                if fin:
                    break
            if op in (1, 2):
                return json.loads(f.decode('utf-8', 'replace'))
            if op == 8:
                raise EOFError


class Chrome(object):
    def __init__(self, w, h):
        self.port = 9300 + (os.getpid() % 400)
        self.dir = tempfile.mkdtemp(prefix='reveal2-')
        self.p = subprocess.Popen(
            [CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
             '--no-first-run', '--hide-scrollbars', '--mute-audio',
             '--remote-debugging-port=%d' % self.port,
             '--user-data-dir=' + self.dir, '--window-size=%d,%d' % (w, h)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        url = None
        for _ in range(300):
            try:
                url = json.load(urllib.request.urlopen(
                    'http://127.0.0.1:%d/json/version' % self.port,
                    timeout=1))['webSocketDebuggerUrl']
                break
            except Exception:
                time.sleep(0.1)
        if not url:
            raise RuntimeError('Chrome が起きない')
        self.ws = WS(url)
        t = self._raw('Target.createTarget', url='about:blank')['targetId']
        self.sid = self._raw('Target.attachToTarget', targetId=t,
                             flatten=True)['sessionId']
        self.call('Page.enable')
        self.call('Runtime.enable')
        self.view(w, h)

    def _raw(self, method, **params):
        self.ws.i += 1
        mid = self.ws.i
        self.ws.send({'id': mid, 'method': method, 'params': params})
        while True:
            m = self.ws.recv()
            if m.get('id') == mid:
                return m.get('result', {})

    def call(self, method, **params):
        self.ws.i += 1
        mid = self.ws.i
        self.ws.send({'id': mid, 'method': method, 'params': params,
                      'sessionId': self.sid})
        while True:
            m = self.ws.recv()
            if m.get('id') == mid:
                if 'error' in m:
                    raise RuntimeError(method + ': ' + json.dumps(m['error']))
                return m.get('result', {})

    def view(self, w, h):
        self.call('Emulation.setDeviceMetricsOverride', width=w, height=h,
                  deviceScaleFactor=1, mobile=(w < 700))

    def js(self, expr):
        r = self.call('Runtime.evaluate', expression=expr, returnByValue=True)
        if 'exceptionDetails' in r:
            raise RuntimeError(json.dumps(r['exceptionDetails'])[:300])
        return r['result'].get('value')

    def goto(self, url, wait):
        self.call('Page.navigate', url=url)
        time.sleep(wait)

    def close(self):
        try:
            self.p.terminate()
            self.p.wait(timeout=10)
        except Exception:
            try:
                self.p.kill()
            except Exception:
                pass


# ── 枠の中で走らせる測り屋 ──────────────────────────────────────────
# 「読めない」の定義を1箇所に置く。実効不透明度と clip-path の両方を見る。
READ = r'''(function(){
  function unread(e){
    var op=1, clipped=false;
    for(var p=e;p&&p.nodeType===1;p=p.parentNode){
      var pc=getComputedStyle(p);
      if(pc.display==='none'||pc.visibility==='hidden') return null;   /* 対象外 */
      op*=parseFloat(pc.opacity);
      if(/inset\([^)]*100%/.test(pc.clipPath||'')) clipped=true;
    }
    return (op<0.5||clipped) ? {op:Math.round(op*100)/100, clip:clipped} : false;
  }
  var marks=[], chars={lost:0,all:0}, inview=0;
  document.querySelectorAll('[data-lr]').forEach(function(e){
    if(e.getAttribute('data-lr')==='rule') return;     /* 罫は CSS が持つ */
    var u=unread(e), r=e.getBoundingClientRect();
    marks.push({k:e.getAttribute('data-lr'), y:Math.round(r.top+scrollY),
                h:Math.round(r.height), in_:e.hasAttribute('data-lr-in')?1:0,
                bad:u?1:0, op:u?u.op:1, clip:u?(u.clip?1:0):0,
                t:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,20)});
    if(u && r.bottom>0 && r.top<innerHeight) inview++;
  });
  document.querySelectorAll('body *').forEach(function(e){
    var s='';for(var n=e.firstChild;n;n=n.nextSibling) if(n.nodeType===3) s+=n.nodeValue;
    s=s.replace(/\s+/g,''); if(!s) return;
    var u=unread(e); if(u===null) return;
    chars.all+=s.length; if(u) chars.lost+=s.length;
  });
  var below=marks.filter(function(m){return m.bad && m.y>innerHeight;}).length;
  /* 初回画面の中に在って読めない印。**これは0でなければならない。**
     画面の外で伏せられているのは出現が働いている証拠であって、事故ではない。 */
  var infold=marks.filter(function(m){
    return m.bad && (m.y+m.h)>0 && m.y<innerHeight;}).length;
  return {marks:marks, chars:chars, inview:inview, below:below, infold:infold,
          sy:scrollY, vh:innerHeight, docH:document.documentElement.scrollHeight};
})()'''


def measure(c, page, w, h):
    """1ページ1窓ぶん測る"""
    c.js("try{sessionStorage.setItem('lr-pre','1')}catch(e){}")   # 幕は「見た」扱い
    c.goto(BASE + page, wait=6.0)
    a = c.js(READ)                                   # A：一度も送っていない
    peak = a['inview']
    y, vh = 0, a['vh']
    while y < a['docH'] + vh:
        c.js('scrollTo(0,%d)' % y)
        time.sleep(0.30)
        peak = max(peak, c.js(READ)['inview'])       # D：画面内で読めない最大
        y += int(vh * 0.7)
    c.js('scrollTo(0,0)')
    time.sleep(1.5)
    b = c.js(READ)                                   # B/C：送り終えた後
    return a, b, peak


def main():
    want = sys.argv[1:]
    pages = [p for p in PAGES if not want or any(x in p for x in want)]
    ng = 0
    for (w, h) in VIEWS:
        print('── %dx%d ' % (w, h) + '─' * 52)
        print('  %-30s %5s %6s %6s %6s %5s' %
              ('ページ', '印', 'A画内', 'B残', 'C走らず', 'D途中'))
        c = Chrome(w, h)
        try:
            for p in pages:
                a, b, peak = measure(c, p, w, h)
                n = len(b['marks'])
                A = a['chars']['lost']
                B = [x for x in b['marks'] if x['bad']]
                C = [x for x in B if x['in_']]        # in は付いたのに読めない
                ng += len(B) + (1 if b['docH'] != a['docH'] else 0)
                ng += a['infold']       # 初回画面の中で読めないものは事故
                # 伏せが0個でも、画面の外に印が無いなら正しい（伏せる相手が居ない）。
                # ★ 携帯では版面が 1024x2217 になるので、短い頁は印が全部
                #   初回画面に入る（campaign / staff_* / 404 が実際にそう）。
                outside = len([m for m in a['marks'] if m['y'] > a['vh']])
                if n and outside and not a['below']:
                    ng += 1
                print('  %-30s %5d %6d %6d %6d %5d%s' %
                      (p, n, a['infold'], len(B), len(C), peak,
                       '  ← 版面が動いた' if b['docH'] != a['docH'] else ''))
                if a['infold']:
                    print('        ← **初回画面の中**に読めない印が %d 個'
                          '（画面の外で伏せているのは正しい動作）' % a['infold'])
                for x in (C or B)[:4]:
                    print('        %-5s y=%-6d op=%s clip=%d in=%d | %s'
                          % (x['k'], x['y'], x['op'], x['clip'], x['in_'], x['t']))
                if n and outside and not a['below']:
                    print('        ← 画面の外に印が %d 個あるのに、伏せられていたのが0個'
                          '（出現が働いていない／読み込み時に走り切っている）' % outside)
        finally:
            c.close()
    print()
    print('問題 %d 件' % ng)
    return 1 if ng else 0


if __name__ == '__main__':
    sys.exit(main())
