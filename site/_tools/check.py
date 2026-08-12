#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
公開前のガード。

このサイトは Louise Rever（和歌山県海南市）のサイトを型として作られている。
その実データが1つでも残ったまま公開すると、CALDINA のサイトから
他店へ電話とLINEが飛び、他店のスタッフの顔写真が CALDINA の名前で出る。

このスクリプトは次の3つを見る。

  1. 他店を特定できる文字列が残っていないか
     ─ base64 と %XX(URLエンコード) の中まで復号して見る。
       どちらも実際にすり抜けた。自動返信メールのフッタが base64 で、
       予約フォームへ内容を引き継ぐリンクの note= が %XX で埋め込まれていて、
       文字列検索ではどちらも一切引っかからなかった。
  2. 伏せ字（{{…}}）がいくつ残っているか
  3. 仮の値（0,000円 の料金・仮の写真）が残っていないか

  使い方:  python3 _tools/check.py
  戻り値:  1 なら「他店のデータが残っている」＝ 公開してはいけない
"""
import base64
import glob
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

# 1つでも残っていたら公開不可
FORBIDDEN = [
    'louiserever', 'Louise Rever', 'LOUISE REVER', 'ルイーズ', 'レヴェ',
    '和歌山', '海南', '073-482-3765', '0734823765', 'pnb6242x',
    'LIANGE', '34.1566', '135.211', '135.212',
    '後垣内', '西崎', '吉田', '宮本', '池田',
    '642-0002', '日方', 'グランドハイツ', 'wakayama',
    'x60074ea66a647f59', '8e55cb6ed0f9d602', '44Or44Kk44O844K644Os44O044Kn',
    'ana.exec', 'D000000500',
]

TEXT_EXT = ('.html', '.css', '.js', '.xml', '.txt', '.json', '.webmanifest')


def targets():
    for p in glob.glob('**/*', recursive=True):
        if not os.path.isfile(p):
            continue
        if p.startswith(('cgiFolder' + os.sep, '_tools' + os.sep, '_data' + os.sep)):
            continue
        if p.endswith(TEXT_EXT):
            yield p


def b64_decoded_chunks(text):
    """value="…" に入っている base64 らしい塊を復号して返す。
       文字列検索をすり抜ける埋め込みを捕まえるため。"""
    for m in re.finditer(r'value="([A-Za-z0-9+/=]{24,})"', text):
        v = m.group(1)
        try:
            yield base64.b64decode(v + '=' * (-len(v) % 4)).decode('utf-8')
        except Exception:
            continue


def pct_decoded_chunks(text):
    """%XX で書かれた断片を復号して返す。

       base64 と同じ抜け道。予約フォームへ内容を引き継ぐリンクが
         reservation.html?…&note=%E5%92%8C%E6%AD%8C%E5%B1%B1では珍しい…
       の形になっていて、見出しは「三重」に直っているのに
       この note だけ「和歌山」のまま残っていた。
       本文検索では一切引っかからなかった。"""
    for m in re.finditer(r'[A-Za-z0-9._~:/?#\[\]@!$&\'()*+,;=%-]{8,}', text):
        s = m.group(0)
        if '%' not in s:
            continue
        try:
            d = urllib.parse.unquote(s, errors='strict')
        except Exception:
            continue
        if d != s:
            yield d


def main():
    hits = []          # 他店データ
    tokens = {}        # 伏せ字
    prices = 0         # 仮の料金
    files = list(targets())

    for p in files:
        try:
            t = open(p, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        blobs = list(b64_decoded_chunks(t)) if p.endswith('.html') else []
        pcts = list(pct_decoded_chunks(t))
        for k in FORBIDDEN:
            n = t.count(k)
            if n:
                hits.append((p, k, n, '本文'))
            for b in blobs:
                nb = b.count(k)
                if nb:
                    hits.append((p, k, nb, 'base64の中'))
            for d in pcts:
                nd = d.count(k)
                if nd:
                    hits.append((p, k, nd, 'URLエンコードの中'))
        for m in re.finditer(r'\{\{([^}]{1,40})\}\}', t):
            tokens.setdefault(m.group(1), []).append(p)
        prices += len(re.findall(r'0,000', t))

    print('検査したファイル: %d' % len(files))
    print()

    print('■ 他店（Louise Rever）を特定できる文字列')
    if hits:
        for p, k, n, where in hits:
            print('   ✗ %-34s %-22s %d件（%s）' % (p, k, n, where))
        print('   → 残っています。この状態で公開してはいけません。')
    else:
        print('   ✓ 0件')
    print()

    print('■ 未確定の項目（伏せ字）: %d種' % len(tokens))
    for k in sorted(tokens):
        fs = tokens[k]
        print('   {{%s}}  %d箇所 / %dファイル' % (k, len(fs), len(set(fs))))
    print()

    # HTML が使っている自作クラスに、CSS/JS 側の受け手があるか。
    #
    # 一度、CSSの区間を差し替えたときに範囲の中にあった2つの節を
    # まとめて消してしまい、HTML側の class だけが残ったことがある
    # （.lr-faqnav-c と .lr-go）。表示は一見変わらないので気づけない。
    # 名前の対応を数えるだけで捕まえられるので、常に見る。
    own = set()
    for p2 in files:
        if not p2.endswith('.html') or p2.startswith('sp' + os.sep):
            continue
        s = open(p2, encoding='utf-8', errors='replace').read()
        own |= set(re.findall(r'class="([^"]*\blr-[\w-]+[^"]*)"', s))
    names = set()
    for v in own:
        names |= {x for x in v.split() if x.startswith('lr-')}
    style = ''
    for f2 in ('css/lr-common.css', 'js/lr-reveal.js', 'js/lr-nav.js',
               'js/lr-form.js', 'js/lr-schedule.js'):
        if os.path.exists(f2):
            style += open(f2, encoding='utf-8', errors='replace').read()
    orphan = sorted(n for n in names if n not in style)
    print('■ HTML の自作クラス %d種 → 受け手のないもの: %d種'
          % (len(names), len(orphan)))
    for n in orphan:
        print('   ✗ .%s  ― HTMLにあるが CSS/JS に無い' % n)
    print()

    print('■ 仮の料金（0,000）: %d件' % prices)
    # 他店の写真を差し替えた分。一覧は _data/仮画像の一覧.txt に残してある
    lst = '_data/仮画像の一覧.txt'
    ph = []
    if os.path.exists(lst):
        ph = [x.strip() for x in open(lst, encoding='utf-8') if x.strip()
              and os.path.exists(os.path.join('assets', x.strip()))]
    print('■ 仮の画像: %d枚（一覧は %s）' % (len(ph), lst))
    print()

    if hits:
        print('判定: 公開不可（他店のデータが残っています）')
        return 1
    if orphan:
        print('判定: 不整合（HTMLのクラスに受け手がありません）')
        return 1
    if tokens or prices:
        print('判定: 未完成（他店のデータは無し。伏せ字と仮の値が残っています）')
        return 0
    print('判定: 公開可')
    return 0


if __name__ == '__main__':
    sys.exit(main())
