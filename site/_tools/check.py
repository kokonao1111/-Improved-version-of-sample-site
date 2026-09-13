"""公開前のガード"""
import base64
import glob
import os
import re
import sys
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

FORBIDDEN = [
    'louiserever', 'Louise Rever', 'LOUISE REVER', 'ルイーズ', 'レヴェ',
    '和歌山', '海南', '073-482-3765', '0734823765', 'pnb6242x',
    'LIANGE', '34.1566', '135.211', '135.212',
    '後垣内', '西崎', '吉田', '宮本', '池田',

    'にしざき', 'よしだ', 'みやもと', 'いけだ',

    '西﨑', '髙', '𠮷',

    '073-494-3227', '0734943227',

    '株式会社　エターナル', '株式会社エターナル',
    '642-0002', '日方', 'グランドハイツ', 'wakayama',
    'x60074ea66a647f59', '8e55cb6ed0f9d602', '44Or44Kk44O844K644Os44O044Kn',
    'ana.exec', 'D000000500',
]

TEXT_EXT = ('.html', '.htm', '.css', '.js', '.xml', '.txt', '.json',
            '.webmanifest', '.php')

def targets(with_cgi=False):
    """検査するテキストファイルを列挙する"""
    for p in glob.glob('**/*', recursive=True):
        if not os.path.isfile(p):
            continue

        if p.startswith(('_tools' + os.sep, '_data' + os.sep, '_incoming' + os.sep)):
            continue
        if p.startswith('cgiFolder' + os.sep) and not with_cgi:
            continue
        if p.endswith(TEXT_EXT):
            yield p

def b64_decoded_chunks(text):
    """value="…" に入っている base64 らしい塊を復号して返す"""
    for m in re.finditer(r'value="([A-Za-z0-9+/=]{8,})"', text):
        v = m.group(1)
        try:
            yield base64.b64decode(v + '=' * (-len(v) % 4)).decode('utf-8')
        except Exception:
            continue

def pct_decoded_chunks(text):
    """%XX で書かれた断片を復号して返す"""
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

def css_comments(path):
    """CSS のコメントの閉じ方を見る"""
    src = open(path, encoding='utf-8').read()
    out = []
    i = depth = 0
    while True:
        o = src.find('/*', i)
        c = src.find('*/', i)
        if o < 0 and c < 0:
            break
        if o >= 0 and (c < 0 or o < c):
            if depth:
                out.append('コメントの入れ子 %d行目' % (src[:o].count('\n') + 1))
            depth += 1
            i = o + 2
        else:
            if not depth:
                out.append('余分な閉じ */ %d行目' % (src[:c].count('\n') + 1))
            else:
                depth -= 1
            i = c + 2
    if depth:
        out.append('コメントの閉じ忘れ')

    bare = re.sub(r'/\*.*?\*/', '', src, flags=re.S)
    if bare.count('{') != bare.count('}'):
        out.append('波括弧が %d 対 %d' % (bare.count('{'), bare.count('}')))
    for n, line in enumerate(bare.split('\n'), 1):
        st = line.strip()

        if st and re.match(r'^[^{}@#.:\[\]a-zA-Z0-9_>~+*,\-]', st):
            out.append('規則の外に文章 %d行目: %s' % (n, st[:40]))
    return out

OWN_ART = {
    'logo.png', 'logo2.png', 'logo2_gold.png', 'ogp.jpg', 'map.jpg',
    'orn-light.jpg', 'sns_line_qr.png', 'sns_insta_photo.jpg',
}

def photo_like(placeholders):
    """テンプレート付属の写真が、まだ写真のまま残っているものを挙げる"""
    try:
        import warnings
        warnings.filterwarnings('ignore')
        from PIL import Image, ImageStat
    except ImportError:
        return []
    known = set(placeholders) | OWN_ART
    out = []
    for p in sorted(glob.glob('assets/*') + glob.glob('sp/**/*', recursive=True)):
        n = os.path.basename(p)
        if not os.path.isfile(p) or n in known:
            continue
        try:
            im = Image.open(p).convert('RGB')
        except Exception:
            continue
        if min(im.size) < 64:
            continue
        sm = im.resize((60, 60), Image.LANCZOS)
        if len(set(sm.getdata())) > 1500 and sum(ImageStat.Stat(sm).stddev) / 3 > 18:
            out.append(p)
    return out

def main():
    hits = []
    tokens = {}
    prices = 0
    files = list(targets())
    scan = list(targets(with_cgi=True))
    narrow = set(files)

    for p in scan:
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
        if p not in narrow:
            continue
        for m in re.finditer(r'\{\{([^}]{1,40})\}\}', t):
            tokens.setdefault(m.group(1), []).append(p)
        prices += len(re.findall(r'0,000', t))

    print('検査したファイル: %d（うち他店データの検査は %d）' % (len(files), len(scan)))
    print()

    print('■ 他店（Louise Rever）を特定できる文字列')
    if hits:
        for p, k, n, where in hits:
            print('   ✗ %-34s %-22s %d件（%s）' % (p, k, n, where))
        print('   → 残っています。この状態で公開してはいけません。')
    else:
        print('   ✓ 0件')
    print()

    tel_bad = []
    for p in scan:
        if not p.endswith(('.html', '.htm')):
            continue
        t = open(p, encoding='utf-8', errors='replace').read()
        for m in re.finditer(r'href="tel:([^"]+)"[^>]*>([^<]{0,40})<', t):
            raw, shown = m.group(1), m.group(2)
            a = re.sub(r'[^0-9]', '', raw)
            b = re.sub(r'[^0-9]', '', shown)
            if not a or not b:
                continue
            if a.startswith('81'):
                a = '0' + a[2:]
            if a != b:
                tel_bad.append((p, raw, shown))
    print('■ 電話：押すとかかる先と、画面の表示が合っているか')
    if tel_bad:
        for p, raw, shown in tel_bad:
            print('   ✗ %-34s 表示 %-16s → 実際は %s' % (p, shown, raw))
        print('   → 別の相手に掛かります。公開してはいけません。')
    else:
        print('   ✓ 食い違い 0件')
    print()

    print('■ 未確定の項目（伏せ字）: %d種' % len(tokens))
    for k in sorted(tokens):
        fs = tokens[k]
        print('   {{%s}}  %d箇所 / %dファイル' % (k, len(fs), len(set(fs))))
    print()

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

    lst = '_data/仮画像の一覧.txt'
    ph = []
    if os.path.exists(lst):
        ph = [x.strip() for x in open(lst, encoding='utf-8') if x.strip()
              and os.path.exists(os.path.join('assets', x.strip()))]
    print('■ 仮の画像: %d枚（一覧は %s）' % (len(ph), lst))

    rest = photo_like(ph)
    print('   写真のまま残っているもの: %d枚' % len(rest))
    for n in rest:
        print('      ・%s' % n)
    if rest:
        print('   → 他店の看板・ロゴ・人物が写っていないか、'
              '公開前に必ず目で確かめること。')
    print()

    css_bad = []
    for css in sorted(glob.glob('css/*.css')):
        for msg in css_comments(css):
            css_bad.append('%s ― %s' % (css, msg))
    print('■ CSS の書き方: %s' % ('異常なし' if not css_bad else '%d件' % len(css_bad)))
    for m in css_bad:
        print('   ✗ %s' % m)
    print()

    if hits:
        print('判定: 公開不可（他店のデータが残っています）')
        return 1
    if orphan:
        print('判定: 不整合（HTMLのクラスに受け手がありません）')
        return 1
    if css_bad:
        print('判定: 不整合（CSSの一部が構文として捨てられます）')
        return 1
    if tokens or prices:
        print('判定: 未完成（他店のデータは無し。伏せ字と仮の値が残っています）')
        return 0
    print('判定: 公開可')
    return 0

if __name__ == '__main__':
    sys.exit(main())
