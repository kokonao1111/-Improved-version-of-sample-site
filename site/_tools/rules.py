#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
罫が文字を貫通していないかを、描画された画素で見る。

  使い方:  python3 -m http.server 8899   （site/ で）
           python3 _tools/rules.py [ページ名の一部 ...]
  戻り値:  1 なら貫通あり

■ なぜ画素で見るのか

同じ種類の見落としを3回した。どれも DOM を測る検査では捕まらない。

  1. .kome_line   罫を絶対配置で全幅に渡し、文字の下に白を敷いて隠していた
  2. .lr-book-h   同上。白を外した瞬間に「ご予約・お問い合わせ」を貫通した
  3. assets/bg.png  **body の背景画像**の中に罫が描いてあった（20×175。
     y0〜2 に上端の帯、y171 と y174 に #D9C79D の二重線）。
     「ヘッダー145 ＋ ナビ30 ＝ 175px」を前提に置かれた絵で、位置が
     ページ上端からの固定値。ヘッダーを可変高にしたので、ヘッダーが伸びる幅で
     この線が「OPEN：10:00〜」やナビの項目の上に取り残された。
     **絵の中の線なので、CSSをいくら読んでも出てこない。**

描画結果を見るしかない。

■ 判定

  ・「その場の地より暗い」画素が横に85%以上並び、厚みが3px以下の行 ＝ 罫
  ・その罫が、文字の幅の中を実際に通っていて（その区間でも85%以上）、
    かつ「字面」の上端と下端の内側にあれば貫通

    地色は白と決め打ちできない（→ line() の注釈）。

    3つとも要る。
      重なりの量では駄目：1pxの罫と行boxの重なりは1pxしかない
      縦の範囲だけでも駄目：.kome_line は罫が文字の左右にあり高さが同じ
      行boxでも駄目：beginner の「4.」は61pxの数字で行boxが88pxあり、
                     見出しの下罫がその中に入る

罫と行boxの両方が要るので、Chrome を1回起動して
--screenshot と --dump-dom を同時に取る。画素の座標と DOM の座標は
iframe を左上に置くことで1:1に合わせている。

■ 見る範囲
上から6000px。ページはおおむね4000〜6000pxなので大半が入る。
それを超える分は見ていない（数を黙って減らさないためここに書く）。
"""
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
    """その画素が「地の上に引かれた線」か。

    ■ 白決め打ちで2件誤検出した
    もとは「R,G,B が全部245超なら地色」としていた。予約帯の地は
    クリーム（実測 中央246・青は240台前半）なので、**帯の中の全画素が
    「非地色」**になり、どの行も横に100%埋まっているように見えた。
    そこへ文字の行box が重なると条件を全部通ってしまう
    （campaign と reservation の 320px、「第１第３日曜日」。
      切り出して目で確認済み。罫は無い）。

    地色は場所によって違う（白・クリーム・写真）。決め打ちできない。
    **上下5pxの明るい方をその場の地**とし、そこから3色の合計で75
    （1色あたり25）以上暗ければ線とする。

      ・本物の罫  … 上下は地なので、横一列ぜんぶが暗い → 見つかる
      ・色地の帯  … 上下も同じ色なので差が出ない → 数えない
      ・文字の行  … 暗いのは字のある列だけ。横85%は埋まらない → 数えない
    """
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
                # ① 罫が文字の幅の中を実際に通っているか。
                #    .kome_line は罫が文字の左右にあるだけで高さは同じなので、
                #    縦の範囲だけ見ると必ず誤検出になる。
                if sum(1 for x in cols if line(px, x, y, Hh)) < len(cols) * 0.85:
                    continue
                # ② 行boxではなく「字面」の中か。
                #    beginner の「4.」は61pxの数字なので行boxが88pxあり、
                #    見出しの下罫がその中に入って誤検出になる。
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
