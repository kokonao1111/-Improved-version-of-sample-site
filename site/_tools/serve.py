#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""確認用のローカルサーバ。**中身を絶対にキャッシュさせない。**

  使い方:  python3 _tools/serve.py [ポート]   （既定 8899）

■ なぜ要るか
python3 -m http.server は Cache-Control を1つも送らない。
すると browser は「前回の更新日時から今までの1割」を勝手に有効期限に
してしまい、**サーバに問い合わせないまま古い画像やCSSを出し続ける**。

そのせいで「直したのに変わっていない」というやり取りを何度も起こした。
実際には手元も本番も同じ中身で、画素の差は0だった。
シークレットウィンドウでも、開いている間は同じことが起きる。

ここで no-store を付ければ、browser は毎回必ず取りに来る。
確認用のサーバなので、速さより「今の中身が必ず出る」ことを優先する。
"""
import functools
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, *a):
        pass


port = int(sys.argv[1]) if len(sys.argv) > 1 else 8899
os.chdir(ROOT)
http.server.ThreadingHTTPServer(('127.0.0.1', port),
                                functools.partial(Handler, directory=ROOT)).serve_forever()
