"""罫が文字を貫通していないかを、描画された画素で見る"""
import html as H
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = '/Users/nsohiro/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'http://127.0.0.1:8899/'

WIDTHS = [320, 390, 640, 780, 1040, 1440]
CAP = 6000
PAGES = [
    'index.html', 'beginner/index.html', 'trial/index.html',
    'course_plan/index.html', 'how_to_choose/index.html', 'faq/index.html',
    'campaign/index.html', 'shopinfo/index.html',
    'singlefolder/reservation.html', 'singlefolder/staff.html', '404.html',
]

PROBE = '''<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">
<script>
/* 幕（プリローダー）はセッションで最初の1ページだけ出る。
   枠を作る**前に**「見た」印を置く。置かないと、撮った絵の全面が
   幕（生成りの地＋紋章）になり、罫も文字も1つも写らない。 */
try{sessionStorage.setItem('lr-pre','1');}catch(e){}
</script>
<iframe id="f" src="%(url)s" style="width:%(w)dpx;height:%(h)dpx;border:0;display:block"></iframe>
<script>
document.getElementById('f').onload=function(){setTimeout(function(){
 var d=f.contentDocument,out=[];
 function hidden(r,e){
  for(var n=e;n&&n.nodeType===1;n=n.parentNode){
   var c=getComputedStyle(n),nr=n.getBoundingClientRect();
   if(parseFloat(c.opacity)<0.1||c.visibility==='hidden')return true;
   /* position:fixed は本文の上に浮くもの（メニューのボタン、下端の帯）。
      この検査は6000pxの窓に流し込んで撮っているので、浮きものは
      「窓の下端から72px」＝ y5928 に描かれ、そこにたまたま来た本文の罫と
      重なる。実機では指で送った位置に浮くだけで、罫が字を貫くわけではない。
      ボタンは地色を持っているので、その地色自体も「横に長い非地色」として
      罫に見えてしまう。浮きものの中の字は数えない。 */
   if(c.position==='fixed')return true;
   if(n===e&&(nr.width<=1||nr.height<=1))return true;
   if(c.overflow!=='visible'&&c.overflow!==''){
    var iw=Math.max(0,Math.min(nr.right,r.right)-Math.max(nr.left,r.left));
    var ih=Math.max(0,Math.min(nr.bottom,r.bottom)-Math.max(nr.top,r.top));
    if(iw*ih<r.width*r.height*0.5)return true;}}
  return false;}
 var w=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT,null),n;
 while(n=w.nextNode()){
  if(!n.nodeValue.replace(/\\s/g,''))continue;
  var pe=n.parentNode; if(!pe||getComputedStyle(pe).display==='none')continue;
  var rg=d.createRange(); rg.selectNodeContents(n);
  var tx=n.nodeValue.replace(/\\s+/g,' ').trim().slice(0,22);
  [].forEach.call(rg.getClientRects(),function(r){
   if(r.width>1&&r.height>1&&!hidden(r,pe))
    out.push([Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom),tx]);});}
 var p=document.createElement('pre');p.id='R';
 p.style.cssText='position:absolute;left:-99999px;top:0';
 p.textContent=JSON.stringify(out);document.body.appendChild(p);
},%(wait)d);};
</script></body>'''

def ink(p):
    """字面らしい濃さか"""
    return (p[0] + p[1] + p[2]) < 480

def line(px, x, y, Hh):
    """その画素が「地の上に引かれた線」か"""
    a = px[x, max(0, y - 5)]
    b = px[x, min(Hh - 1, y + 5)]
    return sum(px[x, y]) < max(sum(a), sum(b)) - 75

def darker(px, xs, y, y2, Hh):
    """上下より暗いか。色地の帯の境目（明→明）を罫と取り違えないため。"""
    def avg(yy):
        yy = max(0, min(Hh - 1, yy))
        return sum(sum(px[x, yy]) for x in xs) / len(xs)
    return avg(y) < avg(y - 5) - 30 and avg(y) < avg(y2 + 5) - 30

def probe(page, w, wait=2600):
    cache = tempfile.mkdtemp(prefix='rules-')
    tmp = os.path.join(ROOT, '__rules.html')
    shot = os.path.join(cache, 's.png')
    try:
        with open(tmp, 'w', encoding='utf-8') as fh:
            fh.write(PROBE % {'url': BASE + page, 'w': w, 'h': CAP, 'wait': wait})
        r = subprocess.run(
            [CHROME, '--headless', '--disable-gpu', '--no-sandbox',
             '--disk-cache-dir=' + cache, '--hide-scrollbars',
             '--virtual-time-budget=%d' % (wait + 14000),
             '--window-size=%d,%d' % (w, CAP),
             '--screenshot=' + shot, '--dump-dom', BASE + '__rules.html'],
            capture_output=True, text=True, timeout=300)
        m = re.search(r'<pre id="R"[^>]*>(.*?)</pre>', r.stdout, re.S)
        if not m or not os.path.exists(shot):
            return None, None
        keep = os.path.join(cache.replace('rules-', 'keep-') + '.png')
        shutil.copy(shot, keep)
        return json.loads(H.unescape(m.group(1))), keep
    except Exception:
        return None, None
    finally:
        os.path.exists(tmp) and os.remove(tmp)

def scan(shot, boxes):
    from PIL import Image
    im = Image.open(shot).convert('RGB')
    W, Hh = im.size
    px = im.load()
    xs = list(range(0, W, 2))
    hits = []
    y = 0
    while y < Hh:
        n = sum(1 for x in xs if line(px, x, y, Hh))
        if n < len(xs) * 0.85:
            y += 1
            continue
        y2 = y
        while y2 + 1 < Hh and sum(1 for x in xs if line(px, x, y2 + 1, Hh)) >= len(xs) * 0.85:
            y2 += 1
        if y2 - y + 1 <= 3 and darker(px, xs, y, y2, Hh):
            for L, T, R, B, tx in boxes:
                if B - T < 6 or R <= 2 or L >= W - 2:
                    continue
                if not (T <= y and y2 <= B):
                    continue
                cols = [x for x in range(max(0, L + 2), min(W, R - 2), 2)]
                if len(cols) < 8:
                    continue

                if sum(1 for x in cols if line(px, x, y, Hh)) < len(cols) * 0.85:
                    continue

                gt = gb = None
                for yy in range(T, min(B + 1, Hh)):
                    if sum(1 for x in cols if ink(px[x, yy])) >= max(2, len(cols) * 0.05):
                        gt = yy if gt is None else gt
                        gb = yy
                if gt is None or not (gt + 1 <= y and y2 <= gb - 1):
                    continue
                hits.append((y, y2 - y + 1, px[W // 2, y], tx, gt, gb))
                break
        y = y2 + 1
    return hits

def main():
    want = sys.argv[1:]
    pages = [p for p in PAGES if not want or any(x in p for x in want)]
    bad = 0
    for page in pages:
        marks = []
        detail = []
        for w in WIDTHS:
            boxes, shot = probe(page, w)
            if boxes is None:
                marks.append('%d?' % w)
                continue
            try:
                hits = scan(shot, boxes)
            finally:
                shutil.rmtree(os.path.dirname(shot), ignore_errors=True)
                os.path.exists(shot) and os.remove(shot)
            if hits:
                bad += len(hits)
                marks.append('\x1b[31m%d\x1b[0m' % w)
                for yy, th, c, tx, T, B in hits[:4]:
                    detail.append('     %5dpx  罫 y%d(厚み%d 色%s) が 文字 y%d〜%d "%s" を貫通'
                                  % (w, yy, th, c, T, B, tx))
            else:
                marks.append('%d' % w)
        print('  %-30s %s' % (page, ' '.join(marks)))
        for d in detail:
            print(d)
    print()
    print('%d ページ × %d 幅（上から%dpx）─ 貫通 %d件' % (len(pages), len(WIDTHS), CAP, bad))
    return 1 if bad else 0

if __name__ == '__main__':
    sys.exit(main())
