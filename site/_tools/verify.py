#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
表示の検査。ヘッドレス Chrome で実際に描かせて測る。

  使い方:  python3 -m http.server 8899   （site/ で）
           python3 _tools/verify.py [ページ名の一部 ...]
  戻り値:  1 なら問題あり

見るのは7つ。

  1. 横のはみ出し ── 器より広い要素
  2. 文字の重なり ── 要素の矩形ではなく「行box」で測る。
     矩形で測ると float の隣にある段落が必ず誤検出になる。
  3. コントラスト ── 大きい文字は3:1、小さい文字は4.5:1（WCAG 1.4.3）
  4. 段組みの空き ── 3枚しかない札が2列で並ぶと4枠目が必ず空く
  5. 罫が文字を貫通 ── 下罫を持つ箱から中身が溢れていないか
  5b. 切り落とし ── 固定の高さ＋overflow:hidden で中身が黙って消えていないか
  6. 画像の不在 / JS のエラー
  7. 版面 ── 1040px以上で中身がちょうど1000pxか

■ 幅は22点とる。
以前は 320/390/640/1040/1440 の5点しか測っておらず、しかも2点は
折り返す幅そのものだった。そのため 700〜1000px の崩れを全部見落とし、
・3枚組の札の4枠目が空く
・見出しが2行になって下罫が文字を貫通する
・写真と文が左に寄る
・コース表が潰れる
を利用者に指摘されて初めて知った。**隙間を測らない検査は検査ではない。**

■ 1ページ1起動。
同じページを幅の違う iframe に並べて一度に測る。
1幅ごとに Chrome を起動すると 22×11 = 242 回になり40分かかる。
"""
import html as H
import json
import os
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = '/Users/nsohiro/Desktop/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'http://127.0.0.1:8899/'

WIDTHS = [320, 360, 390, 430, 480, 540, 600, 640, 700, 768, 834,
          900, 960, 1000, 1024, 1040, 1120, 1200, 1280, 1366, 1440, 1600]

PAGES = [
    'index.html',
    'beginner/index.html',
    'trial/index.html',
    'course_plan/index.html',
    'how_to_choose/index.html',
    'faq/index.html',
    'campaign/index.html',
    'shopinfo/index.html',
    'singlefolder/reservation.html',
    'singlefolder/staff.html',
    'singlefolder/staff_1.html',
    '404.html',
]

PROBE = r'''<!doctype html><meta charset="utf-8"><body style="margin:0">
<div id="hold"></div>
<script>
var URL_=%(url)s, WS=%(widths)s, ERR={};
var hold=document.getElementById('hold'), frames=[], left=WS.length;

function CHECK(d,W,out){
 function lum(c){var m=/(\d+),\s*(\d+),\s*(\d+)/.exec(c);if(!m)return null;
  var v=[1,2,3].map(function(i){var x=+m[i]/255;return x<=0.03928?x/12.92:Math.pow((x+0.055)/1.055,2.4);});
  return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2];}
 function ratio(a,b){var l1=lum(a),l2=lum(b);if(l1===null||l2===null)return null;
  var hi=Math.max(l1,l2),lo=Math.min(l1,l2);return (hi+0.05)/(lo+0.05);}
 function bgOf(e){for(var n=e;n&&n.nodeType===1;n=n.parentNode){
  var b=getComputedStyle(n).backgroundColor;
  if(b&&b!=='rgba(0, 0, 0, 0)'&&b!=='transparent'&&!/,\s*0\)$/.test(b))return b;}
  return 'rgb(255, 255, 255)';}
 /* 与えた矩形が実際には見えていないか。矩形を渡すのは、切り抜いているのが
    「祖先」ではなく「その要素自身」の場合があるため（overflow:auto の箱） */
 function hidden(r,e){
  for(var n=e;n&&n.nodeType===1;n=n.parentNode){
   var c=getComputedStyle(n),nr=n.getBoundingClientRect();
   if(parseFloat(c.opacity)<0.1) return true;
   if(c.visibility==='hidden') return true;
   /* 読み上げ専用の隠し文字。1x1に潰して clip している。clip は行boxの座標を変えない */
   if(n===e&&(nr.width<=1||nr.height<=1)) return true;
   if(c.overflow!=='visible'&&c.overflow!==''){
    var iw=Math.max(0,Math.min(nr.right,r.right)-Math.max(nr.left,r.left));
    var ih=Math.max(0,Math.min(nr.bottom,r.bottom)-Math.max(nr.top,r.top));
    if(iw*ih < r.width*r.height*0.5) return true;}}
  return false;}
 function clipped(e){var r=e.getBoundingClientRect();
  return (!r.width||!r.height)?true:hidden(r,e);}
 function sig(e){return e.tagName+(e.id?'#'+e.id:'')
  +(e.className?'.'+String(e.className).split(' ')[0]:'');}

 /* 1. 横のはみ出し */
 [].forEach.call(d.querySelectorAll('body *'),function(e){
  var c=getComputedStyle(e);
  if(c.display==='none'||c.position==='fixed')return;
  if(e.closest('.flexslider,.slides,.flex-viewport'))return;
  var r=e.getBoundingClientRect();
  if(r.width&&r.right>W+1.5&&!clipped(e))
   out.overflow.push(sig(e)+' 右端'+Math.round(r.right));});

 /* 2. 文字の重なり（行box同士） */
 var boxes=[],walk=d.createTreeWalker(d.body,NodeFilter.SHOW_TEXT,null),n;
 while(n=walk.nextNode()){
  if(!n.nodeValue.replace(/\s/g,''))continue;
  var pe=n.parentNode;
  if(!pe||getComputedStyle(pe).display==='none')continue;
  if(pe.closest('.flexslider,.slides,.flex-viewport'))continue;
  var rg=d.createRange();rg.selectNodeContents(n);
  [].forEach.call(rg.getClientRects(),function(r){
   if(r.width>1&&r.height>1&&!hidden(r,pe))boxes.push({r:r,el:pe});});}
 for(var i=0;i<boxes.length;i++)for(var j=i+1;j<boxes.length;j++){
  var A=boxes[i],B=boxes[j];
  if(A.el===B.el||A.el.contains(B.el)||B.el.contains(A.el))continue;
  var ow=Math.min(A.r.right,B.r.right)-Math.max(A.r.left,B.r.left);
  var oh=Math.min(A.r.bottom,B.r.bottom)-Math.max(A.r.top,B.r.top);
  if(ow>2&&oh>2)out.overlap.push(sig(A.el)+' × '+sig(B.el)+' '+Math.round(ow)+'x'+Math.round(oh));}

 /* 3. コントラスト */
 var seen={};
 [].forEach.call(d.querySelectorAll('body *'),function(e){
  var has=false;
  [].forEach.call(e.childNodes,function(c){if(c.nodeType===3&&c.nodeValue.replace(/\s/g,''))has=true;});
  if(!has)return;
  var c=getComputedStyle(e);
  if(c.display==='none'||c.visibility==='hidden'||parseFloat(c.opacity)<0.1)return;
  if(clipped(e))return;
  var r=e.getBoundingClientRect(); if(r.width<=1||r.height<=1)return;
  var fs=parseFloat(c.fontSize),bold=(parseInt(c.fontWeight,10)||400)>=700;
  var need=((fs>=24)||(fs>=18.66&&bold))?3:4.5, got=ratio(c.color,bgOf(e));
  if(got===null||got>=need-0.005)return;
  var k=sig(e)+'|'+c.color+'|'+Math.round(fs);
  if(seen[k])return; seen[k]=1;
  out.contrast.push(sig(e)+' '+Math.round(fs)+'px '+(Math.round(got*100)/100)+' <'+need);});

 /* 4. 段組みの空き ── 最終行が埋まらない並び */
 [].forEach.call(d.querySelectorAll('ul.thumbnailList, #B000000172 ul'),function(ul){
  var li=[].filter.call(ul.children,function(e){
   return e.tagName==='LI'&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width;});
  if(li.length<2)return;
  var rows={},cols=0;
  li.forEach(function(e){var y=Math.round(e.getBoundingClientRect().top);
   var k=Object.keys(rows).filter(function(q){return Math.abs(q-y)<8;})[0];
   if(k===undefined)k=y; rows[k]=(rows[k]||0)+1; cols=Math.max(cols,rows[k]);});
  var ks=Object.keys(rows);
  if(ks.length<2||cols<2)return;
  var last=rows[ks[ks.length-1]];
  if(last<cols)
   out.holes.push((ul.parentNode.id||'?')+' '+li.length+'枚を'+cols+'列 → 最終行'+last+'枚（'+(cols-last)+'枠空き）');});

 /* 5. 下罫を持つ箱から中身が溢れていないか（罫が文字を貫通する） */
 [].forEach.call(d.querySelectorAll('#SF-contents *'),function(e){
  var c=getComputedStyle(e);
  if(c.borderBottomStyle==='none'||parseFloat(c.borderBottomWidth)<0.5)return;
  if(c.overflow!=='visible'&&c.overflow!=='')return;
  if(!e.childNodes.length)return;
  var h=e.getBoundingClientRect().height; if(!h)return;
  if(e.scrollHeight>Math.ceil(h)+2)
   out.rulecross.push(sig(e)+' 箱'+Math.round(h)+' 中身'+e.scrollHeight);});

 /* 5b. 固定の高さで中身が切り落とされていないか

    生成CSSは器に height:410px のような固定値を持たせたうえで
    overflow:hidden を掛けている。原稿や画像が伸びると、はみ出した分が
    **黙って消える**。何も表示されないので気づけない。実際に3回起きた。
      #B000000031 … 「Contact」ボタンの下半分が消えた（26〜38px）
      #B000000030 … 営業日カレンダーの下が消えた（235px）
      .wrap       … トップだけ「© CALDINA」のフッターが丸ごと消えた（100px）

    「中身が器より高い」だけでは扉写真の内部構造などで誤検出になる
    （実測で9pxの差が出るが、器の外に出ている子孫は無い）。
    **器の下端より下に、実際に矩形を持つ子孫がいるか**で判定する。 */
 [].forEach.call(d.querySelectorAll('body *'),function(e){
  var c=getComputedStyle(e);
  if(c.overflow!=='hidden'&&c.overflowY!=='hidden')return;
  if(e.closest('.flexslider,.slides,.flex-viewport'))return;
  var r=e.getBoundingClientRect(); if(!r.height||!r.width)return;
  if(e.scrollHeight<=Math.ceil(r.height)+4)return;
  var lost=[].filter.call(e.querySelectorAll('*'),function(q){
   var qr=q.getBoundingClientRect();
   return qr.height>2&&qr.width>2&&qr.top>r.bottom-2;});
  if(!lost.length)return;
  out.clipped.push(sig(e)+' 器'+Math.round(r.height)+' 中身'+e.scrollHeight
    +' → '+lost.length+'個が器の外 ('+sig(lost[0])+')');
 });

 /* 6. 画像 */
 [].forEach.call(d.images,function(im){
  if(im.complete&&im.naturalWidth===0)out.images.push(im.getAttribute('src'));});

 /* 7. 版面 */
 var oc=d.getElementById('SF-outer-container');
 if(oc)out.inner=Math.round(oc.getBoundingClientRect().width-40);
}

WS.forEach(function(W){
 var f=document.createElement('iframe');
 f.style.cssText='width:'+W+'px;height:16000px;border:0;display:block';
 f.dataset.w=W; f.src=URL_;
 f.onload=function(){
  try{f.contentWindow.onerror=function(m){(ERR[W]=ERR[W]||[]).push(String(m));};}catch(e){}
  if(--left===0) setTimeout(run,%(wait)d);};
 hold.appendChild(f); frames.push(f);
});

function run(){
 var res={};
 frames.forEach(function(f){
  var W=+f.dataset.w;
  var out={overflow:[],overlap:[],contrast:[],holes:[],rulecross:[],clipped:[],images:[],
           errors:ERR[W]||[],inner:null};
  try{ CHECK(f.contentDocument,W,out); }catch(e){ out.errors.push('検査中の例外: '+e); }
  res[W]=out;});
 var pre=document.createElement('pre');pre.id='R';
 pre.textContent=JSON.stringify(res);document.body.appendChild(pre);
}
</script></body>
'''


def probe(page, widths, wait=2600):
    cache = tempfile.mkdtemp(prefix='verify-')
    tmp = os.path.join(ROOT, '__probe.html')
    try:
        with open(tmp, 'w', encoding='utf-8') as fh:
            fh.write(PROBE % {'url': json.dumps(BASE + page),
                              'widths': json.dumps(widths), 'wait': wait})
        r = subprocess.run(
            [CHROME, '--headless', '--disable-gpu', '--no-sandbox',
             '--disk-cache-dir=' + cache, '--hide-scrollbars',
             '--virtual-time-budget=%d' % (wait + 40000),
             '--window-size=1700,900', '--dump-dom', BASE + '__probe.html'],
            capture_output=True, text=True, timeout=600)
        s = r.stdout
        i, j = s.find('<pre id="R">'), s.rfind('</pre>')
        if i < 0 or j < 0:
            return None
        return json.loads(H.unescape(s[i + 12:j]))
    except Exception as e:
        print('   （計測失敗: %s）' % e)
        return None
    finally:
        os.path.exists(tmp) and os.remove(tmp)
        shutil.rmtree(cache, ignore_errors=True)


KINDS = [('overflow', 'はみ出し'), ('overlap', '重なり'), ('contrast', 'コントラスト'),
         ('holes', '段の空き'), ('rulecross', '罫が貫通'), ('clipped', '切り落とし'),
         ('images', '画像不在'), ('errors', 'JSエラー')]


def main():
    want = sys.argv[1:]
    pages = [p for p in PAGES if not want or any(w in p for w in want)]
    bad = 0
    total = 0
    detail = {}
    for page in pages:
        res = probe(page, WIDTHS)
        if res is None:
            print('  ✗ %-30s 計測できず' % page)
            bad += 1
            continue
        line = []
        for w in WIDTHS:
            d = res.get(str(w)) or res.get(w)
            total += 1
            if d is None:
                line.append('?')
                continue
            p = []
            for k, lab in KINDS:
                if d[k]:
                    p.append('%s%d' % (lab, len(d[k])))
            if w >= 1040 and d.get('inner') not in (None, 1000):
                p.append('版面%s' % d['inner'])
            if p:
                bad += 1
                line.append('\x1b[31m%d\x1b[0m' % w)
                detail.setdefault(page, []).append((w, p, d))
            else:
                line.append('%d' % w)
        print('  %-30s %s' % (page, ' '.join(line)))
    print()
    if detail:
        print('── 内訳 ' + '─' * 60)
        for page, rows in detail.items():
            print('■ %s' % page)
            for w, p, d in rows:
                print('   %5dpx  %s' % (w, ' / '.join(p)))
                for k, lab in KINDS:
                    for x in d[k][:4]:
                        print('           %-8s %s' % (lab, x))
                if len(rows) > 6:
                    pass
        print()
    print('%d ページ × %d 幅 = %d 組 ─ 問題 %d 組' % (len(pages), len(WIDTHS), total, bad))
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
