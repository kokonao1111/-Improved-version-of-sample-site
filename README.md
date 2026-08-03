# Louise Rever サイト コピー

`https://www.louiserever.com/` の静的コピーです。改修作業のベースライン（現行サイトの完全な複製）として `site/` 以下に配置しています。

取得日: 2026-08-04

## 起動方法

相対パス（`../assets/` など）で組まれているため、`file://` ではなく HTTP で開いてください。

```sh
cd site
python3 -m http.server 8899
```

- スマホ版トップ: http://127.0.0.1:8899/sp/index.html
- PC版トップ: http://127.0.0.1:8899/index.html

## ディレクトリ構成

```
site/
├── index.html            PC版 トップ
├── beginner/             初めての方へ
├── trial/                トライアル
├── course_plan/          コース・プランのご案内
├── how_to_choose/        コース・プランの選び方
├── faq/                  よくある質問
├── campaign/             キャンペーン
├── shopinfo/             店舗のご案内
├── singlefolder/         スタッフ紹介・予約フォーム
├── sp/                   スマホ版（上と同じページ構成 + jQuery Mobile 一式）
│   ├── css/              ページ別 CSS（G0000000xx/cssfiles/）
│   └── tw-static/        jQuery Mobile 1.3.2 本体・拡張
├── assets/               画像 104点（スライダー、コース写真、スタッフ、ロゴ等）
├── css/                  PC版 ページ別 CSS
└── cgiFolder/            共通 JS（TieredWorks 生成）、corestyle.css、RSS フィード
```

HTML 30ページ / 全637ファイル / 約8.8MB。オリジナルのディレクトリ構造をそのまま維持しているため、
ページ間リンク・画像パス・CSS パスはすべてそのまま動作します。

## オリジナルとの差分

コピーにあたって変更・注意が必要な点は以下のみです。

| 項目 | 内容 |
| --- | --- |
| `cgiFolder/core_rss_feed.php` | 静的サーバーでも表示できるよう `core_rss_feed.html` を複製し、トップページ（PC/SP）の iframe 参照先をそちらへ変更。元の `.php` も残しています |
| 予約フォーム | `singlefolder/reservation.html` の送信先は `cgiFolder/mail_send.php`（サーバーサイド）。取得できないため送信は動作しません |
| アクセス解析 | 各ページ末尾の `ana.exec(...)` が `cgiFolder/analysis/admin/index.php` を叩きますが、ローカルでは 404 になるだけで表示に影響しません |
| 外部 CDN | Google Fonts（Noto Sans/Serif JP）、Font Awesome 5.7.2、Google Maps 埋め込みはオリジナル同様 CDN 参照のままです。オフラインではフォントと地図が出ません |
| 元サイト側の欠損 | `assets/bg_top.jpg` / `assets/pagetoplink.png` / `sp/tw-static/assets/icon_light_*.png` は本番サーバーでも 404 のため、コピーにも含まれていません |

上記以外のリンク・画像・CSS・JS の参照はすべてローカルに解決済みであることを確認しています。

## 検証

スマホ版全8ページ（HOME / 初めての方へ / トライアル / コース・プランのご案内 / コース・プランの選び方 /
よくある質問 / キャンペーン / 店舗のご案内）をヘッドレス Chrome でレンダリングし、
本番サイトのスクリーンショットと一致することを確認済みです。
