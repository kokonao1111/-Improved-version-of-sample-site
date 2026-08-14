#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""スクロール出現を、実際に送って測る。

  使い方:  python3 -m http.server 8899   （site/ で）
           python3 _tools/reveal.py [ページ名の一部 ...]
  戻り値:  1 なら「透明のまま残るもの」か「出現が働いていない」か「版面が動いた」

■ なぜこの道具を作ったか

出現をスクロール駆動にすると、事故の形が変わる。
「はみ出す」でも「重なる」でもなく、**中身が透明のまま残る**。
verify.py は描かれた矩形を測るので、透明でも矩形は在り、掛からない。
rules.py は画素を見るが、上から6000pxを一度撮るだけなので送っていない。

js/lr-reveal.js には、面（opacity）をスクロール駆動にしなかった理由として
「検証手段が headless に無い（スクロール駆動の進行が計測できない）」と
書いてあった。**それは誤りだった。**枠の中の頁は scrollTo で送れるし、
getComputedStyle はいつでも読める。この道具はそれをする。

■ この環境で測れること・測れないこと

測れない：**アニメーションの進行**。この headless はフレームを作らないので、
  始まった animation が進まない（playState=running のまま currentTime=0。
  document.timeline は 4788ms 進んでいるのに、という状態を実測した）。
  進行は CSS と描画エンジンの仕事で、こちらが書いた JS の責任ではない。
測れる：**印が付くか**（掃き取りが働いたか）と、
  **終端に送ったときに不透明になるか**（CSS の書き方が正しいか）と、
  **伏せられているか**（画面外で）と、**版面が動かないか**。
なので送りきったあと getAnimations().finish() で終端へ送ってから読む。

■ 測ること

  A. 上から下まで送ったあと、**文字か画像を持つ要素**の実効不透明度が
     すべて 0.99 以上。1つでも欠けたら失格
       ・実効＝先祖の opacity を全部掛けた値。自分だけ見ても足りない
       ・ただし**出現の対象だけ**を失格にする。扉写真の Previous / Next の
         矢印のように、もともと CSS で伏せてあるものが在る（実測2件）。
         対象かどうかは data-lr か、走っている animation-name で判定し、
         対象外の伏せは「他」として数だけ出す（黙って捨てない）
  B. 送る前に、画面の下にあるもののうち1つ以上が 0.99 未満
       ＝出現が本当に働いている。全部 1 なら「掛かっていない」ので失格
       （これが無いと、出現を丸ごと壊しても緑になる）
  C. 送っている間に document の高さが変わらない（CLS）
  D. 各要素の文書内 y 座標が、送る前と送った後で 1px も動かない
       ＝出現がレイアウトに触っていない

■ この headless の癖（重要）

scrollTo で scrollY は動くが、**scroll イベントが発火しない**。
IntersectionObserver の通知も届かない。どちらも「描画の機会」に紐づくため。
なので検査の側から scroll を発火させる（→ fire()）。
実機では発火するものを、同じ形で作って測っている。

■ 幕（プリローダー）

セッション最初の1ページだけ全面を覆うので、枠を作る前に「見た」印を置く。
置かないと全面が生成りの地になり、何も測れない。
"""
import html as H
import json
import os
import re
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = '/Users/nsohiro/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'http://127.0.0.1:8899/'

# 実際の窓の大きさで測る。出現は「画面に入ったか」で決まるので、
# 窓の高さを持たない測り方（16000pxの枠に流し込む）では意味が無い。
VIEWS = [(390, 844), (1440, 900)]
PAGES = [
    'index.html', 'beginner/index.html', 'trial/index.html',
    'course_plan/index.html', 'how_to_choose/index.html', 'faq/index.html',
    'campaign/index.html', 'shopinfo/index.html',
    'singlefolder/reservation.html', 'singlefolder/staff.html',
    'singlefolder/staff_1.html', '404.html',
]

PROBE = '''<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">
<script>
/* 幕はセッション最初の1ページだけ出る。枠を作る前に「見た」印を置く。 */
try{sessionStorage.setItem('lr-pre','1');}catch(e){}
</script>
<iframe id="f" src="%(url)s" style="width:%(w)dpx;height:%(h)dpx;border:0;display:block"></iframe>
<pre id="R" style="position:absolute;left:-99999px;top:0"></pre>
<script>
var f=document.getElementById('f'), out=document.getElementById('R');
window.onerror=function(m){ out.textContent=JSON.stringify({err:String(m)}); };
f.onload=function(){ setTimeout(function(){ try{ start(); }catch(e){ out.textContent=JSON.stringify({err:String(e)}); } }, %(wait)d); };

function collect(d, win){
 /* 文字か画像を持つ要素だけを見る。器は見ない ―
    器が透明でも中身が見えていれば読めるし、逆に器が不透明でも
    中身が透明なら読めない。判定は「読むもの」の側に置く。 */
 var res=[], seen=0;
 var all=d.querySelectorAll('*');
 for(var i=0;i<all.length;i++){
  var e=all[i];
  var own=false;
  for(var n=e.firstChild;n;n=n.nextSibling){
   if(n.nodeType===3 && n.nodeValue.replace(/\\s/g,'')){own=true;break;}
  }
  if(!own && e.tagName!=='IMG') continue;
  var r=e.getBoundingClientRect();
  if(r.width<2||r.height<2) continue;
  var c=win.getComputedStyle(e);
  if(c.visibility==='hidden'||c.display==='none') continue;
  /* 実効不透明度＝先祖の opacity を全部掛ける */
  var op=1, hid=false, why='';
  for(var p=e; p && p.nodeType===1; p=p.parentNode){
   var pc=win.getComputedStyle(p);
   if(pc.display==='none'||pc.visibility==='hidden'){hid=true;break;}
   var po=parseFloat(pc.opacity);
   if(po<0.99 && !why){ why=sig(p)+'(opacity '+po+' data-lr='+(p.getAttribute?p.getAttribute('data-lr'):'')
     +' in='+(p.hasAttribute?p.hasAttribute('data-lr-in'):'')+' anim='+pc.animationName+')'; }
   op *= po;
  }
  if(hid) continue;
  /* 「出現の対象か」を持たせる。
     もともと CSS で伏せてあるもの（扉写真の Previous / Next の矢印など）と、
     出現が途中で止まって伏せられたままのものを区別するため。
     この印が無ければ、意図して伏せてあるものを毎回誤検出する。 */
  var mine=0, an='';
  for(var q=e; q && q.nodeType===1; q=q.parentNode){
   if(q.hasAttribute && q.hasAttribute('data-lr')){mine=1;break;}
   var qc=win.getComputedStyle(q);
   if(/lr-fill|lr-draw|lr-pre-write/.test(qc.animationName)){mine=1;an=qc.animationName;break;}
  }
  seen++;
  res.push({s:sig(e), y:Math.round(r.top+win.scrollY), o:Math.round(op*1000)/1000, m:mine, w:why,
            t:(e.textContent||e.getAttribute('src')||'').replace(/\\s+/g,' ').trim().slice(0,20)});
 }
 return res;
}
function sig(e){
 var s=e.tagName.toLowerCase();
 if(e.id) s+='#'+e.id;
 if(e.className && typeof e.className==='string')
  s+='.'+e.className.trim().split(/\\s+/).slice(0,2).join('.');
 return s;
}

/* ★ この headless は scrollTo で scrollY を動かしても
   **scroll イベントを一度も発火しない**（実測：枠が受けた scroll = 0）。
   IntersectionObserver の通知も同じ理由で届かない（張り直しても callback 0回）。
   どちらも「描画の機会」に紐づいて配られるものなので、
   フレームを作らない環境では出て来ない。
   実機では発火するので、**検査の側から発火させて**同じ状態を作る。
   これで頁の側の listener（掃き取り）が実際に呼ばれ、
   「送れば出る」ことを実測できる。 */
function fire(win){
 try{ win.dispatchEvent(new win.Event('scroll')); }catch(e){
  try{ var ev=win.document.createEvent('Event'); ev.initEvent('scroll',true,true); win.dispatchEvent(ev); }catch(e2){}
 }
}

function start(){
 var d=f.contentDocument, win=f.contentWindow;
 var log={h0:0,h1:0,before:[],after:[],lowest:{},marks:0};
 log.marks = d.querySelectorAll('[data-lr]').length;
 log.sweepable = d.querySelectorAll('[data-lr="sheet"],[data-lr="head"],[data-lr="name"],[data-lr="orn"]').length;
 log.h0 = d.documentElement.scrollHeight;

 var before = collect(d, win);
 log.before = before;

 var vh = win.innerHeight;
 var steps = Math.ceil(d.documentElement.scrollHeight / (vh*0.8)) + 2;
 var i = 0;
 (function step(){
  if(i>steps){ finish(); return; }
  win.scrollTo(0, Math.round(i*vh*0.8));
  fire(win);
  i++;
  /* requestAnimationFrame は使わない。
     --virtual-time-budget で早送りしている間、headless では描画の機会が
     作られず rAF が呼ばれないことがある（実測：一度も返って来なかった）。
     setTimeout なら仮想時間で必ず進む。 */
  setTimeout(step, 120);
 })();

 function finish(){
  win.scrollTo(0, d.documentElement.scrollHeight); fire(win);
  setTimeout(function(){
   win.scrollTo(0,0); fire(win);
   setTimeout(function(){
    log.inn = d.querySelectorAll('[data-lr-in]').length;
    log.notin = d.querySelectorAll('[data-lr="sheet"]:not([data-lr-in]),'
              + '[data-lr="head"]:not([data-lr-in]),'
              + '[data-lr="name"]:not([data-lr-in]),[data-lr="orn"]:not([data-lr-in])').length;
    /* ★ ここでアニメーションを終端まで送る。
       この headless はフレームを作らないので、始まったアニメーションが
       進まない（実測：playState=running のまま currentTime=0、
       document.timeline は 4788ms 進んでいるのに）。
       進行そのものは CSS の仕事で、こちらの書いた JS の責任ではない。
       測るべきは「印が付いたか」と「終わったときに不透明になるか」。
       finish() で終端に送ってから読む。 */
    try{ d.getAnimations().forEach(function(a){ try{a.finish();}catch(e){} }); }catch(e){}
    log.h1 = d.documentElement.scrollHeight;
    log.after = collect(d, win);
    out.textContent = JSON.stringify(log);
   }, 600);
  }, 600);
 }
}
</script></body>'''


def probe(page, w, h, wait=2200):
    cache = tempfile.mkdtemp(prefix='reveal-')
    tmp = os.path.join(ROOT, '__reveal.html')
    try:
        with open(tmp, 'w', encoding='utf-8') as fh:
            fh.write(PROBE % {'url': BASE + page, 'w': w, 'h': h, 'wait': wait})
        r = subprocess.run(
            [CHROME, '--headless', '--disable-gpu', '--no-sandbox',
             '--disk-cache-dir=' + cache, '--hide-scrollbars',
             '--virtual-time-budget=120000',
             '--window-size=%d,%d' % (w, h + 40),
             '--dump-dom', BASE + '__reveal.html'],
            capture_output=True, text=True, timeout=300)
        m = re.search(r'<pre id="R"[^>]*>(.*?)</pre>', r.stdout, re.S)
        if not m or not m.group(1).strip():
            return None
        return json.loads(H.unescape(m.group(1)))
    except Exception:
        return None
    finally:
        os.path.exists(tmp) and os.remove(tmp)


def judge(log, vh):
    """(問題のリスト, 出現が働いた個数) を返す"""
    bad = []
    after = {e['s'] + '@' + str(e['y']): e for e in log['after']}

    # A. 送ったあと、透明のまま残っているもの（出現の対象だけ）
    others = 0
    for e in log['after']:
        if e['o'] >= 0.99:
            continue
        if not e.get('m'):
            others += 1     # もともと CSS で伏せてあるもの。数えるが失格にしない
            continue
        bad.append('透明のまま残った %s "%s" y%d 不透明度%.2f%s'
                   % (e['s'], e['t'], e['y'], e['o'],
                      '  ← ' + e['w'] if e.get('w') else ''))

    # A2. 送りきったのに印が付いていない対象が在るか
    if log.get('notin'):
        bad.append('送りきっても出ていない対象が %d 個（data-lr-in が付いていない）'
                   % log['notin'])

    # B. 送る前に、画面の下で伏せられているものが在るか
    hidden_below = [e for e in log['before'] if e['o'] < 0.99 and e['y'] > vh]
    # C. 版面の高さが変わっていないか
    if log['h0'] != log['h1']:
        bad.append('版面の高さが変わった %d → %d px' % (log['h0'], log['h1']))
    # D. 位置が動いていないか
    moved = 0
    for e in log['before']:
        k = e['s'] + '@' + str(e['y'])
        if k not in after:
            moved += 1
    if moved:
        bad.append('%d 個の要素の文書内の位置が動いた' % moved)

    return bad, len(hidden_below), others


def main():
    want = sys.argv[1:]
    pages = [p for p in PAGES if not want or any(x in p for x in want)]
    total_bad = 0
    total_hidden = 0
    for page in pages:
        marks = []
        detail = []
        for (w, h) in VIEWS:
            log = probe(page, w, h)
            if log is None:
                marks.append('%d?' % w)
                continue
            bad, hidden, others = judge(log, h)
            total_hidden += hidden
            if bad:
                total_bad += len(bad)
                marks.append('\x1b[31m%dx%d(出%d/%d)\x1b[0m'
                             % (w, h, log.get('inn', 0), log.get('sweepable', 0)))
                for b in bad[:4]:
                    detail.append('     %dx%d  %s' % (w, h, b))
            else:
                marks.append('%dx%d(伏せ%d 出%d/%d%s)' % (w, h, hidden,
                             log.get('inn', 0), log.get('sweepable', 0),
                             ' 他%d' % others if others else ''))
        print('  %-30s %s' % (page, ' '.join(marks)))
        for d in detail:
            print(d)
    print()
    print('%d ページ × %d 窓 ─ 問題 %d件 ／ 画面外で伏せられていた要素 のべ%d個'
          % (len(pages), len(VIEWS), total_bad, total_hidden))
    if total_hidden == 0:
        print('※ 伏せが0個です。出現が1つも働いていないか、')
        print('  すべて読み込み時に走り終えています（スクロール駆動になっていない）。')
        return 1
    return 1 if total_bad else 0


if __name__ == '__main__':
    sys.exit(main())
