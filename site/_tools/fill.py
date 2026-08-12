#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
_data/shop.json の値を、サイト全体の伏せ字（{{…}}）へ流し込む。

  使い方:  python3 _tools/fill.py            （試算だけ。書き換えない）
           python3 _tools/fill.py --apply    （実際に書き換える）

値が null の項目は伏せ字のまま残す。
{{メールアドレスbase64}} は {{メールアドレス}} から自動で符号化する。
HTMLは CRLF なので、改行コードを保ったまま書き換える。
"""
import base64
import glob
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
APPLY = '--apply' in sys.argv

d = json.load(open('_data/shop.json', encoding='utf-8'))
vals = {k: v for k, v in d['未確定'].items() if v}

mail = d['未確定'].get('{{メールアドレス}}')
if mail:
    vals['{{メールアドレスbase64}}'] = base64.b64encode(mail.encode('utf-8')).decode('ascii')

if not vals:
    print('流し込める値がありません。_data/shop.json の「未確定」に値を入れてください。')
    sys.exit(0)

FILES = [p for p in glob.glob('**/*', recursive=True)
         if os.path.isfile(p)
         and not p.startswith(('cgiFolder' + os.sep, '_tools' + os.sep, '_data' + os.sep))
         and p.endswith(('.html', '.css', '.js', '.xml', '.txt', '.json', '.webmanifest'))]

total = 0
for p in FILES:
    t = open(p, encoding='utf-8', newline='').read()
    o = t
    for k, v in vals.items():
        c = t.count(k)
        if c:
            total += c
            t = t.replace(k, v)
    if t != o and APPLY:
        open(p, 'w', encoding='utf-8', newline='').write(t)

print('%s: %d箇所' % ('流し込みました' if APPLY else '試算（--apply で実行）', total))
for k, v in vals.items():
    print('  %-26s → %s' % (k, v[:40]))
