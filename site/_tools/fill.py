"""_data/shop.json の値を、サイト全体の伏せ字（{{…}}）へ流し込む"""
import base64
import glob
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
APPLY = '--apply' in sys.argv

d = json.load(open('_data/shop.json', encoding='utf-8'))
vals = {k: v for k, v in d['未確定'].items() if v}

mail = d['未確定'].get('{{メールアドレス}}')
if mail:
    vals['{{メールアドレスbase64}}'] = base64.b64encode(mail.encode('utf-8')).decode('ascii')

tel = d['未確定'].get('{{電話番号}}')
if tel:
    vals.setdefault('{{電話番号ハイフンなし}}', re.sub(r'[^0-9]', '', tel))

    vals.setdefault('{{電話番号国際}}',
                    '+81-' + tel[1:] if tel.startswith('0') else tel)

NG = []

def want(key, pattern,説明):
    v = vals.get(key)
    if v and not re.match(pattern, v):
        NG.append('%s = %r ― %s' % (key, v, 説明))

want('{{電話番号}}', r'^0\d{1,4}-\d{1,4}-\d{3,4}$', '0で始まり、ハイフン区切り（例 0599-00-0000）')
want('{{メールアドレス}}', r'^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$', 'aaa@example.com の形')
want('{{サイトURL}}', r'^https://[^/\s]+$', 'https:// で始まり、末尾に / を付けない')
want('{{GA4測定ID}}', r'^G-[A-Z0-9]{6,}$', 'G- で始まる測定ID')
want('{{ドメイン}}', r'^[a-z0-9.-]+\.[a-z]{2,}$', 'example.com の形（https:// は付けない）')
want('{{Instagram}}', r'^https://www\.instagram\.com/[^/\s]+/?$', 'プロフィールのURL全体')

if NG:
    print('値の形がおかしいので、書き換えを止めました:')
    for m in NG:
        print('   ✗ %s' % m)
    sys.exit(1)

if not vals:
    print('流し込める値がありません。_data/shop.json の「未確定」に値を入れてください。')
    sys.exit(0)

FILES = [p for p in glob.glob('**/*', recursive=True)
         if os.path.isfile(p)
         and not p.startswith(('cgiFolder' + os.sep, '_tools' + os.sep, '_data' + os.sep))
         and p.endswith(('.html', '.css', '.js', '.xml', '.txt', '.json', '.webmanifest'))]

total = 0
left = {}
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

    for m in re.finditer(r'\{\{([^}]{1,40})\}\}', t):
        left[m.group(1)] = left.get(m.group(1), 0) + 1

print('%s: %d箇所' % ('流し込みました' if APPLY else '試算（--apply で実行）', total))
for k, v in vals.items():
    print('  %-26s → %s' % (k, v[:40]))

if left:
    print()
    print('%s伏せ字: %d種' % ('まだ残っている' if APPLY else '流し込んでも残る', len(left)))
    for k in sorted(left):
        print('  {{%s}}  %d箇所' % (k, left[k]))
else:
    print()
    print('伏せ字は残っていません。')
