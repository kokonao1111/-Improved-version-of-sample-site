"""確認用のローカルサーバ。**中身を絶対にキャッシュさせない。**"""
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
