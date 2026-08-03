# Louise Rever サイト監査レポート

調査日: 2026-08-04 ／ 対象: `site/` (本番サイトの完全コピー, HTML30ページ)

手法: 6軸を独立エージェントが監査 → 各指摘を反証エージェントが実ファイルで裏取り → 統合。
**確定 154件 / 棄却 6件**（棄却＝裏が取れなかったため不採用）

| 深刻度 | 件数 |
|---|---|
| 🔴 致命 | 13 |
| 🟠 重大 | 43 |
| 🟡 中 | 73 |
| ⚪ 軽 | 25 |

## スコアカード

| 軸 | 点数 | 所見 |
|---|---|---|
| コンテンツ・コピー・情報鮮度 | **25** / 100 | 素材そのもの（施術メニューの網羅性、スタッフ4名分の充実したプロフィール、beginner の丁寧なブランドメッセージ）は悪くない。しかし鮮度と整合性が壊滅的で、トップのお知らせは cgiFolder/core_rss_feed.html:109 の2021年12月04日が最新のまま冬季休暇とコロナ対策告知を表示し続け、キャンペーンは真夏に「まだまだ冷えを感じる季節」（campaign/index.html:230）。how_to_choose の全価格が旧税抜で他ページより10%安く、税込表記はサイト全体で0件。FAQ は4カテゴリすべてが同一の1問1答。スタッフ6名中2名（staff_5／staff_6）は見出しだけで本文が空。さらにお客様の声・施術実績・ビフォーアフターが1件も存在せず、高単価サービスを裏付ける証拠がない。 |
| 導線・CRO・IA | **12** / 100 | 6軸で最低。予約フォームへの内部リンクは全31ページ中 trial の2本（PC/SP計4本）のみで、ナビ・トップ・料金ページ・キャンペーンページから到達できない。tel: リンクはサイト全体で0件、SP版は line.me が sp/index.html:98 の1箇所だけで下層5ページはCTA完全ゼロ、固定フッターは「© Louise Rever」のみ。course_plan（609行）と how_to_choose（806行）は本文にリンクが0本の袋小路。回遊カード36箇所は空アンカーで押せず、おすすめプラン3枚は自己リンク、ブライダルバナーとContactは href="#"。フォーム自体も14項目47コントロールで自動返信OFF、送信成功判定が文字列一致という状態。集客が仮に成功しても受け止める器がない。 |
| デザイン・ビジュアル・レスポンシブ | **28** / 100 | 金・ベージュ（#D9C79D／#70592C）を基調としたトーン設計の意図自体は業種に合っている。ただしレスポンシブが成立しておらず、PC版15ページに viewport が1本もなく pagelayout.css:3 で1000px固定、しかも index.html:676 が iPad を明示除外するためタブレットは縮小表示のPC版を見る。SP版は jQuery Mobile 1.3.2 の上に手書きCSSを重ねた結果、extends_style.css:285 の height:0px で6ページの導線カード画像が消え、下層ページのメインビジュアルは1600x400のPC用流用で高さ94pxの帯になる。font-size は実測40種、H1は9px、SP側のフォント指定は 'Noto Sans Japanese' という存在しないファミリ名。トップ中央には2.74emの赤文字が並ぶブログiframeが常時表示され、最重要CTAである予約フォームの送信ボタンは灰色12px＋90年代のベベル枠のまま。 |
| アクセシビリティ・パフォーマンス | **22** / 100 | パフォーマンスは、トップ初期表示が画像1,971,656B＋JS 303,617B＋CSS @import 3階層31本で約2.3MB。loading="lazy"・srcset・<picture>・.webp はサイト全体で0件、写真をPNG保存しているため how_to_choose だけで1.0MB。width属性のみでheightがない img が128件でCLSも発生。アクセシビリティは、tel: 0件、画像のみのリンク49件にアクセシブル名なし、PC予約フォームの選択肢40個が重複IDで個別labelなし（SP版は正しく実装済みなので実現可能）、a:focus{outline:none} でフォーカス不可視、PC版に lang 属性とランドマーク要素がゼロ。コントラストは最重要訴求の初回トライアル価格が2.36:1、コース見出しの白文字/金背景が2.32:1でいずれもAA基準を大きく下回る。 |
| SEO・ローカルSEO・計測 | **18** / 100 | ローカル商圏の受け皿として必要な基礎がほぼ全て欠落。構造化データ（JSON-LD）はPC/SP全30ページで0件、GA4/Search Console/GTMも0件で独自PVカウンタのみ、sitemap.xml と robots.txt は本番で404。PC版15ページに canonical がなく、SP版の canonical は www→apex→www の2ホップ301先を指す。h1 はPC全15ページが同一文言でページ主題は h4 に降格、how_to_choose は「詳しく見る▼」が h2 として12回繰り返され悩みキーワードが h4 に埋もれている。staff 6ページと予約フォームの title/description は空。全titleに「和歌山」「ブライダル」「脱毛」が1つも入っておらず、最高単価の主力メニューが検索で拾えない。OGPも0件でLINE共有時に無地のURLになる。 |
| 技術的負債・法務コンプライアンス | **20** / 100 | TieredWorks 1.4.1.3 が生成した jQuery 1.9.1／jQuery Mobile 1.3.2（2021年開発終了）／Adobe Spry（2012年提供終了）の上に、PC15＋SP15ページが二重管理されている。ブロックID（B000000xxx）がHTML・CSSファイル名・JS初期化・解析タグまで貫通しており、CMS外での部分改修が極めて困難。この構造がすでに価格更新漏れという実害として顕在化している。法務面は、疾病訴求（campaign/index.html:232 の「婦人科系疾患・アレルギー・アトピーにもオススメ」、iframe内の化粧品効能標榜と販売価格）が最優先の是正対象。加えて総額表示・キャンセル規定・中途解約の記載が0件、プライバシーポリシーは独立ページも同意チェックもなく高さ200pxのスクロール枠に封じ込め。セキュリティは解析管理画面が認証なしで200を返し、PHP 7.4.33（EOL済）がサーバー絶対パスを露出、予約フォームにCSRF/CAPTCHAなし。 |

## 総合診断

現状の問題は「サイトの見た目が古い」ことではなく、事業として最も痛い3点が同時に起きていることです。第一に、来店予約と電話という主要KPIの受け皿へほぼ全ページから到達できません（予約フォームへの内部リンクは全31ページ中トライアルの2本のみ、tel:リンクはサイト全体で0件、SP版に至っては予約導線が実質ゼロ、料金ページ2本は本文リンク0本の袋小路）。第二に、トップ中央のお知らせが2021年12月で止まり、終了済みの冬季休暇とコロナ対策が最新情報として表示されているため、訪問者はまず「今も営業しているのか」を疑います。第三に、購入直前の比較検討ページである「選び方」の全価格が旧税抜のまま他ページより10%安く、来店時のクレームと口コミ悪化に直結します。つまり流入を集めても受け止められず、受け止めても信用されず、信用されても価格で裏切る構造です。しかもアクセス解析が一切ないため、この損失が何件なのかも分かりません。根本原因はPC/SP二重管理の古いCMSで更新コストが高すぎることですが、作り替えの判断を待つ必要はありません。まず1〜2週間の応急処置で「営業中に見えて、どのページからでも予約できる」状態へ戻し、そのうえでレスポンシブ統合と外部予約システムへの移行に進むのが、費用対効果として明確に最短です。

---

# 指摘一覧


## アクセシビリティ・パフォーマンス（24件）

### 🔴 致命 電話番号がtel:リンクでない（全31ページ0件）

- **箇所**: `index.html`:562 ／ 工数 S
- **証拠**: index.html:562 `<td class="t_r_tel">073-482-3765</td>`、sp/index.html:323 も同一、sp/shopinfo/index.html:128・shopinfo/index.html:226 も同じくプレーンテキスト。`grep -rn 'href="tel:' --include="*.html" .` の結果は0件（31ファイル中1件も無し）。
- **影響**: 主要KPIの「電話問い合わせ」がモバイルでタップ発信できない。SP版（jQuery Mobile）でも同様のため、スマホ流入客は番号を長押し・手入力する必要があり、ここで確実に離脱が発生する。スクリーンリーダー利用者にも電話番号が電話番号として認識されない。
- **修正**: 全ページの電話番号を `<a href="tel:0734823765" aria-label="電話をかける 073-482-3765">073-482-3765</a>` に置換。最低限 index.html:562 / sp/index.html:323 / shopinfo/index.html:226 / sp/shopinfo/index.html:128 の4箇所を即時対応。SP版ヘッダにも固定の発信ボタンを追加する。

### 🔴 致命 PC予約フォーム：選択肢57個が重複IDで個別ラベルなし

- **箇所**: `singlefolder/reservation.html`:197 ／ 工数 M
- **証拠**: singlefolder/reservation.html:197,200,203 の3つのラジオが全て `id="value_select_radio_button_03"`（同一ID）。ID重複数は `value_select_radio_button_42`×11、`value_select_radio_button_30`×11、`value_select_check_box_12`×5、`value_select_check_box_47`×4、`value_select_check_box_18`×3、`value_select_check_box_15`×3、`value_select_radio_button_03`×3 で計40個の重複。選択肢名（「新規予約」「リピート予約」等）は `<label>` ではなく input の直後の裸テキスト。対して sp/singlefolder/reservation.html:115-122 は `id="value_select_radio_button_03_0"` と `<label for="...">新規予約</label>` で正しく実装されている。
- **影響**: 予約フォームは来店予約KPIの最終地点。ラジオ/チェックボックスにアクセシブル名が無いためスクリーンリーダーでは「ラジオボタン 未選択」としか読まれず、予約種別・希望時間（11枠×2）が選べない。加えてラベルクリックで選択できないため、スマホの指タップでは14px程度の丸を正確に押す必要があり健常者でも誤操作・離脱が起きる。ID重複はHTML仕様違反でJSの getElementById も先頭しか取れない。
- **修正**: SP版（sp/singlefolder/reservation.html:115-122）と同じ形式に統一する。各 input に連番ID（_0,_1,_2…）を振り、直後のテキストを `<label for="…">` で包む。fieldset の見出しは `<label class="label">` ではなく `<legend>` にする。

### 🔴 致命 トップページ初期表示が画像1.97MB／SP版1.36MB、lazy・WebP・srcset全て0件

- **箇所**: `index.html`:243 ／ 工数 M
- **証拠**: index.html が参照する assets 画像23点の実合計は 1,971,656 bytes。内訳最大は index.html:243-245 のスライダー3枚（top_image.jpg 314,436B / top_imagi02.jpg 414,060B / top_imagi03.jpg 242,828B、いずれも1600x700、合計971KB）で flexslider は3枚とも即時読み込み。sp/index.html:92 の bxslider も sp_slide_001〜004（66KB+92KB+77KB+69KB）＋sp_img_bottom.jpg 63KB を全て即時読み込みし、SP版画像合計 1,357,818 bytes。全31HTMLで `loading="lazy"` 0件、`srcset`/`<picture>` 0件、assets/ 配下に .webp 0件。
- **影響**: JS(350KB)＋CSS＋画像でトップページ初期転送は約2.3MB。4G実効10Mbpsで約2秒、混雑時や地方の電波状況では5秒超。LCP要素はヒーロー画像で、1枚目314KBが降りきるまで表示されない。エステの検索流入は大半がスマホであり、表示3秒超で直帰率が跳ね上がる＝予約フォーム到達前の損失。
- **修正**: (1)スライダー1枚目以外に `loading="lazy"` を付与、1枚目には `<link rel="preload" as="image">`。(2)ヒーローをWebP化（1600x700 JPEG 314KB→WebP 60-80KB相当）＋`<picture>`でフォールバック。(3)SP版に1600px幅原本を送らず srcset で750px版を配信。この3点だけでトップの画像転送を1.9MB→400KB以下にできる。

### 🟠 重大 画像だけのリンク49件にアクセシブル名が無い

- **箇所**: `index.html`:323 ／ 工数 M
- **証拠**: スクリプトで全HTMLを走査し、`<a href=...><img ...>` のみで構成されalt が無い/空のリンクが計71件（うちサイト本体49件、RSS iframe 22件）。内訳例: index.html:323,336,349,362,375,388,422,435,447 の arrow.png（alt属性そのものが無い、トライアル各コースへの唯一の導線）、index.html:289 top_link_01.jpg alt=""、index.html:532 top_insta.jpg alt=""、beginner/index.html:358,366,373,380,387,394 のスタッフ写真6枚 alt=""（各スタッフ詳細ページへのリンク）、sp/beginner/index.html:200-226 も同一、logo.png（index.html:209 ほか13ページ）altなし。
- **影響**: スクリーンリーダーは代替テキストが無いとURLやファイル名（「トップ コース ワン ドット ピーエヌジー リンク」等）を読み上げる。コース詳細への矢印リンク9本とスタッフ紹介6枚は予約前の比較検討動線そのもので、視覚障害者・音声ブラウザ利用者は事実上コース選択ができない。Googleの画像検索・リンク文脈評価にも不利。
- **修正**: arrow.png には `alt="フェイシャルトリートメントコースの詳細を見る"` のようにリンク先を説明する文言を入れる（装飾扱いにするならリンク側に aria-label を付与）。スタッフ写真には `alt="スタッフ 〇〇のプロフィールを見る"`、logo.png には `alt="Louise Rever ホームへ"`、top_insta.jpg には `alt="Instagram @louise.rever_wakayama を見る"`。

### 🟠 重大 PC版16ページに viewport メタが無い

- **箇所**: `index.html`:3 ／ 工数 M
- **証拠**: `name="viewport"` を持つのは sp/ 配下15ファイルのみ。index.html, beginner/, trial/, course_plan/, how_to_choose/, faq/, campaign/, shopinfo/, singlefolder/*.html（計16ファイル、cgiFolder/core_rss_feed.html含む）には存在しない。SP振り分けは index.html:672-684 のJS User-Agent判定で `location.href = "…/sp/index.html"` に飛ばす方式。
- **影響**: UA判定は iPhone/iPod/Android の文字列のみを見ており（index.html:676-677）、iPad・Android タブレット・最新Chromeの一部UA・スマホのデスクトップ表示モードではPC版がviewport無しで表示される＝980px幅で描画され文字が極小になる。さらにJS判定のため、リダイレクト前に一度PC版のCSS/JS/画像を読み込んでから飛ぶので、モバイルでは2.3MBを無駄にダウンロードしてからSP版をもう一度読み込む二重ロードが発生する。
- **修正**: PC版16ファイル全てに `<meta name="viewport" content="width=device-width, initial-scale=1">` を追加。中期的にはJSリダイレクトを廃止しレスポンシブ1本化する（SP/PCでHTMLが完全別物である現状の二重管理コストも同時に解消できる）。

### 🟠 重大 フォームのエラー表示が10px・3.64:1でaria連携も無い

- **箇所**: `css/G000000011/cssfiles/module_B000000311.css`:158 ／ 工数 M
- **証拠**: css/G000000011/cssfiles/module_B000000311.css:108-112 `.hissu { color:#ff3333; font-size:10px; }`（※必須マーク）、同:156-162 でエラーメッセージも `color:#ff3333; font-size:10px;`。#ff3333 on #ffffff = 3.64:1（AA 4.5:1未達）。同:178 でエラー時のinput背景を `#ff9f9f` にするが、その上に載る #ff3333 の文字は 1.86:1。エラー文言に付随する `<img src="../assets/Spry_required.gif" />`（singlefolder/reservation.html:206,283,306,329,388 など）はalt属性なし。aria-live / aria-invalid / aria-describedby は全31ファイルで0件。input には `required` 属性も無く type は全て `type="text"`（電話番号 :242、メール :254 も text）。
- **影響**: 予約フォームでエラーが出ても、10pxの薄い赤文字＝多くの人が気づかない。スクリーンリーダーには変化がアナウンスされず、どの項目が不備なのかも判らない。さらに電話番号・メールが type="text" のためスマホで数字キーパッド／メール用キーボードが出ず、入力が明確に面倒になる。予約完了直前の最も離脱が痛い場所。
- **修正**: (1)エラー色を #C62828（4.9:1）以上に、フォントを14px以上に。(2)エラー領域を `<span role="alert" aria-live="assertive">` にし input に `aria-invalid="true" aria-describedby="…"` を付与。(3)Spry_required.gif に `alt=""`（隣接テキストがあるため装飾扱い）を明示。(4)電話番号を `type="tel" inputmode="numeric" autocomplete="tel"`、メールを `type="email" autocomplete="email"`、氏名を `autocomplete="name"` に変更。

### 🟠 重大 ブライダルバナーとContactボタンが href="#" の死にリンク

- **箇所**: `index.html`:281 ／ 工数 S
- **証拠**: index.html:281 `<li class="SF-simpleImg"><a href="#"><img width="240" src="./assets/top_bana3.png" alt="はじめてのブライダルエステ"/></a></li>`、index.html:585 `<a href="#" target="_blank" class="button-rink2">Contact</a>`。SP版も同一（sp/index.html:97, sp/index.html:346）。さらに index.html:422,435,447 の「ヘッドスパ＆頭皮ケア」「部分痩せメニュー」「肌質改善メニュー」の詳細矢印は `<a href="index.html">` で自ページに戻るだけ。
- **影響**: トップページのメインバナー4枚のうち1枚（ブライダルエステ＝単価の高いブライダル層の入口）がクリックしても何も起きない。フッターの「Contact」ボタンも同様で、問い合わせ導線が死んでいる。おすすめプラン3件の「詳細を見る」矢印もトップに戻るだけ。クリックした利用者は「壊れているサイト」と判断し、店舗への信頼が直接下がる。
- **修正**: top_bana3 のリンク先をブライダル関連ページ（course_plan/index.html の該当アンカー等）に設定。Contactボタンを `singlefolder/reservation.html` に向ける。index.html:422,435,447 の矢印を course_plan/index.html の該当セクションアンカーに変更。リンク先が未整備なら、少なくとも予約フォームに向ける。

### 🟠 重大 トップページのiframe 2本が title 無し・遅延読み込み無しで、外部画像51枚を初期表示で引く

- **箇所**: `index.html` ／ 工数 M
- **証拠**: index.html:471 `<iframe class="coreRssFeed" src="./cgiFolder/core_rss_feed.html"></iframe>`。読み込まれる cgiFolder/core_rss_feed.html は 48,517B で、その中に `src="https://…"` の外部画像が51件（stat.ameba.jp / stat100.ameba.jp のブログ画像、例: cgiFolder/core_rss_feed.html:125 の o0628064015012793023.jpg など）あり、すべて遅延なしで読まれる。index.html:595 の Google Maps embed iframe も同様。サイト全体で `<iframe` は6本（index.html:471,595 / shopinfo/index.html:284 / sp/index.html:242,351 / sp/shopinfo/index.html:186）あり、title 属性を持つものは0本、loading="lazy" も全31HTMLで0件。perf-02 が計上した「index.html 画像1.97MB」にはこの iframe 内の外部51枚と Google Maps は一切含まれていないため、実際の初期転送はさらに大きい。
- **影響**: （反証担当が追加検出）
- **修正**: (1) index.html:471 と :595 の iframe に `loading="lazy"` を付与（両方ともファーストビュー外）。(2) 全6本の iframe に `title="ブログ最新記事"` `title="Louise Rever 店舗所在地の地図"` などのアクセシブル名を付ける（WCAG 4.1.2）。(3) RSS ブログ枠は表示件数を3件程度に絞り、外部画像はサムネイル1枚だけにする。

### 🟠 重大 最重要訴求「初回トライアル価格」が2.36:1でAA不適合

- **箇所**: `index.html`:98 ／ 工数 S
- **証拠**: index.html:98 `.trial { font-size: 1.3em; color: #FF7272; }`。この文字が乗るカード背景は css/G000000001/cssfiles/module_B000000010.css:53 `background-color:#F5F1E7`。WCAG相対輝度で算出したコントラスト比は #FF7272 on #F5F1E7 = 2.36:1（AA基準4.5:1、大文字基準3:1すら未達）。適用箇所は index.html:320,333,346,359,372,385 の6コース分「初回トライアル 90分 ￥4,400」等。
- **影響**: 「通常￥16,500 → 初回￥4,400」という最大の集客フックが、加齢による軽度の視力低下・明るい屋外でのスマホ閲覧・色覚特性のある利用者にほぼ読めない。エステの主要顧客層（30-50代女性）は老視が始まる年代でありド直撃する。値引き幅が伝わらなければ初回来店の意思決定が起きない。
- **修正**: `.trial` の color を #C62828（#F5F1E7 上で約5.4:1）以上に濃くする。ブランドの淡い色調を守るなら文字色を #705A2C のままにして背景に淡いピンク帯＋太字にするなど、色以外の手掛かりも併用する。

### 🟠 重大 コース見出しの白文字／金背景が2.32:1

- **箇所**: `css/G000000001/cssfiles/module_B000000010.css`:116 ／ 工数 S
- **証拠**: css/G000000001/cssfiles/module_B000000010.css:111 `background-color:#C4A764;` と :116 `color:#ffffff;` :118 `font-size:16px;` :119 `font-weight:bold;`。#ffffff on #C4A764 = 2.32:1。16px boldは WCAG の「大きな文字」（18.66px bold以上）に該当せず4.5:1が必要。適用対象は index.html:315,328,341,354,367,380 の6コース名見出し（フェイシャルトリートメント／シミ・美白ケア／水素導入ケア／ボディートリートメント／グラマラスボディ／モホロジー）。同じ配色は index.html:629 の `#page-top a:hover { background: #C4A764 }`（白文字）にも及ぶ。
- **影響**: トップページで最も目立つべきコース名6件が読みづらい。金地に白は上品に見えるが、実際には屋外・明るい照明下のスマホでほぼ判読不能になる。コース名が読めなければ回遊も予約も始まらない。
- **修正**: 背景を1段暗くして #A4833F（既にサイト内で使用中の色、白文字で約4.6:1）に変更するか、金背景のままなら文字色を #4A3A18 前後の濃茶にする。

### 🟠 重大 CSSが@import3階層31本、head内同期script8本でレンダリング直列化

- **箇所**: `index.html`:12 ／ 工数 M
- **証拠**: index.html:12-17 で site.css・page.css・corestyle.css を読み込み。css/site.css は base.css と sitetheme.css を @import、css/G000000001/cssfiles/page.css は theme/pagelayout/blockdesign/modulestyle を @import、さらに modulestyle.css は module_B*.css を22本 @import（`grep -c "@import"` = 22）。結果、同一オリジンのレンダリングブロッキングCSSは計31本、@import の入れ子は3階層＝最低4往復が直列で発生する。加えて index.html:15,17,195,196,197,198,199,200 の8本の script が全て head 内・defer/async なし（全31ファイルで defer/async は0件）。
- **影響**: @import はHTTP/2でも並列化されず、親CSSをパースしてから子を取りに行くため、モバイル回線（RTT 100-200ms）では First Paint 前に 400ms〜1秒の純粋な待ち時間が積み上がる。JS 350KB（gzip 94KB）が同期実行されるため、この間ページは真っ白。LCPが数秒単位で悪化し、Googleの「不合格」判定と直帰率上昇に直結する。
- **修正**: 31本の@import連鎖を1本のバンドルCSSに結合（ビルド不可ならmodule_B*.cssの内容をmodulestyle.cssに直接インライン化）。8本のscriptは全て `</body>` 直前に移動するか `defer` を付与。少なくとも tieredworks_spry.js(135KB) は予約ページ以外から外す。

### 🟠 重大 200x200の写真を44-65KBのPNGで配信（how_to_chooseで1.0MB）

- **箇所**: `how_to_choose/index.html`:227 ／ 工数 S
- **証拠**: how_to_choose/index.html:227,269,311,354,394,437,487,522,556,591,625,659 で読み込む how_to_choose_item_1〜12.png は実寸200x200px（sips計測）にもかかわらず item_1=44,747B / item_5=63,172B / item_6=65,290B / item_7=62,451B。同ページの画像合計は 1,014,414 bytes（1.0MB）。トップの top_course1〜6.png も300x200pxで81,393〜111,573B、top_gaz3系は300x150pxで70,712〜83,640B。assets内PNGは37点・計1,567,359B。
- **影響**: 200x200の写真は適切なWebPなら1枚5-8KBで済む。現状は6〜10倍の無駄。「コース・プランの選び方」は購入意思決定の核となる比較検討ページであり、そこが1MBでスマホから開くと表示が最も遅い。ユーザーは選び方ページを開いた時点で待たされ、比較を諦めて離脱する。
- **修正**: 写真素材をPNGからWebP（またはJPEG q80）へ一括変換。how_to_choose_item_*.png 12点だけで約600KB→約80KBに削減できる。top_course*.png / top_gaz3*.png も同様。透過が必要なのはロゴ・矢印のみでPNG維持でよい。

### 🟡 中 a:focus{outline:none} でキーボードフォーカスが全ページ不可視

- **箇所**: `cgiFolder/corestyle.css`:32 ／ 工数 S
- **証拠**: cgiFolder/corestyle.css:32-34 に `/* リンク周りの点線を表示させない */ a:focus { outline:none; }`。corestyle.css は index.html:16 をはじめ全PCページで読み込まれる。代替のフォーカススタイル（:focus-visible、box-shadow 等）はサイト内CSSに存在しない。また全31HTMLで `tabindex` 属性は0件。
- **影響**: WCAG 2.4.7（フォーカスの可視化）明確な違反。マウスが使えない利用者・キーボード操作派・支援技術利用者は、いま画面上のどこにフォーカスがあるか全く分からない状態でグローバルナビ8項目と予約フォーム57個の選択肢を辿ることになり、実質操作不能。指の震えやマウス使用困難がある層はエステの実顧客層にも一定数存在する。
- **修正**: `a:focus{outline:none}` を削除し、`a:focus-visible, input:focus-visible, button:focus-visible { outline: 3px solid #70592C; outline-offset: 2px; }` に置換。マウスクリック時の点線が気になるという元の意図は :focus-visible で解決される。

### 🟡 中 PC版15ページに lang 属性が無い（xml:lang のみ）

- **箇所**: `index.html`:2 ／ 工数 S
- **証拠**: `grep -rhoE '<html[^>]*>'` の結果、`<html xmlns="..." xml:lang="ja">` が15件（PC版全ページ）、`<html xmlns="..." lang="ja">` が15件（SP版全ページ）、`<html>` が1件（cgiFolder/core_rss_feed.html）。PC版は text/html として配信されるため xml:lang は無視され、言語未指定になる。
- **影響**: スクリーンリーダーが日本語テキストを英語音声エンジンで読み上げようとし、店舗名・住所・コース名が全く聞き取れない発音になる。ブラウザの自動翻訳が誤作動し、日本語ページに翻訳バナーが出る。WCAG 3.1.1違反。
- **修正**: PC版15ファイルの `<html>` を `<html lang="ja" xml:lang="ja" xmlns="...">` に変更。cgiFolder/core_rss_feed.html にも `lang="ja"` を追加。sed一括置換で完了する。

### 🟡 中 見出し階層がh1→h4に飛び、h1は全ページ同一文言の9px

- **箇所**: `index.html`:208 ／ 工数 M
- **証拠**: index.html の見出し出現順は h1(208) → h4(298) → h3(315,328,341,354,367,380) → h4(397) → h3(417,429,442) → h4(457) → h2(528,538) → h4(551)。h2が最初に登場するのは528行目でh4/h3の後。同様に beginner/index.html は h1(147)→h4(196)→h2(211)、trial/index.html は h1(207)→h4(256)、course_plan/index.html は h1(157)→h4(206)→h2(491)、singlefolder/reservation.html は h1(119)→h4(168)→h2(508)。全ページのh1は `#Header-title` で内容は「フェイシャルエステ・ブライダルエステが人気の海南市のエステサロン【LOUISE REVER】」と31ページ全て同一、かつ css/G000000001/cssfiles/module_B000000007.css:37 で `font-size:9px`。
- **影響**: スクリーンリーダーの見出しジャンプ機能でページ構造を辿れない（h2を飛ばしてh4が出るため階層が破綻）。h1が全ページ同一のため「このページが何のページか」がh1から分からず、支援技術利用者にも検索エンジンにもページの主題が伝わらない。9pxは視覚的にも読める大きさではない。
- **修正**: 各ページのメイン見出し（例：トライアルページなら「初めての方へおすすめトライアルプラン」）をh1に昇格し、ヘッダーのサイト名h1は `<p class="site-name">` に降格。ブロック内の見出しは h2 → h3 の順に整理し、装飾目的の `<h4 class="newslistHeadlineStyle">`（index.html:298,397,457 等のセクション帯）はh2にする。

### 🟡 中 PC全ページにランドマーク要素が1つも無い

- **箇所**: `index.html`:206 ／ 工数 M
- **証拠**: `grep -c "<main|<header|<nav|<footer|<section|<article"` は index.html・beginner/index.html・shopinfo/index.html・singlefolder/reservation.html で全て0。構造は `<div id="SF-header">`(206) / `<div id="SF-navigation">`(216) / `<div id="SF-contents">`(272) / `<div id="SF-footer">`(602) と全てdiv。`<main>` は全31ファイルで0件。SP版には `<header>`/`<footer>` が存在する（sp/index.html ほか15ファイル）。role属性・skip linkも0件。
- **影響**: スクリーンリーダーのランドマークナビゲーションが使えず、毎ページ先頭からグローバルナビ8項目を読み飛ばして本文に到達する必要がある。スキップリンクも無いためキーボード利用者は本文到達までに8回以上Tabを押す。
- **修正**: `<div id="SF-header">`→`<header>`、`<div id="SF-navigation">`→`<nav aria-label="メインナビゲーション">`、`<div id="SF-contents">`→`<main id="main">`、`<div id="SF-footer">`→`<footer>` に置換（id/CSSはそのまま維持可能）。body直後に `<a href="#main" class="skip-link">本文へスキップ</a>` を追加。

### 🟡 中 フッターのSNSアイコンがリンクでもテキストでもない

- **箇所**: `index.html`:579 ／ 工数 S
- **証拠**: index.html:579-580 `<td class="t_l2"><i class="fab fa-instagram"></i></td><td class="t_r2"><i class="fab fa-facebook-square"></i></td>`。`<a>` で囲まれておらず、aria-label も代替テキストも無い。font-size は index.html:72,79 で 2.2em。また FontAwesome の CSS は index.html:552 で `<body>` 内（`<p>` の中）から `https://use.fontawesome.com/releases/v5.7.2/css/all.css` を読み込んでいる。
- **影響**: Instagram・Facebookのアイコンが大きく目立つ位置にあるがクリックできない。ユーザーはタップして反応が無いことで不信感を持つ。スクリーンリーダーには何も読み上げられない（空のi要素）。加えてbody途中でのCSS読み込みはパース中断とアイコン領域の遅延描画（FOUT/CLS）を招く。同ページ:532 の Instagram 画像リンクは別途存在するので、導線が二重かつ片方が死んでいる状態。
- **修正**: `<a href="https://www.instagram.com/louise.rever_wakayama/" target="_blank" rel="noopener" aria-label="Instagramを見る"><i class="fab fa-instagram" aria-hidden="true"></i></a>` の形にする。Facebookページが無いならアイコンごと削除。FontAwesome の link タグは head へ移動、もしくはSVGアイコン2個の直接埋め込みにしてCDN依存自体をやめる（57KBのCSS削減）。

### 🟡 中 SP版が body 内の <style> から Google Fonts（日本語フォント2書体×2ウェイト）をレンダリングブロッキングで @import

- **箇所**: `sp/index.html` ／ 工数 M
- **証拠**: sp/index.html:25 が `</head>`。その後 sp/index.html:92（body内）に `<style type="text/css">@import url('https://fonts.googleapis.com/css?family=Noto+Sans+JP:400,700|Noto+Serif+JP:400,700&display=swap&subset=japanese');…</style>` が bxslider の初期化コードと同じ行に埋まっている。同じ92行目で bxslider の JS/CSS 4本（jquery.bxslider.min.js、jquery.bxslider.css、jquery.easing.1.3.js、jquery.fitvids.js）も body 内から読み込んでいる。PC版は index.html:21 と head 内の `<style>` にあり配置は正しい。日本語Webフォントは1書体あたり数百KB級で、Noto Sans JP と Noto Serif JP の各400/700＝4ファイルを外部ドメインから取得する。SP版は既に jquery.mobile-1.3.2.min.js 145,223B ＋ jquery.mobile-1.3.2.min.css 94,670B ＋ extends_style.css 27,814B ＋ tieredworks系JSを読んでおり、そこに追加される。
- **影響**: （反証担当が追加検出）
- **修正**: sp/index.html:92 の `<style>` ブロックから @import を切り出し、`</head>` より前に `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` と `<link rel="stylesheet" href="https://fonts.googleapis.com/css?...&display=swap">` として移す。あるいは日本語Webフォント自体を廃し、見出しだけに限定して subset 版をセルフホストする。

### 🟡 中 予約フォームの送信ボタンの真横に「リセット」ボタンがあり、誤タップで全入力が消える

- **箇所**: `singlefolder/reservation.html` ／ 工数 M
- **証拠**: singlefolder/reservation.html:502 `<input type="submit" value="入力内容確認" name="submitButtonName" /><input type="reset" value="リセット" name="reset" />` — 同一行、間に余白要素もマークアップも無く2つのボタンが隣接している。このフォームは radio 25個＋checkbox 15個＋text 6個（うち氏名・電話・メール等が必須）を入力させる長いフォームで、a11y-03 で確認したとおり label が無いためラジオ/チェックボックスは丸そのものをタップする必要がある。確認ダイアログの類は同ファイル内に存在しない（`onclick` による confirm も無し）。
- **影響**: （反証担当が追加検出）
- **修正**: `<input type="reset">` を削除する（現代のフォームでリセットボタンが役に立つ場面はほぼ無く、WCAG 3.3.4 の観点でも非推奨）。どうしても残すなら submit と視覚的・物理的に離し、色を目立たない地味なものにしたうえで `onclick="return confirm('入力内容をすべて消去しますか？')"` を付ける。

### 🟡 中 SP版トップのメインビジュアル4枚を含む img 15件に alt 属性が1つも無い（リンクでないため既存指摘から漏れている）

- **箇所**: `sp/index.html` ／ 工数 M
- **証拠**: sp/index.html の img タグ18件のうち15件が alt 属性そのものを持たない。内訳は sp/index.html:92 の bxslider スライド `<img src="../assets/sp_slide_001.jpg"  />` 〜 `sp_slide_004.jpg` の4枚と `<img src="../assets/sp_img_bottom.jpg" />`、および arrow.png 9枚、計測用の 0x0 画像1枚。a11y-02 は `<a>` で囲まれた「画像のみのリンク」だけを数えているため、リンクでない sp_slide_001〜004 と sp_img_bottom.jpg のこの5枚は集計に入っていない。SP版はスマホ流入の主導線であり、この5枚がファーストビューそのもの（perf-02 で計上のとおり 66KB+92KB+77KB+69KB+63KB）。
- **影響**: （反証担当が追加検出）
- **修正**: 装飾スライドとして扱うなら `alt=""` を明示的に付与して読み上げ対象から外す（属性そのものが無いとファイル名が読み上げられる）。キャンペーン告知など情報を持つスライドであれば `alt="秋のスキンケアキャンペーン 陶器肌トリートメント80分"` のように内容を書く。arrow.png 9枚はリンク内なのでリンク側に aria-label を付けるのが確実。

### 🟡 中 おすすめメニュー名の赤文字が2.48:1（16ファイル）

- **箇所**: `how_to_choose/index.html`:246 ／ 工数 S
- **証拠**: how_to_choose/index.html:246 `<strong><span style='color:#FF7D7D; font-size:1.2em; '>シミ・美白　ケア</span></strong>` ほか、#FF7D7D の使用は how_to_choose/index.html 7箇所、trial/index.html 6箇所、singlefolder/staff_1〜6.html 各4箇所、sp/ 側にも同数で計16ファイル。白背景上で #FF7D7D = 2.48:1（AA 4.5:1 未達、AA大文字 3:1 も未達）。
- **影響**: 「コース・プランの選び方」で悩み別に提示される推奨メニュー名＝まさに送客したい商品名が読みにくい。強調のつもりの赤が、視認性としては本文の #705A2C（6.59:1）より大幅に劣化しており、強調が逆効果になっている。
- **修正**: #FF7D7D を #C62828（白背景で5.9:1）または #B33A3A に置換。ブランドの淡い印象を保ちたい場合は文字色を本文色のままにして背景ハイライト（#FFF0F0）＋太字で強調する。

### 🟡 中 img に height 属性が無いものが128件でCLS発生

- **箇所**: `index.html`:243 ／ 工数 M
- **証拠**: 全31HTML中、width属性はあるが height 属性が無い img が128件、両方あるものが107件。index.html:243-245 のヒーロー3枚は `<img width="1600" src="./assets/top_image.jpg" alt=""/>` で height なし（実寸1600x700）。index.html:317,330,343,356,369,382 のコース画像も `width="300"` のみ（実寸300x200）。CSSにも aspect-ratio 指定なし。
- **影響**: 画像の高さがロード完了まで確定しないため、ヒーロー（表示高700px相当）とコースカード6枚が読み込まれるたびにページが下方向に飛ぶ。Core Web Vitals の CLS が悪化し、読み終わる前に「初回トライアル」ボタンを押そうとしたユーザーが別の場所をタップする誤操作が起きる。
- **修正**: 全img に実寸の height 属性を追加（`width="1600" height="700"`、`width="300" height="200"` など）。CSS側で `img{max-width:100%;height:auto}` を併用すればレスポンシブも維持できる。sipsで実寸を取得しスクリプト一括付与が可能。

### ⚪ 軽 グローバルナビのホバー色が2.62:1

- **箇所**: `css/G000000001/cssfiles/module_B000000002.css`:55 ／ 工数 S
- **証拠**: css/G000000001/cssfiles/module_B000000002.css:50 `color: #705A2C; font-size: 12px; font-weight: bold;`（通常時、白背景で6.59:1で適合）、同:54-56 `#SF-navigation #B000000002 ul li a:hover { color: #BC9C52; }`。#BC9C52 on #ffffff = 2.62:1。同じ #BC9C52 は index.html:185 の `.kome_line:before/:after` の装飾線にも使用。
- **影響**: マウスを乗せた瞬間、いま狙っているナビ項目だけが最も読みにくくなる。8項目のグローバルナビは全ページ共通のため影響範囲は全ページ。ホバーで色が薄くなる挙動は「無効化された」とも誤解される。
- **修正**: hover色を #8C6F2E 前後（白背景で約4.6:1）に変更するか、色変化ではなく下線・背景色でホバーを表現する。

### ⚪ 軽 SP版が消滅ドメインのhttp://スクリプトを参照

- **箇所**: `sp/index.html`:11 ／ 工数 S
- **証拠**: sp/index.html:11 `<script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>`（`<!--[if lte IE 9]>` 条件付きコメント内）。SP版15ファイル全てに同じ記述。googlecode.com は2016年にサービス終了しており、当該URLは存在しない。サイト本体は https 配信（index.html:11 の alternate が https://www.louiserever.com/）。
- **影響**: 条件付きコメントのため現行ブラウザは実行しないが、HTTPS ページに http:// リソースが記述されている状態はセキュリティ監査ツールで混在コンテンツとして指摘される。またこの記述の存在自体がサイトが2013年頃から更新されていないことを示すシグナルになる。
- **修正**: sp/ 配下15ファイルの当該IE9条件付きコメント3行（sp/index.html:10-12 相当）を削除する。IE9のサポートはとうに終了している。


## コンテンツ・コピー・情報鮮度（26件）

### 🔴 致命 「選び方」ページの全価格が旧税抜価格で他ページと矛盾

- **箇所**: `how_to_choose/index.html`:251 ／ 工数 M
- **証拠**: how_to_choose/index.html:251-253「シミ・美白ケア 通常価格 ￥12,000／トライアル価格 ￥6,000」。同じ施術が trial/index.html:352-353 では「通常価格 ￥13,200／トライアル ￥6,600」、course_plan/index.html:351-353 では「13,200円」、index.html:332-333 でも「￥13,200／￥6,600」。以下すべて同様に約10%低い旧価格：シワ・たるみ・ハリケア 15,000円(l.294,506) vs 16,500円(course_plan:359)／ニキビ凹凸ケア 10,000円(l.335,504) vs 11,000円(course_plan:347)／クレインフィールケア ￥7,500(l.378) vs 8,250円(course_plan:472)／スマッシュセル 4,000・5,000・6,000円(l.418-420) vs 4,400・5,500・6,600円(course_plan:326-328)／グラマラス 18,000円(l.461,678) vs 19,800円(course_plan:255)／バックスリム 7,500円(l.539) vs 8,250円(course_plan:267)／背中ニキビ集中ケア 3,000円(l.540) vs 3,300円(course_plan:273)／両ワキ脱毛 ￥2,000(l.608) vs ￥2,200(course_plan:460)／モホロジー120分 23,000円(l.677) vs 25,300円(course_plan:237)。sp/how_to_choose/index.html:116-346 にも同じ旧価格がそのまま残存。
- **影響**: 「コース・プランの選び方」は購入直前の比較検討ページ。ここで見た価格より来店時の請求が10%高くなるため、来店キャンセル・クレーム・口コミ悪化に直結する。景表法上の有利誤認表示リスクもあり、サイト全体の価格情報の信頼性が崩れる。
- **修正**: how_to_choose と sp/how_to_choose の全価格を course_plan/trial と同じ税込価格に一括修正する。今後の再発防止として、価格は course_plan を唯一のマスタと定め、他ページは価格を書かず course_plan へリンクする方針に変更する。

### 🔴 致命 トップの「お知らせ」が2021年12月で更新停止、コロナ・冬季休暇告知が残存

- **箇所**: `cgiFolder/core_rss_feed.html`:109 ／ 工数 S
- **証拠**: index.html:471 が iframe で読み込む cgiFolder/core_rss_feed.html の記事は10件、投稿日は l.109「2021年 12月 04日」を最新に、l.114「2021年 10月 22日」、l.119「2021年 10月 20日」、l.124「2021年 10月 08日」、l.129「2021年 09月 08日」、l.134「2021年 09月 07日」、l.139「2021年 08月 28日」、l.144「2021年 08月 19日」、l.149「2021年 08月 08日」、l.154「2021年 08月 03日」。最新記事 l.110 の本文には「令和3年12月30日（木）～令和4年1月4日（火）まで冬季休暇」「今月は会員様限定のキャンペーン実施中！！」、l.120/125/140/145/150/155 には全記事「コロナ対策の為 手洗い・うがい・消毒・検温」「次亜塩素酸設置」の記載。l.150 は「今月のキャンペーンは、✨8月限定✨ SUMMER COOL キャンペーン」。
- **影響**: 現在2026年8月時点で4年8ヶ月前が最新。訪問者はまず「今も営業しているのか」を疑う。終了済みの冬季休暇・8月限定キャンペーン・コロナ対策文言が最新情報として表示され、閉店・休眠サロンと誤認されて予約前に離脱する。トップページ上の最大の信頼毀損要素。
- **修正**: 最短対応として index.html:468-472 のRSS iframeブロックを非表示にし、代わりに「営業日カレンダー／今月のキャンペーン」を静的に掲載する。継続するなら、実際に更新しているInstagram（index.html:532 のアカウント）の投稿を情報源に切り替え、月1回以上の更新を運用ルール化する。

### 🔴 致命 予約フォームへの導線がトライアルページのみ／ヘッダー「ご予約はこちら」がLINE追加に直行

- **箇所**: `index.html`:212 ／ 工数 M
- **証拠**: singlefolder/reservation.html（予約フォーム、l.187 に「予約フォーム」見出し、l.195 で新規予約／リピート予約／無料カウンセリング予約を選択）へのリンクは、site配下全HTMLの検索で trial/index.html:645・648 と sp/trial/index.html:392・395 の4箇所しか存在しない。index・beginner・course_plan・how_to_choose・campaign・faq・shopinfo からは1本もリンクがない。グローバルナビ（index.html:218-235）にも「ご予約」項目がない。ヘッダーの唯一のCTA index.html:212 は alt="ご予約はこちら" だが href は https://line.me/R/ti/p/%40pnb6242x のLINE友だち追加。電話番号 073-482-3765 は index.html:562 と shopinfo/index.html:226 にテキストで載るのみで tel: リンクは site 全体に0件。
- **影響**: 主要KPIである来店予約・電話問い合わせの受け皿に、ほとんどのページからたどり着けない。「ご予約はこちら」を押したユーザーはLINE友だち追加に飛ばされ、予約完了と誤認するか警戒して離脱する。料金を見て納得したユーザー（course_plan）から予約への橋がゼロ。
- **修正**: グローバルナビに「ご予約」を追加し reservation.html へリンク。各ページ下部（少なくとも course_plan・how_to_choose・campaign・faq・beginner）に「LINEで予約／フォームで予約／電話で予約」の3択CTAブロックを共通で設置する。電話番号は tel: リンク化する。ヘッダーボタンは「LINEで予約する」とラベルを実態に合わせる。

### 🔴 致命 全下層ページ共通の回遊カード（18枚×PC/SP＝36枚）がリンクタグ空でクリック不能、how_to_choose は3枚とも遷移先が誤り

- **箇所**: `faq/index.html` ／ 工数 M
- **証拠**: faq/index.html:353-375 の「当店の施術について」カード3枚は、画像 l.356 と見出し l.358 が <a> の外にあり、リンクは l.359『<p><a href="../assets/../trial/index.html" target="_self"></a></p>』のようにアンカーの中身が空。CSS css/G000000008/cssfiles/module_B000000148.css を全文確認したが、::after で領域を広げる等のストレッチリンク指定は一切なく（li は float:left/width:300px、.newslistdata は height:50px のみ）、cgiFolder/tieredworks_*.js にも thumbnailList をクリック可能にする処理はない。よってカードは全く押せない。同じ空アンカーが beginner/index.html:411,418,425／trial/index.html:660,667,674／course_plan/index.html:499,507,514／campaign/index.html:261,268,275／how_to_choose/index.html:697,705,713 と、SP側 sp/faq/index.html:182,187,192／sp/beginner/index.html:237,242,247／sp/trial/index.html:405,410,415／sp/course_plan/index.html:379,385,390／sp/campaign/index.html:125,130,135／sp/how_to_choose/index.html:357,362,367 に存在（計36箇所）。さらに how_to_choose/index.html:697/705/713 と sp/how_to_choose/index.html:357/362/367 は、見出しが「トライアル（体験）コース」「コース・プランのご案内」「コース・プランの選び方」と3種類あるのに href が3枚とも trial/index.html で、2枚は遷移先自体も誤っている。
- **影響**: （反証担当が追加検出）
- **修正**: 各カードの <a> でサムネイル画像と見出しを囲む形に修正し（<li> 内を <a href="..."> でラップするのが最小工数）、how_to_choose の3枚は trial/index.html・course_plan/index.html・how_to_choose/index.html へ正しく振り分ける。あわせて href の「../assets/../」という冗長パスを直接パスに整理する。PC6ページ×3枚、SP6ページ×3枚の計36箇所。

### 🔴 致命 SP版には予約CTAが事実上存在しない（ヘッダーボタン・ナビ・電話リンクすべて無し）

- **箇所**: `sp/index.html` ／ 工数 M
- **証拠**: PC版は index.html:212 をはじめ faq/index.html:207、trial/index.html:211、beginner/index.html:151、course_plan・campaign・shopinfo・singlefolder/*（reservation.html:123 含む）の全ページヘッダーに alt="ご予約はこちら" の top_reserve_btn.png が入っているが、grep top_reserve_btn の結果 sp/ 配下は0件。sp/index.html:81 のヘッダーは『<a href="#SF-grovalnaviPage" data-icon="bars">Menu</a><h1>HOME</h1><a href="./index.html" ...>Home</a>』のみ。sp/index.html:28-78 のグローバルナビ（パネル）にも「ご予約」項目なし。grep -rl line.me sp/ は sp/index.html の1ファイルのみで、該当は l.98 のトップページバナー1本だけ。予約フォームへのリンクは sp/trial/index.html:392,395 の2箇所のみ。href="tel:" は site 全体（PC/SP）で0件。
- **影響**: （反証担当が追加検出）
- **修正**: SP版のヘッダーまたはコンテンツ末尾に固定の3択CTA（電話 tel:0734823765／LINE https://line.me/R/ti/p/%40pnb6242x／singlefolder/reservation.html）を全ページ共通ブロックとして設置し、sp/index.html:30 以下のナビリストにも「ご予約・お問い合わせ」を追加する。エステの想定トラフィックはモバイル主体であり、PC版より優先度が高い。

### 🟠 重大 FAQ 4カテゴリ全てが同一のQ&A 1問のみ

- **箇所**: `faq/index.html`:274 ／ 工数 M
- **証拠**: faq/index.html には見出しが4カテゴリある（l.270 施術について／l.290 料金について／l.310 その他／l.330 ブライダルエステについて）が、Q&Aブロックは各1問ずつ計4件で、質問文は4件すべて l.274/294/314/334 の「エステティックは初めてなので、何かと心配な私でも大丈夫？」、回答も4件すべて l.279-281/299-301/319-321/339-341 の「ご安心ください。ルイーズレヴェでは事前に丁寧なカウンセリングを行い…」で完全一致。ユニークな質問は1問のみ、3問が重複。sp/faq/index.html:107/125/143/161 も同一文言で完全に同じ状態。さらに l.265 のカテゴリジャンプボタン（施術について／料金について／その他／ブライダルエステについて）は、どれを押しても同じ内容に飛ぶ。
- **影響**: 料金・ブライダルという最も不安の大きい領域の疑問が1つも解消されない。エステは高単価かつ勧誘不安が強い業種で、FAQは予約前の最後の関門。この状態は「作りかけのサロン」という印象を与え、離脱と電話問い合わせ工数増を招く。
- **修正**: カテゴリごとに最低5問ずつ実運用の質問を追加する。料金には「表示価格は税込か」「追加費用・物販の押し売りはあるか」「支払方法・分割の可否」「キャンセル料」、ブライダルには「挙式何ヶ月前から通えばよいか」「1DAYで間に合うか」「背中のニキビ・日焼けはどうするか」、施術には「生理中・妊娠中でも受けられるか」「所要時間と勧誘の有無」など。

### 🟠 重大 トップ「おすすめプラン」3枚のリンク先が全てトップページ自身

- **箇所**: `index.html`:422 ／ 工数 S
- **証拠**: index.html の「おすすめプラン」（l.397 見出し）配下の3枚のカードは、l.422「ヘッドスパ＆頭皮ケア／クレインフィールケア（50分）￥8,250-」、l.435「部分痩せメニュー／スマッシュセル パーツ痩せ 下半身（60分）￥6,600」、l.447「肌質改善メニュー／うるおいハーブトリートメント 1g ￥11,000-」のいずれも <a href="index.html"> で自分自身に戻る。sp/index.html:209/222/232 も同じく href="index.html"。すぐ上の「トライアル（お試し）プラン」6枚（index.html:323/336/349/362/375/388）は trial/index.html#A〜#F へ正しく飛んでおり、この3枚だけが未設定。
- **影響**: 最も興味を持ったユーザーが「詳しく知りたい」でクリックした結果、同じページの先頭に戻される。詳細情報にも予約にも到達できず、離脱率が最も高くなる導線。3メニューぶんの送客が丸ごと失われている。
- **修正**: ヘッドスパは course_plan/index.html の HEAD SPA ブロック（B000000135）、部分痩せは同 BODY CARE のスマッシュセル行、肌質改善は FACIAL CARE ブロックへのアンカーリンクに差し替える。PC/SP 両方（計6箇所）を修正する。

### 🟠 重大 予約フォームに自動返信メールが無効で、「予約確定ではない」旨・返信目安の記載もない

- **箇所**: `singlefolder/reservation.html` ／ 工数 M
- **証拠**: singlefolder/reservation.html:181 のフォームは action="javascript:TW_confirm('../cgiFolder/mail_send.php')" で、l.190『<input type="hidden" name="auto_reply_mail_flag" value="0" />』により送信者への自動返信メールが無効化されている（auto_reply_mail_subject/header/footer は l.187-189 に用意済みなのに未使用）。同ページを全文検索しても「確定」「折り返し」「営業日」「返信」「ご連絡」は0件で、送信後にいつ・どうやって連絡が来るのかの説明が一切ない。l.481-483 の送信部も「上記の内容でよろしければ、送信ボタンをクリックしてください。」のみ。一方 beginner/index.html:260-262 には「予約フォームからお申込みいただいた方には、店舗スタッフより確認のお電話が入ります。確認電話でご来店日時をご相談後、ご予約の確定となります。」と明記されており、肝心のフォームページにこの説明がない。フォームは l.338/399 で第1・第2希望日を必須入力させる作りで、期待値のズレが起きやすい。
- **影響**: （反証担当が追加検出）
- **修正**: auto_reply_mail_flag を 1 にして自動返信を有効化する（本文は既に l.188-189 に用意済み）。あわせて reservation.html の送信ボタン直上に「このフォームは予約リクエストです。スタッフから確認のお電話を差し上げ、日時をご相談のうえ予約確定となります（◯営業日以内にご連絡）」と明記し、beginner/index.html:260-262 の文言を流用する。PC/SP計2ページ。

### 🟡 中 サイト全体で税込・税抜の表記が一切ない（総額表示未対応）

- **箇所**: `course_plan/index.html`:231 ／ 工数 S
- **証拠**: site 配下の全HTMLを「税込／税抜／消費税／税別」で全文検索したが1件もヒットしない。一方 course_plan/index.html:231 以降は「16,500円」「25,300円」「26,400円」…、index.html:319 は「通常90分　￥16,500」、trial/index.html:290 は「通常価格　￥16,500」、campaign/index.html:235 は「【25分】通常￥4,400　→　特別価格￥2,200」と価格だけが並ぶ。ブライダルCコースは course_plan/index.html:407 で「88,000円」。
- **影響**: 高額メニュー（88,000円）を含むのに税込か税抜かが判別できない。総額表示義務への非対応であるだけでなく、来店時の「思っていた金額と違う」トラブルの温床。価格を比較検討する見込み客が問い合わせ前に離脱する。
- **修正**: 各料金表の直上または直下に「表示価格はすべて税込です」を明記する。course_plan・trial・campaign・how_to_choose・index の料金掲載ブロック全て（PC/SP計10ページ）に同一文言を入れる。

### 🟡 中 キャンペーンが冬の季節表現のまま・期限も件数も不足

- **箇所**: `campaign/index.html`:230 ／ 工数 S
- **証拠**: campaign/index.html:230「まだまだ冷えを感じる季節に内面から温め代謝UP！」（sp/campaign/index.html:102 も同文）。現在は2026年8月。掲載キャンペーンは l.229 コラーゲンライトと l.244 ミネラリアダイエットの2件のみで、開始日・終了日・「◯月限定」等の期間表記が皆無。l.247「初回半額　￥4,950　（６０分）」には対象条件（初回のみ／お一人様1回限り等）の記載もない。ページ冒頭 l.215-216 のリード文も「お得なメニューやフェイシャル、ボディなどのコースをご紹介しています」で時期に触れていない。
- **影響**: 真夏に「冷えを感じる季節」と書かれていることで、サイト全体が長期間放置されていると判断される。期限がないため「今行く理由」が生まれず、キャンペーンの本来の役割（予約の背中押し）が機能していない。トップ index.html:279 のバナー「コラーゲンライト　お試しキャンペーン中」も同じ古い内容に着地する。
- **修正**: 季節表現を削除し「夏の冷房冷え・夏バテ対策に」等の現行季節に合わせた表現へ差し替え。各キャンペーンに「〇年〇月〇日まで」「先着〇名様」「初回のみ・お一人様1回限り」を必ず併記する。月次で見直す運用を決め、掲載できる企画がない月は「今月のおすすめ」として通常メニューを回す。

### 🟡 中 スタッフ6名中2名の紹介ページが見出しだけで中身が空

- **箇所**: `singlefolder/staff_5.html`:225 ／ 工数 S
- **証拠**: singlefolder/staff_5.html:225 の見出し「池田　真比呂 （いけだ　まひろ）」の下、本文は自己紹介・「Louise Rever（ルイーズレヴェ）の魅力について」「仕事にやりがいを感じること」「エステをご検討のお客様へ」「私のオススメのメニュー」の4見出しだけが並び、回答が全て <br /> の空行。singlefolder/staff_6.html:225「西崎　彩奈」も同様に全項目が空。sp/singlefolder/staff_5.html:96-112 も同じ空状態。一方 staff_1（後垣内 千穂 l.224-240）、staff_3（西崎 翔子）、staff_3_1（吉田 颯生）、staff_4（宮本 和枝）は全項目が記入済み。beginner/index.html:355-400 のスタッフ一覧は6名分のサムネイルを掲載し、shopinfo/index.html:241 も「6名」と表記しており人数自体は一致するが、うち2名分は開いても情報がない。
- **影響**: 施術者を見て安心したい見込み客がクリックした先が空白。担当者への不信につながり、指名予約・リピートの機会を失う。beginner の l.352「写真をクリックしていただくと、各スタッフの詳細ページに行きます」という誘導が空振りする。
- **修正**: 2名分のプロフィール（自己紹介・魅力・やりがい・お客様へ・おすすめメニュー）を取材して埋める。すぐ埋められない場合は beginner/index.html:386-399 の該当2名のサムネイルからリンクを外し、名前と写真のみの掲載に留める。

### 🟡 中 営業時間に終了時刻がなく、ブログ記載の19時と齟齬

- **箇所**: `shopinfo/index.html`:231 ／ 工数 S
- **証拠**: shopinfo/index.html:231「Open：10:00～※予約制」。同じ表記が index.html:567、sp/index.html:328、sp/shopinfo/index.html:133、および shopinfo/index.html:9 と sp/shopinfo/index.html:6 の meta description にもある。一方 cgiFolder/core_rss_feed.html:110/120/140/145/150 のブログ本文では一貫して「OPEN　１０：００～１９：００」「AM10時～PM19時まで」と明記されている。定休日は shopinfo/index.html:236「月曜日・第１第３日曜日」で、ブログ l.110「毎週月曜日・第一日曜・第三日曜日」と一致。
- **影響**: 「何時まで開いているか」は仕事帰りに通えるかを判断する最重要情報。終了時刻不明のままでは夕方来店を検討する層が問い合わせずに離脱する。Googleビジネスプロフィール等の他媒体と食い違えばさらに混乱を招く。
- **修正**: 「10:00～19:00（最終受付は施術時間により異なります）※完全予約制」に統一し、shopinfo・index の PC/SP 計4箇所と meta description 2箇所を同時に修正する。

### 🟡 中 メニューに存在しないサービスをmeta descriptionと本文で訴求

- **箇所**: `index.html`:9 ／ 工数 S
- **証拠**: index.html:9 の meta description は「フェイシャルエステ､痩身､脱毛､まつ毛エクステ、カール､ゲルマニウム温浴､ネイルなどの本格エステサロンです｡」。しかし course_plan/index.html の全料金表（l.227-486）に「ゲルマニウム温浴」「カール（まつ毛カール）」の項目は存在せず、site 全体を検索しても「ゲルマニウム」「温浴」は index.html:9 の1箇所のみ。掲載があるのは l.437「●エクステ Free(つけ放題)」と l.443「●ネイル」だけ。同様に beginner/index.html:224（sp:111）は「フェイシャルエステ・痩身ボディエステ、脱毛、ブライダルエステ、ホワイトニングに至るまで」と書くが、「ホワイトニング」はこの2箇所にしか存在せずメニュー表にない。
- **影響**: 検索結果のスニペットや導入文で期待させたサービスがサイト内に見つからず、ユーザーは不信感を持って離脱する。実際に提供していないなら不当表示にあたる。逆に提供しているならメニュー表への掲載漏れで、売上機会を丸ごと落としている。
- **修正**: 提供中ならゲルマニウム温浴・まつ毛カール・ホワイトニングを course_plan に価格・所要時間つきで追加する。提供終了しているなら index.html:9 と beginner/index.html:224（PC/SP計4箇所）から該当語を削除する。

### 🟡 中 トップ掲載メニュー名・所要時間が料金表と一致しない

- **箇所**: `index.html`:444 ／ 工数 M
- **証拠**: index.html:444「うるおいハーブトリートメント／1g　￥11,000-」（sp/index.html:228 も同じ）というメニュー名は course_plan/index.html のどの表にも存在しない。1g・11,000円で該当しうるのは course_plan/index.html:339-341「●改善コース　クレストリバースケア　1g／60分／11,000円～」のみで、名称が全く別。また index.html:354 は「ボディートリートメントコース」（長音「ー」入り）／l.358「通常90分　￥6,600」だが、trial/index.html:465 は「ボディトリートメント　トライアルコース」／「40分～90分」で表記も所要時間も異なり、course_plan の料金表には「ボディトリートメント 6,600円」という行自体が存在しない（最も近いのは l.298-300 アロマトリートメント 60分 8,800円）。
- **影響**: トップで見た名前を料金表で探しても見つからず、ユーザーが「同じものか別物か」判断できない。所要時間が90分か40分かで来店計画が変わるため、予約後の齟齬やキャンセルにつながる。
- **修正**: メニュー名称を course_plan の正式名称に統一する（「うるおいハーブトリートメント」→「改善コース クレストリバースケア」等）。ボディトリートメントは正式名称・所要時間を確定させ、course_plan の料金表にも1行として掲載する。名称の一覧を作り PC/SP 全ページを突き合わせる。

### 🟡 中 ブライダルバナーとContactボタンがhref="#"の空リンク

- **箇所**: `index.html`:281 ／ 工数 S
- **証拠**: index.html:281『<li class="SF-simpleImg"><a href="#"><img width="240" src="./assets/top_bana3.png" alt="はじめてのブライダルエステ"/></a></li>』。同ブロックの他3枚は l.279 campaign/index.html、l.280 https://louiserever.jp/blog/、l.282 LINE と正しくリンクされており、ブライダルだけ未設定。index.html:585『<a href="#" target="_blank" class="button-rink2">Contact</a>』も空リンク。sp/index.html:97 と sp/index.html:346 も同一。site全体で href="#" はこの4箇所のみ。
- **影響**: ブライダルエステは客単価が最も高く（course_plan:395-413 で33,000〜88,000円）、title でも訴求している主力商材。その専用バナーがクリックしても何も起きない。フッター直上のContactボタンも死んでおり、ページ最下部まで読み込んだ最も温度の高いユーザーを取りこぼしている。
- **修正**: ブライダルバナーは course_plan/index.html の BRIDAL Course ブロック（B000000133）へリンク。中期的にはブライダル専用LPを作る。Contactボタンは singlefolder/reservation.html へリンクする。PC/SP計4箇所。

### 🟡 中 スタッフ・予約ページのtitleとdescriptionが全て空

- **箇所**: `singlefolder/staff_1.html`:8 ／ 工数 S
- **証拠**: singlefolder 配下7ファイル（staff_1／staff_3／staff_3_1／staff_4／staff_5／staff_6／reservation）すべて l.8 が『<title></title>』、l.9 が『<meta name="description" content="" />』。一方 SP版は sp/singlefolder/staff_5.html:79 のように <h1>池田　真比呂</h1> を持ち、他のPC主要ページは index.html:8「海南市で人気のエステサロン【LOUISE REVER】」等が入っている。
- **影響**: 検索結果やブラウザタブ・SNSシェア時にページ名が出ず、URLがそのまま表示される。スタッフ指名検索や「ルイーズレヴェ 予約」での流入を取りこぼす。予約フォームというコンバージョン直結ページに名前がないのは特に損失が大きい。
- **修正**: staff_*.html は「後垣内 千穂（店長）｜スタッフ紹介｜エステサロン【LOUISE REVER】」形式、reservation.html は「ご予約・無料カウンセリングのお申込み｜エステサロン【LOUISE REVER】」に設定し、description には各スタッフの得意メニュー／予約手順を80〜120字で記述する。

### 🟡 中 キャンセル規定・トライアル利用条件・中途解約の記載が皆無

- **箇所**: `trial/index.html`:289 ／ 工数 M
- **証拠**: trial/index.html の6コース（l.279 フェイシャル／l.341 シミ・美白／l.403 水素導入／l.465 ボディ／l.526 グラマラス／l.588 モホロジー）はいずれも「トライアル料金」欄（l.289-291 等）に価格を記すのみで、「初回のみ」「お一人様1回限り」「同伴不可」等の条件記載がない。ページ全体で注記は l.482「※パーツにより施術時間の変動があります。」の1件のみ。site 全体を「キャンセル」「クーリング」「中途解約」「特定商取引」で検索すると0件（プライバシーポリシーは singlefolder/reservation.html:508 のみ存在）。一方 cgiFolder/core_rss_feed.html:110/120 のブログ本文では「※完全予約制（ご予約はお早目にお願い致します。）※当日キャンセル等はお控えくださいませ。」と繰り返し告知されている。course_plan/index.html:395-407 にはブライダル33,000〜88,000円の回数コースが掲載されている。
- **影響**: 当日キャンセル時の扱いが分からないため、予約をためらう層が生まれる。同時に、サロン側は無断キャンセルを注意する根拠を持てず、実損が出る。高額の回数コースについて解約条件が示されないことは、慎重な見込み客ほど不安に感じる箇所で、成約の障壁になる。
- **修正**: trial・course_plan・reservation の各ページ下部に共通の注意事項ブロックを設置する。内容は「完全予約制」「トライアルは初回のお客様お一人様1回限り」「前日◯時までのご連絡でキャンセル無料、当日キャンセルは施術料金の◯%」「回数コースの有効期限と中途解約時の精算方法」。ブログで既に告知している文言をそのまま流用できる。

### 🟡 中 course_plan内でスーパーセル脂肪溶解60分だけ税抜水準の価格

- **箇所**: `course_plan/index.html`:320 ／ 工数 S
- **証拠**: course_plan/index.html:316-320「●スーパーセル脂肪溶解 ラフォス（ラジオ波）＋ハンドトリートメント／・全身 120分 19,800円／・上半身または下半身 60分 12,000円」。同ページの他の価格は 16,500／25,300／26,400／19,800／13,200／8,250／3,300／9,900／8,800／11,000／27,500／22,000 と全て1.1で割り切れる税込らしい数値だが、12,000円だけが端数のない旧税抜水準。how_to_choose/index.html:643「・スーパーセル脂肪溶解ラフォス（60分）12,000円」と一致するが、how_to_choose は content-01 のとおりページ全体が旧税抜価格であり、course_plan に旧価格が1行だけ紛れ込んでいる状態。税込にすれば13,200円になるはず。
- **影響**: マスターであるべき料金表の中に更新漏れが1行残っており、来店時に想定より1,200円高く請求される可能性がある。他の価格の正確性にも疑いが生じる。
- **修正**: 正しい税込価格を確認し course_plan/index.html:320 と sp/course_plan/index.html の該当行を修正する。あわせて料金表全体を1.1で割り切れるかチェックし、他に更新漏れがないか洗い出す。

### 🟡 中 トップの「LINE@」セクションの画像がリンクになっておらず、LINE友だち追加に飛べない

- **箇所**: `index.html` ／ 工数 M
- **証拠**: index.html:536-540 の LINE@ ブロックは、l.537 に <h2>LINE@ -ライン-</h2> の見出しがあるが、l.540 は『<img src="./assets/top_line_at.jpg" alt="LINE@はじめました！" style="">』で <a> に囲まれていない。すぐ上の INSTAGRAM ブロックは l.532 で『<a href="https://www.instagram.com/louise.rever_wakayama/" target="_blank"><img ...></a>』と正しくリンクされているのと対照的。LINE のURL（https://line.me/R/ti/p/%40pnb6242x）は index.html:212 のヘッダーボタンと l.282 のバナーには設定済みで、URL 自体は判明している。cgiFolder/core_rss_feed.html:115 のブログ本文でも「ＬＩＮＥからのご予約も可。ＬＩＮＥご登録いただくとステキな特典も。」と訴求されている。
- **影響**: （反証担当が追加検出）
- **修正**: index.html:540 の img を <a href="https://line.me/R/ti/p/%40pnb6242x" target="_blank"> で囲む。SP版 sp/index.html の同ブロックも同様に修正し、あわせて画像内に「友だち追加はこちら」のラベルがあるかを確認して不足なら明示する。

### ⚪ 軽 価格表記の表記ゆれ（円／￥／末尾ハイフン／～）がページ間で不統一

- **箇所**: `index.html`:420 ／ 工数 M
- **証拠**: course_plan/index.html は「16,500円」形式（l.231他）だが、同ページ l.460 の脱毛例だけ「・両わき　￥2,200　/　膝下　￥8,250　/　肘下　￥5,500」と￥形式。index.html は「￥16,500」（l.319）と￥形式だが、l.420「（50分）　￥8,250-」と l.445「1g　￥11,000-」の2件だけ末尾にハイフンが付き、l.432「（60分）　￥6,600」にはない（sp/index.html:207/228/217 も同一）。上限不明を示す「～」は course_plan/index.html:341「11,000円～」、l.439「7,700円～」、l.445「4,400円～」で使われ、ブライダルの所要時間欄 l.394/400/406/412/438 は「-」（半角ハイフン）で「未定/該当なし」を表す。campaign/index.html:235 は「通常￥4,400　→　特別価格￥2,200」。
- **影響**: 同じサロンの料金なのに書式がページごとに違い、価格情報が管理されていない印象を与える。特に末尾ハイフン（￥8,250-）は「〜から」なのか「〜まで」なのか読み取れず、また所要時間欄のハイフンと意味が衝突して誤読を招く。
- **修正**: 「12,345円（税込）」形式に全ページ統一する。上限不明は「〜」ではなく「11,000円（税込）〜」と表記し、該当なしの欄はハイフンではなく「―」または「都度ご案内」と書く。末尾ハイフン2件（index/sp計4箇所）は削除する。

### ⚪ 軽 お知らせ枠に見出しがなく、ブログ導線が2系統に分裂

- **箇所**: `index.html`:471 ／ 工数 S
- **証拠**: index.html:468-472 の SF-row2 col1 は『<iframe class="coreRssFeed" src="./cgiFolder/core_rss_feed.html"></iframe>』のみで、見出し要素が一切ない。隣の col2 には l.528「INSTAGRAM -インスタグラム-」、l.538「LINE@ -ライン-」と見出しが付いており、お知らせ枠だけラベルなし。またこのiframeが表示する記事は cgiFolder/core_rss_feed.html:108 等より ameblo.jp/louisrever のもの。一方 index.html:280 の「最新情報」バナーは https://louiserever.jp/blog/ へ、l.289 のリンク画像は https://louiserever.jp/ へ飛ぶ。
- **影響**: 何のリストか分からない枠に、リンク先の異なる別ブログの古い記事が並ぶ。「最新情報」バナーとお知らせ枠で情報発信先が違うため、ユーザーはどちらを追えばよいか判断できず、どちらも見られなくなる。
- **修正**: お知らせ枠に「NEWS -お知らせ-」の見出しを付け、情報源を実際に運用しているチャネル1つに絞る。ameblo を廃止するなら iframe を撤去し、louiserever.jp/blog または Instagram の導線に一本化する。

### ⚪ 軽 フッターのInstagram・Facebookアイコンがリンクになっていない

- **箇所**: `index.html`:579 ／ 工数 S
- **証拠**: index.html:579-580『<td class="t_l2"><i class="fab fa-instagram"></i></td><td class="t_r2"><i class="fab fa-facebook-square"></i></td>』— <a> で囲まれておらず href がない。sp/index.html:340-341 も同一。ページ上部 index.html:532 には https://www.instagram.com/louise.rever_wakayama/ への正しいリンクが存在するのに、フッターのアイコンからは飛べない。Facebook については site 全体を検索しても実URLが1件も存在しない。
- **影響**: サロン選びではSNSで雰囲気・施術例を確認してから予約する動線が一般的。押せると期待されるアイコンが反応しないことで、更新頻度の高いInstagram（唯一の生きた情報源）への送客を失う。存在しないFacebookのアイコン掲載も不信感を与える。
- **修正**: Instagramアイコンを https://www.instagram.com/louise.rever_wakayama/ へリンクする。Facebookページが実在するならURLを設定し、なければアイコンを削除する。PC/SP計4箇所。

### ⚪ 軽 SNSセクションの英字サブタイトルが「Recommendation」のまま

- **箇所**: `index.html`:458 ／ 工数 S
- **証拠**: index.html:457-458『<h4 class="newslistHeadlineStyle"><span class="mincho">SNS</span></h4><p><div class="kome_line"><span class="gothic">Recommendation</span></div></p>』。直前の「おすすめプラン」セクション l.397-398 が「おすすめプラン／Recommendation」であり、そのコピーが修正されずに残っている。sp/index.html:236 も同一。他セクションは index.html:299「New trial plan」、beginner/index.html:197「For guest」、l.247「Flow of treatment」、l.343「Staff」、faq/index.html:253「Q & A」、campaign/index.html:212「Campaign」と正しく対応している。
- **影響**: 見出しとサブタイトルが噛み合っておらず、コピペ作業の痕跡が表に出ている。単体の離脱要因ではないが、細部が詰められていない印象を積み上げ、高単価サービスへの信頼を削る。
- **修正**: 「SNS」に対応する英字（例：Social／Follow us）に差し替える。PC/SP計2箇所。

### ⚪ 軽 主要ページ本文とmeta descriptionに誤字が残存

- **箇所**: `course_plan/index.html`:218 ／ 工数 S
- **証拠**: course_plan/index.html:218「素肌がいきいきと美しくなっていくのを実感していただけメニューなど各種メニューが充実しております。」— 「実感していただけるメニュー」の脱字、かつ「メニューなど各種メニュー」の重複。同じ文が同ページ l.9-10 の meta description、および sp/course_plan/index.html:6 と l.100 にも入っており計4箇所。beginner/index.html:221「ホームぺージをご覧頂きありがとうございます。」— 「ぺ」がひらがな（正しくはカタカナ「ペ」）。sp/beginner/index.html:108 にも同じ誤字。
- **影響**: course_plan の誤字は検索結果のスニペットにそのまま表示され、初回接触時点で品質の低さを露呈する。beginner の誤字はサイト内で最も丁寧に書かれたブランドメッセージの1行目にあり、文章全体の説得力を損なう。
- **修正**: 「素肌がいきいきと美しくなっていくのを実感していただけるメニューなど、各種取り揃えております。」「ホームページをご覧いただきありがとうございます。」に修正。PC/SP合わせて6箇所。

### ⚪ 軽 トライアルページ内でid="B"が重複、ブライダル表に旧メニューがコメントアウトで残存

- **箇所**: `trial/index.html`:334 ／ 工数 S
- **証拠**: trial/index.html:334『<span id="B" name="B">&nbsp;</span>』と l.341『<h4 class="newslistHeadlineStyle"><div id="B" name="B">シミ・美白　ケア…</div></h4>』で同一 id が2つ存在。他のアンカー（l.272 A、l.396 C、l.458 D、l.519 E、l.581 F）はいずれも1箇所ずつで、Bのみ重複。index.html:336 からの trial/index.html#B 遷移がどちらに着地するかブラウザ依存になる。また course_plan/index.html:416-434 には BRIDAL Course 表内に「●毛穴ケア 8,800円／●集中ケア 27,500円／●潤い保湿ケア 13,200円」の3行がHTMLコメントとして残っている。
- **影響**: アンカー重複はトップからの「シミ・美白ケア」導線の着地位置を不安定にする。コメントアウトされた旧ブライダルメニューはページソースに残り続け、掲載/非掲載の判断が管理されていないことを示す。将来の誤復活リスクもある。
- **修正**: trial/index.html:341 の div から id/name="B" を削除し、アンカーは l.334 の span に一本化する。course_plan/index.html:416-434 のコメントブロックは、提供終了なら削除、提供中なら有効化して価格を最新の税込に更新する。

### ⚪ 軽 スタッフ画像ファイル名の拡張子が壊れている（staff_3._2jpg）

- **箇所**: `singlefolder/staff_3_1.html`:224 ／ 工数 S
- **証拠**: assets/ 内の実ファイル名が「staff_3._2jpg」（本来は staff_3_2.jpg）。singlefolder/staff_3_1.html の吉田 颯生のプロフィール画像が『<img width="400" src="../assets/staff_3._2jpg" alt=""/>』でこの壊れた名前を参照している。他のスタッフ画像は staff_1_1.jpg／staff_3_1.jpg／staff_4_1.jpg／staff_5_1.jpg／staff_6_1.jpg と正しい命名。また beginner/index.html:373 では吉田 颯生のサムネイルに ../assets/staff_2.jpg を使っており、staff_2 という欠番の連番と、staff_3_1 というページ名がずれている。
- **影響**: 拡張子がないためサーバー設定によっては正しいContent-Typeで配信されず、スタッフ写真が表示されない可能性がある。ファイル命名と実際のスタッフの対応がずれており、写真の差し替え時に誤ったスタッフの画像を上書きする運用事故を招きやすい。
- **修正**: assets/staff_3._2jpg を staff_3_2.jpg にリネームし、singlefolder/staff_3_1.html と sp 側の参照を修正する。あわせてスタッフ画像とページ名を staff_1〜staff_6 の連番に整理し、beginner の一覧参照も合わせる。


## 導線・CRO・IA（29件）

### 🔴 致命 予約フォームへの導線が全31ページ中トライアル頁のみ

- **箇所**: `singlefolder/reservation.html`:181 ／ 工数 S
- **証拠**: 全HTML 31ファイルを `grep -rn "reservation"` した結果、reservation.html へのリンクは trial/index.html:645,648 と sp/trial/index.html:392,395 の計4本のみ。トップ(index.html)、course_plan、campaign、beginner、faq、how_to_choose、shopinfo からのリンクは0本。グローバルナビ(index.html:219-233)にも予約項目は無い。ヘッダーの「ご予約はこちら」(index.html:212)はLINE(line.me)へ飛ぶため自社フォームには到達しない。
- **影響**: サイト唯一の予約受付フォームが実質孤立ページ。トップから直接到達できず、トライアル頁を最下部までスクロールした人だけが辿り着く。LINE未利用層（40代以上・法人・LINE友だち追加を嫌う層）は予約手段が事実上ゼロで、そのまま離脱する。
- **修正**: (1) グローバルナビに「ご予約・お問い合わせ」を追加し reservation.html へリンク。(2) ヘッダーの「ご予約はこちら」ボタンを reservation.html に変更し、LINEは別ボタンとして並置。(3) 全下層ページ末尾に予約CTAブロックを共通挿入。

### 🔴 致命 SP版に常時表示CTAが皆無・下層6頁は予約導線ゼロ

- **箇所**: `sp/index.html`:81 ／ 工数 M
- **証拠**: sp/index.html:81 の固定ヘッダーは `<a href="#SF-grovalnaviPage" data-icon="bars">Menu</a><h1>HOME</h1><a href="./index.html" data-icon="home">Home</a>` のみ。sp/index.html:386-388 の固定フッターは `<p>© Louise Rever</p>` のみ。さらに `grep -rn "line.me" ./sp/` はsp/index.html:98の1件のみで、sp/beginner・sp/campaign・sp/course_plan・sp/how_to_choose・sp/faq・sp/shopinfo の6ページには予約リンクもLINEリンクも電話番号も1件も存在しない（各ページのfooterは©のみ）。
- **影響**: スマホ流入が主体の業種で、jQuery Mobileの固定ヘッダー/フッターという最良のCTA枠を「Menu」「Home」「©」で潰している。料金を見終わった sp/course_plan（428行）や、来店直前に見る sp/shopinfo からは予約・電話への出口が物理的に存在せず、ブラウザバックしか選択肢が無い。
- **修正**: jQuery Mobileの `data-role="footer" data-position="fixed"` 内に「電話する(tel:)」「LINEで予約」「予約フォーム」の3分割ボタンバーを全SPページ共通で設置。SP全ページのテンプレートに1箇所追加するだけで全ページに効く。

### 🟠 重大 電話番号がtel:リンク化されておらず全サイト0件

- **箇所**: `index.html`:562 ／ 工数 S
- **証拠**: `grep -rn "tel:" --include="*.html"` の結果は全31ファイルで0件。電話番号 073-482-3765 は index.html:562、shopinfo/index.html:226、sp/index.html:323、sp/shopinfo/index.html の `<td class="t_r_tel">073-482-3765</td>` というプレーンテキストのみ（全体で9箇所、5ファイル）。
- **影響**: 営業時間10:00〜・予約制のサロンで、電話は最も成約率の高い導線。スマホユーザーはタップで発信できず、番号を長押し選択→コピー→電話アプリ起動という3〜4操作を強いられる。Androidの一部ブラウザでは自動検出も効かず、ここで確実に一定数が脱落する。またSP下層ページ(sp/campaign, sp/course_plan, sp/how_to_choose, sp/faq, sp/beginner)には番号すら記載が無い。
- **修正**: 全ページの電話番号を `<a href="tel:0734823765">073-482-3765</a>` に置換。加えてSPは固定フッターに発信ボタンを常設し、営業時間外は「LINEで予約」に切り替える文言を添える。

### 🟠 重大 予約申込の自動返信メールがOFF（顧客に何も届かない）

- **箇所**: `singlefolder/reservation.html`:190 ／ 工数 S
- **証拠**: `<input type="hidden" name="auto_reply_mail_flag" value="0" />`（PC版190行、SP版 sp/singlefolder/reservation.html:108）。一方 auto_reply_mail_subject / header / footer はBase64で完全に用意されており、header をデコードすると「ご予約ありがとうございました。下記の内容で受け付けました。」、footer には住所・TEL・MAILまで記載済み。文面は作ってあるのにフラグが0で無効化されている。
- **影響**: 14項目を入力して送信した顧客に確認メールが1通も届かない。画面上の「送信が完了しました」だけが証跡で、控えが残らないため「本当に送れたのか」という不安が発生。beginner/index.html:261 が「店舗スタッフより確認のお電話が入ります」と告知しているため、折り返しが来るまで顧客は宙吊りになり、その間に他店へ流れる。
- **修正**: auto_reply_mail_flag を 1 に変更（1行修正）。文面は既に用意済みなので即日反映可能。あわせて自動返信本文に「営業時間内○時間以内に折り返します／お急ぎはお電話を」と応答時間の約束を追記。

### 🟠 重大 キャンペーン頁（最強オファー）に予約導線が1本も無い

- **箇所**: `campaign/index.html`:236 ／ 工数 S
- **証拠**: campaign/index.html:236「コラーゲンライト 初回のみ【25分】通常￥4,400→特別価格￥2,200」、:249「ミネラリアダイエット 初回半額 ￥4,950（60分）」。本文190〜350行のリンクを抽出すると `#wrap`(PAGE TOP) と、後述の空アンカー3本のみで、予約・電話・LINEへのリンクは0本。sp/campaign/index.html も同様（本文リンクは空アンカー3本のみ、footerは©）。トップ index.html:279 のバナー「コラーゲンライト お試しキャンペーン中」はこのページへ誘導している。
- **影響**: 半額という最も強い購買動機を作った直後に、行動できる場所が無い。トップバナー→キャンペーン頁という主要導線の終点が行き止まりで、この流入は構造的に100%取りこぼしている。期限表記も無いため緊急性も働かない。
- **修正**: 各キャンペーン枠の直下に「このキャンペーンを予約する」ボタンを設置し、reservation.html?menu=コラーゲンライト のように種別をプリセット。あわせて「◯月◯日まで／先着◯名」の期限を明記。

### 🟠 重大 料金頁2本（計1,415行）の本文にリンクが0本

- **箇所**: `course_plan/index.html`:491 ／ 工数 M
- **証拠**: course_plan/index.html（609行）の本文200〜490行から `<a href>` を抽出すると0件。how_to_choose/index.html（806行）の本文200〜690行も0件。両ページ末尾の「当店の施術について」カード（course_plan:498-513、how_to_choose:696-711）は後述の通り空アンカーで機能しない。結果、この2ページの本文にはクリックできる要素が一切存在しない。
- **影響**: 「コース・プランのご案内」はポールシェリー120分25,300円といった高単価メニューを並べた検討の中核ページ。ここまで読み込んだ＝最も購買意欲の高いユーザーが、次の一手を取れない完全な袋小路に置かれている。
- **修正**: 各料金テーブルの直下に「このコースを相談する／トライアルを見る」リンクを配置。最低限、ページ末尾に予約CTAブロックを追加する。

### 🟠 重大 回遊カード30箇所が空の<a></a>でクリック不可

- **箇所**: `trial/index.html`:660 ／ 工数 S
- **証拠**: `grep -rnoE '<a href="[^"]*"[^>]*></a>'` で10ページ計30件を検出。例: trial/index.html:660 `<a href="../assets/../trial/index.html" target="_self"></a>`。同659行の見出し `<h3>トライアル（体験）コース</h3>` と658行の `<img src="../assets/course_gaz1.jpg">` はいずれも <a> の外側にあり、<a> の中身は空。該当: trial(3)、course_plan(3)、how_to_choose(3)、faq(3)、campaign(3)、および sp/ 側の同5ページ(15) = 30件。
- **影響**: 全下層ページ共通の回遊ブロック「当店の施術について」が全滅。画像とテキストがリンクの外に出ているため、ユーザーは矢印アイコン付きのカードを何度タップしても無反応で、「壊れているサイト」という印象＝信頼低下に直結する。ページ間回遊が設計上ゼロになり、トライアル頁（唯一の予約導線）への流入も失われている。
- **修正**: `<a href="../trial/index.html">` で `<li>` の中身（img + h3）全体を包む。CMSブロックのテンプレート修正で10ページ同時に解消できる。

### 🟠 重大 ブライダルバナーとContactボタンがhref="#"のデッドリンク

- **箇所**: `index.html`:281 ／ 工数 S
- **証拠**: index.html:281 `<li class="SF-simpleImg"><a href="#"><img src="./assets/top_bana3.png" alt="はじめてのブライダルエステ"/></a></li>`、index.html:585 `<a href="#" target="_blank" class="button-rink2">Contact</a>`。SP側も sp/index.html:97（さらに `rel="external"` 付きでjQuery Mobileがフルリロードを起こす）、sp/index.html:346。バナー画像 assets/top_bana3.png（240x120px）は花嫁の写真に「はじめての ブライダルエステ」と記載。
- **影響**: ブライダルエステは挙式日という締切がある最高単価・最高成約率のセグメント。トップの4バナー中1枚をそのために割きながら、タップしても何も起きない。site内にブライダル専用ページも存在せず（faq内の#A4アンカーのみ）、この需要を丸ごと捨てている。フッターの「Contact」も同様に無反応で、しかも target="_blank" 付きのため空白タブが開く実装になっている。
- **修正**: ブライダルバナーはブライダル専用LP（またはcourse_plan内のブライダルセクション）へリンク。Contactボタンは reservation.html へリンクし target="_blank" を除去。

### 🟠 重大 おすすめプラン3枚の矢印がトップページへの自己リンク

- **箇所**: `index.html`:422 ／ 工数 S
- **証拠**: index.html:422,435,447 いずれも `<a href="index.html" target="_self"><img src="./assets/arrow.png">` 。対象は「ヘッドスパ＆頭皮ケア ￥8,250」(415-423)、「部分痩せメニュー ￥6,600」(427-436)、「肌質改善メニュー ￥11,000」(440-448)。sp/index.html:209,220,230 も同一。すぐ上のトライアル6枚(index.html:323-388)は trial/index.html#A〜#F と正しくリンクされているため、この3枚だけ実装漏れ。
- **影響**: 価格を提示して「詳しくはこちら」の矢印を出しながら、タップするとトップページが再読込され最上部に戻る。ユーザーは自分が何をしたか分からないまま振り出しに戻され、離脱率が跳ね上がる典型パターン。しかもSPではページ全体の再読込＝待ち時間も発生する。
- **修正**: course_plan/index.html の該当メニュー位置にアンカーを打ち、`href="course_plan/index.html#headspa"` 等に修正。該当ページが無いものはトライアル頁へ寄せる。

### 🟠 重大 予約フォーム14項目47コントロール・電話番号がtype=text

- **箇所**: `singlefolder/reservation.html`:242 ／ 工数 M
- **証拠**: label_ 隠しフィールドを数えると項目群は14。実コントロール数(text/radio/checkbox/textarea)は47。内訳は 1.予約種別(radio3・必須) 2.お名前漢字(必須) 3.お名前ひらがな(必須) 4.電話番号(必須) 5.メールアドレス(必須) 6.メニュー(checkbox5) 7.新規様お試し[FACIAL CARE](checkbox3) 8.新規様お試し[BODY CARE](checkbox3) 9.予約希望日 第1希望 10.予約時間 第1希望(radio11) 11.予約希望日 第2希望 12.予約時間 第2希望(radio11) 13.問い合わせ内容(textarea/maxChars200) 14.当店を何でお知りになりましたか(checkbox4)。電話番号は242行で `<input type="text" ... maxlength="20">`、メールも254行が `type="text"`。SP版(sp/.../reservation.html:163,176)も同じくtype="text"で、inputmode/autocomplete属性は全フォームで0件。
- **影響**: スマホで電話番号欄をタップしてもQWERTYキーボードが出るため、数字入力に切り替える手間が発生。項目6〜8のメニュー選択はチェックボックス11個が並び、どれを選べばよいか判断できない。項目14「当店を何でお知りになりましたか」は完全に店舗都合の設問で、予約意欲のある顧客に最後の心理的ハードルを追加している。項目10・12の時間ラジオ22個は縦に長大で、SPでは延々スクロールが必要。
- **修正**: 第1段階を「予約種別・名前・電話・希望日時」の4項目に削減し、メニュー選択・きっかけ設問は送信後の確認電話またはカウンセリング時に回す。電話は `type="tel" inputmode="numeric" autocomplete="tel"`、メールは `type="email" autocomplete="email"`、名前は `autocomplete="name"` を付与。時間はradio22個をselectまたは午前/午後の2択に集約。

### 🟠 重大 ファーストビューに訴求もCTAも無い（SPスライダー4枚全て文字なし写真）

- **箇所**: `sp/index.html`:92 ／ 工数 M
- **証拠**: sp/index.html:92 のbxSliderは sp_slide_001〜004.jpg の4枚。実画像を確認したところ 001=店舗外観（開店祝いの花付き）、002=エントランス（開店祝いの花・胡蝶蘭）、003=待合ソファとシャンデリア、004=フェイシャル/ボディ施術中の写真。4枚とも文字テロップ・価格・オファー・ボタンは一切無い。その上のsp/index.html:86は `<img src="../assets/1x1.gif">`（43バイトの1x1透明GIF）で、見出し領域が視覚的に空。スライダー設定は `slideWidth: 1000` がハードコードされている一方、素材は640px幅。ファーストビュー内のリンクは固定ヘッダーのMenuとHomeのみ。
- **影響**: 初回訪問者が最初に見る画面から「何のサロンか／いくらか／何が他店と違うか／何をすればいいか」が一切分からない。開店祝いの花が写った写真2枚が先頭にあるため情報の鮮度も疑われる。トライアル4,400円や初回半額といった強い訴求は、いずれもスクロールしないと現れない。
- **修正**: 1枚目を「初回トライアル 90分 4,400円／和歌山・海南市／完全個室」のコピー入りバナーに差し替え、直下に『予約する』『電話する』ボタンを配置。1x1.gifのプレースホルダはキャッチコピーのテキスト見出しに置換。slideWidthは素材幅か100%に合わせる。

### 🟠 重大 トップと選び方ページで同一メニューの価格が不一致

- **箇所**: `how_to_choose/index.html`:251 ／ 工数 S
- **証拠**: how_to_choose/index.html:251「・通常価格　￥12,000」、:253「トライアル価格 ￥6,000」（シミ・美白ケア）。同じメニューが index.html:332-333 では「通常90分　￥13,200／初回トライアル　90分　￥6,600」。12,000×1.1=13,200、6,000×1.1=6,600 であり、how_to_choose 側だけ税抜表示のまま残っている。どちらのページにも税抜/税込の但し書きは無い。
- **影響**: 料金比較のために2ページを見比べた見込み客が、同じ施術に2つの価格を見つけることになり「どちらが本当か」で不信が生じる。エステは高額かつ勧誘イメージのある業種のため、価格の食い違いは予約直前で最も致命的に効く。総額表示義務の観点でも税抜のみの表示は是正が必要。
- **修正**: 全ページの価格を税込に統一し、how_to_choose の12箇所を修正。各料金表の冒頭に「表示価格はすべて税込です」を明記する。

### 🟠 重大 「予約フォームまたはお電話で」と案内する頁に両方とも無い

- **箇所**: `beginner/index.html`:260 ／ 工数 S
- **証拠**: beginner/index.html:260-262「予約フォームまたは、直接お電話にてご予約ください。／予約フォームからお申込みいただいた方には、店舗スタッフより確認のお電話が入ります。／確認電話でご来店日時をご相談後、ご予約の確定となります。」。しかし同ページ内に reservation.html へのリンクは0本、電話番号 073-482-3765 の記載も0件（予約導線はヘッダーのLINEボタン151行のみ）。sp/beginner/index.html:132-134 も同文で、こちらはヘッダーCTAすら無くページ内の予約導線が完全に0。
- **影響**: 「初めての方へ」は新規客が最初に読むページで、まさに予約行動を促す文章が書かれているのに、その場で予約フォームにも電話にも行けない。指示だけあって手段が無いという最悪の体験で、ここでの離脱は新規獲得数に直結する。
- **修正**: 「予約フォーム」の文字を reservation.html へのリンクに、「お電話」を tel: リンク付きの電話番号に変更。ステップ1のブロック直下に予約ボタンを設置する。

### 🟠 重大 アクセス解析タグがサイト全体で0件 — 予約数も流入経路も一切測定できていない

- **箇所**: `index.html` ／ 工数 M
- **証拠**: grep -rln "gtag|googletagmanager|analytics|UA-|G-[A-Z0-9]" --include="*.html" --include="*.js" を site 配下全体に実行した結果、ヒット0件。31のHTMLファイルおよび cgiFolder/ 配下の全JS（tieredworks_ajax.js, tieredworks_base.js, tieredworks_exts.js, tieredworks_libs.js, tieredworks_modules.js, tieredworks_spry.js, js/csLibrary.js）に GA4 / Googleタグマネージャ / 旧UA / 広告タグのいずれも存在しない。index.html の </body>（685行）直前にあるスクリプトは PC→SP のUAリダイレクト（674-682行）のみ。
- **影響**: （反証担当が追加検出）
- **修正**: 全ページ <head> にGA4（またはGTM）を1本入れる。TieredWorksのテンプレート改修が困難なら、まず index.html / trial/index.html / singlefolder/reservation.html / campaign/index.html の主要4ページに手貼りして流入と離脱を可視化する。conv-11のサンクスページ化はこのタグが入って初めて意味を持つため、順序としてこちらが先。

### 🟡 中 送信完了がページ遷移せずコンバージョン計測不可

- **箇所**: `cgiFolder/tieredworks_ajax.js`:352 ／ 工数 M
- **証拠**: フォームの action は `javascript:TW_confirm('../cgiFolder/mail_send.php')`（reservation.html:181）。cgiFolder/tieredworks_ajax.js:250 の TW_confirm は同一ページ内に div#SF-confirmarea を生成してフォームを display:none にし、:341 TW_send → :348 TW_compMail が `TWconfirmArea.innerHTML='送信が完了しました。'` と書き換えるだけ。URLは一切変化せず、サンクスページは存在しない（サイト内に thanks/complete 系HTMLは0件）。また action が javascript: スキームのため、JS無効・JSエラー時はフォームが完全に沈黙する。
- **影響**: GA4/広告のコンバージョン計測をページビューで設定できず、「サイト経由で何件予約が入ったか」が測定不能。改善投資の効果検証ができない状態が続く。さらに完了画面が本文の一部として差し替わるだけなので、スクロール位置によっては完了表示自体がユーザーの視界に入らない。
- **修正**: 送信成功時に /singlefolder/thanks.html へ遷移させ、そこにGA4コンバージョンイベントとLINE友だち追加への追撃CTA、当日の持ち物・アクセス案内を配置する。

### 🟡 中 予約希望日が任意項目のため日時未定の申込が成立する

- **箇所**: `singlefolder/reservation.html`:346 ／ 工数 M
- **証拠**: 予約希望日（第1希望）は `Spry.Widget.ValidationTextField("B00000031122", "none", {isRequired:false...})`（346行）、予約時間（第1希望）も `ValidationRadio("B00000031123", {isRequired:false})`（393行）。必須は 予約種別・名前漢字・名前かな・電話番号・メールアドレス の5項目のみ。日付欄は `<input type="text" maxlength="20">` の自由入力でプレースホルダは「例） 2019/05/20」（342行）と6年以上前の日付例のまま。
- **影響**: 希望日時が空でも送信できるため、店舗側は必ず電話で日程調整せざるを得ず、beginner/index.html:262「確認電話でご来店日時をご相談後、ご予約の確定となります」という運用が固定化。顧客側は「送っても電話が来るまで予約が取れない」ため、その場で完結する他店ネット予約に流れる。年月日の書式もバラバラで届き、転記ミスの温床になる。
- **修正**: 希望日をtype="date"（min=今日）で必須化し、時間帯も必須のselectに。例示日付を現在の日付に更新。可能なら空き枠カレンダー型の予約システム（STORES予約・SALON BOARD等）への置換を検討。

### 🟡 中 予約フォーム頁のtitle・descriptionが空

- **箇所**: `singlefolder/reservation.html`:8 ／ 工数 S
- **証拠**: singlefolder/reservation.html:8 `<title></title>`、:9 `<meta name="description" content="" />`、:10 `<meta name="keywords" content="" />`。sp/singlefolder/reservation.html:5 も `<title></title>` で同様。他のページ（index.html:8「海南市で人気のエステサロン【LOUISE REVER】」など）は全て埋まっており、予約ページだけ空。
- **影響**: 「ルイーズレヴェ 予約」等の指名検索でこのページが上位に出ず、検索からの直接予約流入を失う。ブラウザのタブ・履歴・ブックマークが無題で表示されるため、フォーム記入を中断して後で戻る動線も切れる。SNSやLINEでURLを共有した際も無題のカードになり、シェアされにくい。
- **修正**: `<title>ご予約・無料カウンセリングのお申し込み｜海南市のエステサロン LOUISE REVER</title>` と、予約方法・電話番号・営業時間を含むdescriptionを設定。

### 🟡 中 グローバルナビ8項目全てが情報頁でCV項目が無い

- **箇所**: `index.html`:219 ／ 工数 M
- **証拠**: index.html:219-233 のナビは HOME／初めての方へ／トライアル／コース・プランのご案内／コース・プランの選び方／よくある質問／キャンペーン／店舗のご案内 の8項目。予約・電話・アクセスといった行動項目は無い。sp/index.html:30-76 のパネル内listviewも同一8項目だが、各項目の直前に `<li data-role="list-divider">初めての方へ</li>` のように項目名と完全に同一文字列の見出しが7本挿入され、実質16行のリストになっている。
- **影響**: ナビの4/8が「コース・プラン」で始まる似た名前で、ユーザーは『トライアル』『コース・プランのご案内』『コース・プランの選び方』の違いを判断できない（実際は順に体験メニュー／全料金表／お悩み別診断で、後者2つは統合可能）。かつナビ全体に行動の出口が無いため、どのページを開いても予約に近づかない構造になっている。SPではさらに同じ語が2回連続で並び、メニューを開いた瞬間の可読性が著しく低い。
- **修正**: ナビを「初めての方へ／お悩みから選ぶ(旧・選び方)／メニュー・料金(旧・トライアル+ご案内を統合)／キャンペーン／よくある質問／店舗・アクセス」に再編し、最右に色を変えた『ご予約』を追加。SPのlist-dividerは重複しているため削除。

### 🟡 中 PC唯一の固定ボタンがPAGE TOP、予約ボタンは200x38px

- **箇所**: `index.html`:607 ／ 工数 S
- **証拠**: index.html:607-631、`#page-top { position: fixed; bottom:10px; right:20px; }` かつ `#page-top a { width:100px; padding:30px 0; background:#70592C; }` で約100x90pxの固定ボタン。全PCページに同一実装。一方、予約CTAは assets/top_reserve_btn.png（実測200x38px）をヘッダー内に `position:absolute; top:3px; right:0`（index.html:212）で置いた1個のみ。
- **影響**: スクロール中に常に画面に出ている唯一のボタンが「PAGE TOP」で、面積は予約ボタンの約1.2倍。最も貴重な常時表示枠を、売上に一切寄与しない機能に割り当てている。予約ボタンはヘッダー最上部の高さ38pxしかなく、スクロールすると即座に画面外へ消える。
- **修正**: 固定要素を「電話する／LINEで予約／フォームで予約」の追従バーに置き換え、PAGE TOPはその中の小アイコンに格下げ。ヘッダーの予約ボタンも高さ48px以上に拡大し、背景色でコントラストを付ける。

### 🟡 中 お悩み別12カテゴリの価格が全てアコーディオンで初期非表示

- **箇所**: `how_to_choose/index.html`:234 ／ 工数 M
- **証拠**: how_to_choose/index.html は くすみ・しみ・美白／しわ＆たるみ／にきび／ストレスによる髪質や頭皮／部分痩せしたい／メリハリのあるボディを／顔・デコルテ／背中／二の腕・肘・腕／ワキ／足／全身 の12カテゴリ構成。各カテゴリに `<h2 class="headlineStyle"><span class="csOpenClose">詳しく見る▼</span></h2>`（234,276,318,361,401,444,494,529,563,598,632,666行）があり、cgiFolder/js/csLibrary.js:469 の csOpenClose() が初期化時に対象ブロックへ `height:0px` を適用するため、おすすめメニューと価格は全て閉じた状態で描画される。
- **影響**: このページはサイト内で唯一「くすみ」「にきび」「部分痩せ」といった顧客自身の言葉で書かれた最も価値の高い導線だが、料金を知るには12回のタップが必要。SPでは開閉のたびに位置が動き、どこまで見たか分からなくなる。加えて中身に予約リンクが1本も無いため（conv-06）、開いても行き止まり。
- **修正**: 1つ目のカテゴリは既定で展開、または全カテゴリを常時展開してスクロールで読ませる。各「おすすめメニュー」の直下に「このメニューを相談する」ボタンを追加。ナビ名も「コース・プランの選び方」から「お悩みから選ぶ」に変更。

### 🟡 中 PC予約フォームの重複IDでラベルのタップ判定が効かない

- **箇所**: `singlefolder/reservation.html`:197 ／ 工数 S
- **証拠**: singlefolder/reservation.html:197,200,203 の3つのラジオが全て `id="value_select_radio_button_03"`。集計すると value_select_radio_button_42 が11個、同_30 が11個、value_select_check_box_12 が5個、_47 が4個、_03 が3個、_15/_18 が各3個と、計40コントロールが重複IDを持つ。`<label class="label" for="value_select_radio_button_03">`（194行）は最初の1つにしか結びつかず、各選択肢のテキスト（「新規予約」「リピート予約」等）は素の文字列でlabel要素に包まれていない。SP版(sp/singlefolder/reservation.html:115-122)は _0/_1/_2 の連番IDと個別 `<label for>` で正しく実装されており、PC版だけの不具合。
- **影響**: PC版フォームでは選択肢の文字をクリックしても反応せず、直径13px程度のラジオ/チェックボックス本体を正確に狙う必要がある。マウス精度の落ちる高齢層や、PCサイト表示に切り替えたタブレット利用者で選択ミス・入力放棄が発生する。
- **修正**: 各コントロールのidを _0,_1,_2… の連番に振り直し、選択肢テキストを `<label for="...">` で包む（SP版の実装をそのまま移植すればよい）。

### 🟡 中 選び方ページの回遊カード3枚が全て同じトライアル頁を指す

- **箇所**: `how_to_choose/index.html`:704 ／ 工数 S
- **証拠**: how_to_choose/index.html:697,704,711 は見出しが順に「トライアル（体験）コース」「コース・プランのご案内」「コース・プランの選び方」だが、リンク先は3本とも `href="../assets/../trial/index.html"`。他ページ（trial:660/667/674、course_plan:499/507/514、campaign、faq）は3つとも異なる正しい宛先を指しており、how_to_choose だけコピペミス。sp/how_to_choose/index.html:357,362,367 も同一の誤り。なお3本ともconv-07の空アンカーのため現状はそもそもクリックできない。
- **影響**: conv-07を修正した時点で、選び方ページから料金一覧（course_plan）へ行けないバグが顕在化する。お悩み別診断→詳細料金という最も自然な検討フローが断たれる。
- **修正**: 2枚目を ../course_plan/index.html、3枚目を ../how_to_choose/index.html（自ページなので削除も可）に修正。冗長な `../assets/../` も除去。

### 🟡 中 LINE導線のtarget不統一とSP版の旧line://スキーム

- **箇所**: `sp/index.html`:309 ／ 工数 S
- **証拠**: sp/index.html:309 `<a href="line://ti/p/%40pnb6242x" target="_blank">`（旧スキーム）に対し、同ファイル98行は `https://line.me/R/ti/p/%40pnb6242x`（現行スキーム）と、同一ページ内で2種類が混在。またPC全ページのヘッダー予約ボタン（index.html:212 ほか）は `line.me...` に `target="_self"` を指定しており、`grep -rn 'line.me[^"]*" target="_self"'` で15件。一方 index.html:282 のLINEバナーは `target="_blank"`。rel="noopener" は全サイトで0件。
- **影響**: line:// はLINEアプリ未インストール端末やPCブラウザで何も起こらず無反応になる。target="_self" の15件は同一タブでLINEへ遷移するため、LINE追加後にブラウザへ戻るとサイトが失われ、検討を再開できず離脱する。同じ「LINEで予約」でも挙動が2通りあり、体験が一貫しない。
- **修正**: 全LINEリンクを `https://line.me/R/ti/p/@pnb6242x` に統一し、`target="_blank" rel="noopener"` を付与。あわせてLINEボタンには「LINEで予約（24時間受付）」のようにボタン内で用途を明示する。

### 🟡 中 予約フォームに個人情報同意チェックが無くポリシーは200pxの箱

- **箇所**: `singlefolder/reservation.html`:535 ／ 工数 S
- **証拠**: singlefolder/reservation.html:500-504 の送信ブロックは「上記の内容でよろしければ、送信ボタンをクリックしてください。」＋入力内容確認／リセットの2ボタンのみで、同意チェックボックスは存在しない。プライバシーポリシー本文(511-528行)はフォームより下に置かれ、:535 `#B000000313 { height: 200px; overflow: auto; }` で高さ200pxのスクロール枠に押し込まれている。SP版(sp/.../reservation.html:426-431)も同様。
- **影響**: 氏名・電話番号・メールアドレスを送信させながら同意取得の導線が無く、個人情報の取扱いに関する説明も送信ボタンの後ろに小さく格納されている。プライバシー意識の高い層にとっては送信をためらう要因であり、事業者側のリスクにもなる。加えて「リセット」ボタンが送信ボタンの真横にあり、誤タップで14項目の入力が全消去される。
- **修正**: 送信ボタンの直前に「個人情報の取り扱いに同意する」チェック（必須）とポリシーへのリンクを配置。ポリシーはスクロール枠をやめて全文表示または別ページ化。リセットボタンは削除する。

### 🟡 中 トライアル6コースの唯一のCTAが全コースの後ろに1組だけ

- **箇所**: `trial/index.html`:645 ／ 工数 M
- **証拠**: trial/index.html は #A フェイシャル(272行)／#B シミ・美白(334)／#C 水素導入(396)／#D ボディ(458)／#E グラマラスボディ(519)／#F モホロジー(581) の6コースを各60行前後で掲載。CTAは全6コースを通過した645・648行に「無料カウンセリングを申し込む」「このトライアルを申し込む」の2本があるのみ（sp/trial も392・395で同構造）。トップページ index.html:323-388 はこの各アンカー(#A〜#F)へ直接リンクしている。さらに334行の `<span id="B">` と341行の `<div id="B">` でid重複がある。
- **影響**: トップから #A（フェイシャル）で着地した人は、興味の無い5コース分をスクロールしないと申込ボタンに到達できない。到達しても「このトライアル」が何を指すのか文脈上不明で、遷移先のフォームにもコースは引き継がれない（14項目を自分で選び直す必要がある）。サイト唯一の予約導線がこの位置にあるため、予約数への影響が最も大きい。
- **修正**: 各コースブロックの末尾に「このコースを予約する」ボタンを個別配置し、`reservation.html?course=フェイシャル` のようにフォームへ引き継いでチェック済み状態で表示する。重複idも修正。

### 🟡 中 PC版全ページに viewport meta が無く、UA判定リダイレクトがbody末尾に置かれている

- **箇所**: `index.html` ／ 工数 M
- **証拠**: grep -c "viewport" を index.html / trial/index.html / course_plan/index.html / campaign/index.html / shopinfo/index.html / singlefolder/reservation.html に実行した結果は全て0。SP版（sp/index.html:9 等）には width=device-width が入っている。またSPへの振り分けは index.html:674-682 の <script> で navigator.userAgent の iPhone / iPod / Android 判定によって location.href を書き換える方式で、これが </body>（685行）直前に置かれている。iPad は 676行で明示的に除外されている。
- **影響**: （反証担当が追加検出）
- **修正**: (1) UA判定リダイレクトを <head> 内に移し、PC版の全画像を読み込んでからSPへ飛ぶ現状の無駄を解消する。(2) PC版にも <meta name="viewport"> を追加し、iPad・その他タブレット・UA偽装端末がPC版に留まった場合でも読める状態にする。(3) 中長期的には別URL2系統をやめてレスポンシブへ統合する。

### 🟡 中 フッターのInstagram/Facebookアイコンがリンクの無い <i> タグで、タップしても何も起きない

- **箇所**: `index.html` ／ 工数 M
- **証拠**: index.html:577-580 は <table><tr><td class="t_l2"><i class="fab fa-instagram"></i></td><td class="t_r2"><i class="fab fa-facebook-square"></i></td></tr></table> で、<a> で包まれていない。sp/index.html:338-341 も同一。Instagram は index.html:532 と sp/index.html:301 のバナー（https://www.instagram.com/louise.rever_wakayama/）で別途リンクされているが、Facebook のURLは grep -rn "facebook.com" --include="*.html" で全31ファイル0件、どこからも遷移できない。
- **影響**: （反証担当が追加検出）
- **修正**: Instagramアイコンを既存の https://www.instagram.com/louise.rever_wakayama/ へリンクし、Facebookは実アカウントURLを設定するか、無いならアイコン自体を削除する。エステサロンではInstagramが施術写真の確認＝来店判断の場になるため、フッターからの導線は残す価値がある。

### 🟡 中 予約フォーム送信でサーバ応答が想定外だった場合、画面が「入力情報を送信しています。」のまま無反応になる

- **箇所**: `cgiFolder/tieredworks_ajax.js` ／ 工数 M
- **証拠**: cgiFolder/tieredworks_ajax.js:341-344 の TW_send が TWconfirmArea.innerHTML="入力情報を送信しています。" を表示し、348-359行の TW_compMail は res.indexOf('success admin_send mail') と res.indexOf('error admin_send mail') の2分岐しか持たない。通信断・PHPエラー・タイムアウトなどでレスポンスにこの文字列が含まれない場合、どちらの分岐にも入らず画面は「入力情報を送信しています。」のまま固定される。329行で TWform.style.display='none' 済みのためフォームに戻ることもできず、再入力するにはページ再読込で14項目を最初から打ち直すしかない。
- **影響**: （反証担当が追加検出）
- **修正**: TW_compMail に else 分岐を追加し、想定外レスポンス時は「送信できませんでした。お手数ですがお電話（073-482-3765）でご予約ください。」と tel: リンク付きで表示したうえで TWform.style.display を戻す。conv-11のサンクスページ化と同時に実装する。

### ⚪ 軽 スタッフ紹介12ページの title / description が空

- **箇所**: `singlefolder/staff_1.html` ／ 工数 M
- **証拠**: singlefolder/staff_1.html:8, staff_3.html:8, staff_3_1.html:8, staff_4.html:8, staff_5.html:8, staff_6.html:8 および sp/singlefolder/staff_*.html:5 の計12ファイルが <title></title>。grep -rn "<title>" の結果、空タイトルは reservation.html（PC/SP）とこの12ファイルの計14ファイルで、それ以外の下層ページ（faq, trial, campaign, course_plan, how_to_choose, shopinfo, beginner）は全て埋まっている。なお beginner/index.html:358-394 からリンクされているため到達自体は可能。
- **影響**: （反証担当が追加検出）
- **修正**: <title>スタッフ紹介｜{担当名}｜海南市のエステサロン LOUISE REVER</title> のように施術者名と得意分野を入れる。エステでは「誰が施術するか」が指名検索・来店判断に効くため、6名分のタイトルを個別に設定する。


## SEO・ローカルSEO・計測（21件）

### 🔴 致命 電話番号が2ページのみ・tel:リンクが全サイトで0件

- **箇所**: `index.html`:562 ／ 工数 S
- **証拠**: 073-482-3765 の出現箇所は index.html:562、shopinfo/index.html:9(meta description)と:226、sp/index.html:323、sp/shopinfo/index.html:6と:128、cgiFolder/core_rss_feed.html のみ。beginner / trial / course_plan / how_to_choose / faq / campaign / staff全6ページ / reservation.html の計12ページには電話番号が一切存在しない。grep -rn 'tel:' --include='*.html' が0件で、SP版15ページを含め電話番号がタップ発信リンクになっている箇所はゼロ（index.html:562 は <td class="t_r_tel">073-482-3765</td> という素のテキスト）。フッター（course_plan/index.html:526-531）は著作権表記のみでNAPが無い。
- **影響**: 主要KPIである電話問い合わせの導線が事実上機能していない。スマホユーザーは番号をタップしても発信できず、手動で番号を控えて発信し直す必要があり大半が離脱する。またローカルSEO上、NAP（店名・住所・電話）が全ページのフッターに一貫して出ていないとGoogleが事業所情報の一貫性を評価できず、GBPとの紐付けが弱まる。トライアル・キャンペーンという最も予約意欲の高いページに電話番号が無いのは機会損失が大きい。
- **修正**: 共通フッターに NAP ブロック（Louise Rever（ルイーズレヴェ）／〒642-0002 和歌山県海南市日方1500-1-44 グランドハイツ日方1F／073-482-3765／10:00〜（予約制）／定休 月曜・第1第3日曜）を全30ページに設置し、電話番号は <a href="tel:0734823765"> でリンク化。SP版はさらに画面下部固定の電話/LINE/予約の3ボタンバーを設置。表記はGBPの登録内容と1文字単位で一致させる。

### 🟠 重大 構造化データ(JSON-LD)が全ページでゼロ

- **箇所**: `index.html`:8 ／ 工数 M
- **証拠**: grep -rn -iE 'application/ld+json|itemtype|schema.org|itemprop' --include='*.html' の結果が0件。PC15ページ/SP15ページの全30ファイルで LocalBusiness / BeautySalon / Service / FAQPage / BreadcrumbList / Person いずれも未実装。shopinfo/index.html:213-262 に店名・住所・TEL・営業時間・定休日がHTML tableでベタ書きされているだけで機械可読ではない。
- **影響**: 「海南市 エステ」「和歌山 ブライダルエステ」等のローカル検索でナレッジパネル・リッチリザルト（営業時間/電話/FAQアコーディオン）が一切表示されない。検索結果の占有面積とCTRで競合に負け、来店予約数に直結する損失。GBPとサイトの実体紐付け(sameAs)もできない。
- **修正**: index.html と shopinfo/index.html の head 末尾に BeautySalon(LocalBusiness継承) の JSON-LD を追加。name: Louise Rever（ルイーズレヴェ）、address: 〒642-0002 和歌山県海南市日方1500-1-44 グランドハイツ日方1F、telephone: +81-73-482-3765、openingHoursSpecification（月曜・第1第3日曜休を反映）、geo は shopinfo/index.html:290 のGoogle Maps埋め込みから緯度34.15657/経度135.21273 を利用、sameAs に Instagram(index.html:532) と LINE公式アカウントURL、hasMap に GBP の URL。course_plan には Service/OfferCatalog、faq には FAQPage、全ページに BreadcrumbList、staff_*.html に Person を追加。

### 🟠 重大 GA4・Search Console・GTMが未導入（独自解析のみ）

- **箇所**: `index.html`:199 ／ 工数 M
- **証拠**: index.html:199 で ./cgiFolder/analysis/admin/js/ana.js を読み込み、index.html:665 で ana.exec('./cgiFolder/analysis/admin/index.php','Louise Rever','D000000500','HOME','G000000001',...) を実行、index.html:666 で 1x1 の img ビーコンを挿入しているのみ。grep -rn -iE 'googletagmanager|google-analytics|gtag|UA-[0-9]|G-[A-Z0-9]{10}' --include='*.html' --include='*.js' が0件。オリジン本番 https://www.louiserever.com/index.html を curl した結果も同パターンで0件。
- **影響**: TieredWorks CMS付属の独自PVカウンタはページ別PVしか取れず、流入キーワード・参照元・デバイス別行動・コンバージョン（予約フォーム送信・電話タップ・LINE友だち追加）が一切計測できない。どのページが予約を生んでいるか不明なまま改善判断ができず、施策の費用対効果を検証する術がない。Search Console未接続のためインデックス状況・検索クエリ・モバイルユーザビリティ問題も把握できない。
- **修正**: GA4 を全30ページの head に設置（TieredWorksのテンプレート共通部で一括挿入）。イベントとして reservation_submit（singlefolder/reservation.html の送信）、tel_click、line_click（line.me リンク16箇所）、instagram_click を設定。Search Console を www プロパティとドメインプロパティ両方で登録し、sitemap を送信。将来的にGTMを入れてタグ管理を一元化。

### 🟠 重大 staff6ページ+予約フォームのtitle/descriptionが空文字

- **箇所**: `singlefolder/staff_1.html`:8 ／ 工数 S
- **証拠**: singlefolder/staff_1.html:8 が <title></title>、:9 が meta description content=""、:10 が meta keywords content=""。staff_3 / staff_3_1 / staff_4 / staff_5 / staff_6 / reservation.html も同一（各ファイル8-10行目）。SP版 sp/singlefolder/*.html 7ファイル（5-7行目）も同様に空。合計14ページがタイトル無し。ただし各ページには h1（例 singlefolder/staff_1.html:160）とスタッフ名（ana.exec の引数に「後垣内 千穂」等が入っている: sp/singlefolder/staff_1.html:162）が存在する。
- **影響**: 検索結果でタイトルがURLや本文断片から自動生成され、指名検索やスタッフ名検索でクリックされない。予約フォーム reservation.html もタイトル無しのため、ブラウザタブ・ブックマーク・検索結果で識別不能。エステは施術者指名の意思決定要素が大きく、スタッフページはブライダル・脱毛の指名予約に効くはずの資産が完全に死んでいる。
- **修正**: 各staffページに『後垣内 千穂｜エステティシャン紹介｜海南市のエステサロン Louise Rever』形式のtitleと、保有資格・得意施術を含む80-120字のdescriptionを設定。reservation.html は『ご予約・無料カウンセリング申込｜和歌山県海南市のエステサロン Louise Rever』とし、フォームページのため noindex ではなく index のままCV導線として活用。

### 🟠 重大 FAQページの4カテゴリ全てが同一の1問1答

- **箇所**: `faq/index.html`:274 ／ 工数 M
- **証拠**: faq/index.html は h3 で「施術について ABOUT TREATMENT」(270行)「料金について ABOUT PRICE」(290行)「その他 OTHER」(310行)「ブライダルエステについて ABOUT BRIDAL COURSE」(330行) の4カテゴリを設けているが、Q欄(class=q_r)は274/294/314/334行の全4箇所とも『エステティックは初めてなので、何かと心配な私でも大丈夫？』で完全に同一。A欄も4箇所すべて『ご安心ください。ルイーズレヴェでは事前に丁寧なカウンセリングを行い…』で同一。sp/faq/index.html も同じ8箇所が同一内容。faq/index.html:265 にはカテゴリへのアンカーリンク（#A1〜#A4）が用意されているのに中身が無い。
- **影響**: 料金・ブライダルという最も検索需要と不安の大きいテーマの質問に一切答えていない。ユーザーは疑問が解消されないまま離脱し、電話で同じ質問をするか他店を探す。SEO面では FAQPage 構造化データを入れてもコンテンツが1問しかないためリッチリザルトの価値が出ず、「エステ 痛い」「ブライダルエステ いつから」等のロングテール検索流入を全て逃している。カテゴリ見出しだけあって中身が同一というのは、閲覧者に手抜きサイトという印象を与え信頼性を毀損する。
- **修正**: 4カテゴリ各3-6問を実際の問い合わせ内容から作成（料金: 追加料金の有無/支払い方法/コース途中解約、ブライダル: 挙式何ヶ月前から/背中ニキビ/当日ケア、施術: 痛み/生理中/所要時間、その他: 駐車場/子連れ/男性同伴）。その上で faq/index.html に FAQPage JSON-LD を実装。

### 🟠 重大 PC版15ページ全てに viewport メタタグが無く、タブレット・大画面スマホがPC版を拡大不能で見せられる

- **箇所**: `index.html` ／ 工数 M
- **証拠**: index.html の head（1-12行目）に <meta name="viewport"> が存在しない。PC版10ファイルで grep -c viewport を実行した結果、index.html / beginner/index.html / trial/index.html / course_plan/index.html / how_to_choose/index.html / faq/index.html / campaign/index.html / shopinfo/index.html / singlefolder/staff_1.html / singlefolder/reservation.html すべて 0件（SP版は sp/index.html:9 に width=device-width, initial-scale=1.0 がある）。一方 index.html:672-679 のUA判定JSはリダイレクト対象を iPhone(iPad除外)・iPod・Android のみに限定しており、iPad はPC版に残る。index.html:11 の alternate も media="only screen and (max-width: 640px)" なので641px以上の端末はPC版が正となる。結果、iPad・大型Androidタブレットのユーザーは viewport 宣言の無い固定幅レイアウトを縮小表示で見せられ、電話番号(index.html:562)やLINE予約ボタン(index.html:212)がタップ困難になる。
- **影響**: （反証担当が追加検出）
- **修正**: PC版全15ページの head に <meta name="viewport" content="width=device-width, initial-scale=1.0"> を追加（TieredWorksの共通テンプレートで一括）。ただし現状のPC版CSSは固定幅前提のため、viewport追加だけでは横スクロールが出る。暫定策としてはUA判定のリダイレクト条件に iPad / Tablet を含めてSP版へ寄せ、恒久策はPC版のレスポンシブ化（SP版廃止と単一URL統合）とする。

### 🟠 重大 予約フォーム reservation.html への内部リンクが trial ページの2箇所のみで、ナビ・フッター・トップから到達できない

- **箇所**: `index.html` ／ 工数 M
- **証拠**: PC版で reservation.html を href に持つのは trial/index.html:645（無料カウンセリングを申し込む）と :648（このトライアルを申し込む）の2箇所のみ。index.html:216-236 のグローバルナビは HOME / 初めての方へ / トライアル / コース・プランのご案内 / コース・プランの選び方 / よくある質問 / キャンペーン / 店舗のご案内 の8項目で予約フォームを含まず、course_plan/index.html:526-531 のフッターも著作権表記と PAGE TOP のみ。トップの「ご予約はこちら」ボタン index.html:212 と バナー :282 はいずれも https://line.me/R/ti/p/%40pnb6242x（LINE友だち追加）へ飛ぶ。course_plan / how_to_choose / campaign / shopinfo / faq / beginner / staff6ページ からは予約フォームへの導線がゼロ。
- **影響**: （反証担当が追加検出）
- **修正**: グローバルナビ（index.html:216-236 のTieredWorks共通ブロック）に「ご予約・無料カウンセリング」を追加し reservation.html を指す。あわせて共通フッターに 電話（tel:0734823765）／LINE／予約フォーム の3導線を全30ページに設置し、course_plan・campaign・how_to_choose の各メニュー末尾にも予約CTAを置く。LINEに一本化せず、フォーム／電話の選択肢を常時提示すること。

### 🟡 中 canonical/alternateの全URLが2ホップ301先を指す

- **箇所**: `sp/index.html`:13 ／ 工数 M
- **証拠**: sp/index.html:13 の canonical は https://www.louiserever.com/index.html だが、curl 実測で www/index.html → 301 → https://louiserever.com/ → 301 → https://www.louiserever.com/ (200) の2ホップ。index.html:11 の alternate (https://www.louiserever.com/sp/index.html) も 301 → https://louiserever.com/sp/ → 301 → https://www.louiserever.com/sp/。shopinfo/index.html:11 も同様。HTML内で宣言している30本のcanonical/alternate URLが全て実在しない(リダイレクトされる)URLを指している。
- **影響**: canonicalは200を返す最終URLを指す必要があるため、Googleは宣言を無視し独自にcanonicalを選択する。PC/SPのペアリング宣言（rel=alternate ⇔ rel=canonical）が成立せず、PC版とSP版が別ページとして評価分散する。www↔非wwwを往復する構成のため正規化シグナルが不安定になり、インデックスされるURLが安定しない。
- **修正**: サーバ側の301ルールを『非www → www』の1方向に統一し、/index.html の除去も同一ホスト内で完結させる（www/index.html → www/ の1ホップ）。その上でHTML内の全canonical/alternateを最終200URL（例 https://www.louiserever.com/ 、https://www.louiserever.com/sp/ 、https://www.louiserever.com/shopinfo/ ）に書き換える。

### 🟡 中 PC版15ページ全てに canonical が無い

- **箇所**: `index.html`:11 ／ 工数 S
- **証拠**: grep -rl 'rel="canonical"' --include='*.html' の結果が sp/ 配下15ファイルのみ。PC版の index.html / beginner / trial / course_plan / how_to_choose / faq / campaign / shopinfo / singlefolder配下7ファイルには canonical が1本も無い。index.html:11 にあるのは alternate のみ。
- **影響**: PC版は index.html 付きURL・ディレクトリURL・www/非wwwの4通りでアクセス可能な状態（curl 実測で全パターンが200または301で到達）にあり、自己参照canonicalが無いため重複URLが生成されうる。SP版は canonical でPC版を指しているのに、その指し先のPC版が自らの正規URLを宣言していないため、PC/SP分離構成として最も重要な『どのURLが正か』のシグナルが片側だけ欠けている。
- **修正**: PC版全15ページに自己参照canonicalを追加。ただし seo-02 のリダイレクト整理を先に行い、最終200URL（https://www.louiserever.com/ 、https://www.louiserever.com/shopinfo/ 等）を指すこと。SP側 canonical もそれに合わせて更新する。

### 🟡 中 h1が全15ページ同一、ページ主題がh4に降格

- **箇所**: `index.html`:208 ／ 工数 M
- **証拠**: index.html:208 が <h1 id="Header-title"><a href="./index.html">フェイシャルエステ・ブライダルエステが人気の海南市のエステサロン【LOUISE REVER】</a></h1>。同一文言が course_plan/index.html:157、faq/index.html:203、shopinfo/index.html:136、singlefolder/staff_1.html:160 など全15ページのヘッダーに固定で入っている。一方でページ本来の主題は h4 扱い（course_plan/index.html:206 が h4 で「コース・プランのご案内」、faq/index.html:252 が h4 で「よくある質問」、shopinfo/index.html:185 が h4 で「店舗のご案内」、index.html:298 が h4）。
- **影響**: h1が全ページ同一のためGoogleが各ページのトピックを判別できず、「コース 料金」「店舗 アクセス」等のクエリでどのページを出すべきか判断が付かない。逆に h1 に固定文言があることで全ページが同一トピックとみなされ、内部でカニバリを起こす。ページ主題が h4 なのは見出し階層としても評価されない。
- **修正**: ヘッダーのサイト名 h1 を p または div（またはトップのみ h1）に変更し、各ページの主題見出しを h1 に昇格させる。例: course_plan は h1「コース・プランのご案内｜海南市のエステサロン Louise Rever」、shopinfo は h1「店舗案内・アクセス｜和歌山県海南市のエステサロン Louise Rever」。TieredWorks の共通ヘッダーテンプレート側の修正で全ページ一括対応。

### 🟡 中 OGP・Twitter Cardが全ページ皆無

- **箇所**: `index.html`:8 ／ 工数 S
- **証拠**: grep -rn -iE 'og:|twitter:card|fb:app' --include='*.html' の結果が0件。PC/SP全30ファイルで og:title / og:description / og:image / og:url / og:type / twitter:card が一切未設定。一方でサイトは Instagram（index.html:532 の https://www.instagram.com/louise.rever_wakayama/ ）と LINE公式アカウント（index.html:209付近ほか16ファイルの line.me リンク）を主要導線としている。
- **影響**: LINEでURLを共有した際にサムネイル・説明文が出ず、テキストURLだけの味気ない見た目になる。Instagramのプロフィールリンク経由の流入、既存顧客が友人に紹介する際のLINE転送、Facebookでの共有すべてで訴求力が落ちる。エステは口コミ・紹介が主要な集客経路であり、共有時の見栄えは直接予約数に効く。og:imageが無い場合、SNS側がページ内から適当な画像（例 assets/arrow.png のような装飾画像）を拾うか無画像になる。
- **修正**: 全ページに og:type / og:title / og:description / og:url / og:site_name / og:locale=ja_JP と twitter:card=summary_large_image を設定。og:image はページ別に用意（トップは assets/top_image.jpg、コースは assets/course_plan_image.jpg 等、1200x630相当を新規作成推奨）。LINEはOGPを参照するため優先度が高い。

### 🟡 中 全titleに「和歌山」ゼロ、ブライダル・脱毛も未使用

- **箇所**: `index.html`:8 ／ 工数 M
- **証拠**: 全titleを抽出した結果、「和歌山」を含むtitleは0件（grep '<title>' | grep 和歌山 が0）。各title: index『海南市で人気のエステサロン【LOUISE REVER】』(27字)、beginner『初めての方へ｜海南市で人気のエステサロン【LOUISE REVER】』(34字)、trial『初めて当店のエステをご検討のお客様へ｜【LOUISE REVER】』(33字、業種語も地名も無し)、course_plan『コース・プランのご案内｜エステサロン【LOUISE REVER】』(32字)、how_to_choose(32字)、faq(27字)、campaign(30字)、shopinfo『店舗案内｜エステサロン【LOUISE REVER】』(25字)。「ブライダル」「脱毛」を含むtitleも0件。descriptionは74字(how_to_choose)〜163字(shopinfo)とばらつき、shopinfo:9 は本文の店舗情報をタブ文字ごとそのまま貼り付けた状態。
- **影響**: 「和歌山 エステ」「和歌山 ブライダルエステ」「海南市 脱毛」といった実需のあるローカルクエリでtitle内キーワード一致が取れず順位が伸びない。特にブライダルエステは客単価が高くFAQにカテゴリまで用意している主力メニューなのに、専用ページもtitle内キーワードも無い。trial のtitleは業種語も地名も含まず、検索結果で何の店か分からない。
- **修正**: title を『主題｜サービス+地域｜店名』形式に統一（例 index『和歌山県海南市のエステサロン｜フェイシャル・痩身・脱毛・ブライダルエステ｜Louise Rever』、trial『エステ体験トライアルコース｜和歌山県海南市のエステサロン Louise Rever』、shopinfo『店舗案内・アクセス｜海南駅徒歩2分のエステサロン Louise Rever』）。descriptionは全ページ80-120字に整え、shopinfo:9 のタブ混じり貼り付けを自然文に書き直す。あわせてブライダルエステ専用ページの新設を推奨。

### 🟡 中 how_to_choose の見出し階層が逆転（h2=詳しく見る▼）

- **箇所**: `how_to_choose/index.html`:234 ／ 工数 S
- **証拠**: how_to_choose/index.html:225 で悩みキーワード『くすみ・しみ・美白』が h4、その9行下の :234 で開閉ボタンのラベル『詳しく見る▼』が <h2 class="headlineStyle"><span class="csOpenClose">詳しく見る▼</span></h2> になっている。同ファイルで h2『詳しく見る▼』は 234/276/318/361/401/444/494/529/563/598/632/666 の12箇所すべて同一文言。SP版 sp/how_to_choose/index.html では h2 が『おすすめメニュー▼』12箇所（107/132/157/181/204/230/257/275/292/308/325/342行）。悩み名（しわ＆たるみ、にきび、部分痩せしたい、メリハリのあるボディを 等）は h4/h3 に埋もれている。
- **影響**: 悩み別検索（『しみ 美白 エステ 和歌山』『部分痩せ 海南市』）は購買意図が最も強い流入源だが、そのキーワードが最下位の見出しレベルに置かれ、代わりに検索価値ゼロのUI文言が12回 h2 として繰り返されている。Googleの見出し解析上、このページの主要トピックが『詳しく見る』と誤認されるレベルの構造。
- **修正**: 『詳しく見る▼』『おすすめメニュー▼』を button または span に変更（開閉JSは csOpenClose クラスで動いているのでタグ変更は容易）。悩み名を h2 に昇格させ、各悩みブロックを h2『くすみ・しみ・美白の改善｜和歌山県海南市のエステ』のように地域+悩みで構成。PC/SPともに修正。

### 🟡 中 UA判定JSリダイレクトとVary未設定の組合せ

- **箇所**: `index.html`:678 ／ 工数 M
- **証拠**: index.html:672-678 の body 末尾に、Cookie tw_redirect=false が無く UA に iPhone/iPod/Android が含まれる場合 location.href = 'https://www.louiserever.com/sp/index.html' へ飛ばす JavaScript がある。同様のブロックが faq/index.html:461、singlefolder/staff_5.html:332、singlefolder/reservation.html:624 などPC版全15ページに存在。一方 curl -I https://www.louiserever.com/ のレスポンスヘッダは server/date/content-type/content-length/last-modified/etag/accept-ranges のみで Vary: User-Agent が無い。alternate のメディアクエリは max-width:640px（index.html:11）。
- **影響**: Googlebot Smartphone の UA には Android が含まれるため、PC版URLをクロールするとSP版へリダイレクトされ、そのSP版は canonical でPC版へ戻す、という循環シグナルになる。Vary: User-Agent が無いためCDN/プロキシがPC版HTMLをスマホユーザーに配信したりその逆が起きうる。ユーザー体験面でも、リダイレクトがbody末尾のJSのため、スマホユーザーはPC版が一瞬描画されてから飛ばされ、体感速度と信頼性が落ちる。max-width:640px の指定はタブレットや一部大型端末を対象外にしており、その層はPC版を見せられる。
- **修正**: 最終的にはレスポンシブ統合（seo-08）でリダイレクト自体を廃止するのが正解。統合までの暫定策として、UA判定をサーバ側の302に移し Vary: User-Agent ヘッダを付与、かつリダイレクト先を対応する個別ページに正しくマッピングする。JSリダイレクトを残す場合も head 内の早期実行に移す。

### 🟡 中 画像altの欠落・空白が大量（how_to_chooseは31枚中28枚）

- **箇所**: `how_to_choose/index.html`:227 ／ 工数 M
- **証拠**: ページ別の img 総数 / alt="" / alt属性なし の実測: how_to_choose 31/28/2（:227 の <img width="200" src="../assets/how_to_choose_item_1.png" alt=""/> など悩み別カテゴリ画像がすべて空alt）、index.html 32/14/11（:243-245 のメインスライダー top_image.jpg・top_imagi02.jpg・top_imagi03.jpg、:317-382 のコースサムネイル top_course1〜6.png、:532 のInstagramバナーが全て alt=""、:209 のロゴ logo.png は alt属性自体が無い）、singlefolder/reservation.html 38/1/36、beginner 22/12/2、shopinfo 12/8/3（:201-206 の店内ギャラリー6枚が全て alt=""）。alt が入っている数少ない例は index.html:211 の alt="ご予約はこちら"。
- **影響**: エステは施術内容・店内の雰囲気・ビフォーアフターを画像で伝える業種であり、画像検索とGoogle画像パックからの流入を丸ごと失っている。特に店内ギャラリー6枚とコースサムネイル6枚に説明が無いのは、指名検索以外の発見経路を潰している。ロゴにaltが無いためブランド名がテキストとして認識されず、スクリーンリーダー利用者にも店名が伝わらない。
- **修正**: 意味のある画像に具体的なaltを付与（logo.png→『Louise Rever（ルイーズレヴェ）和歌山県海南市のエステサロン』、how_to_choose_item_1.png→『くすみ・しみ・美白のお悩み向けエステメニュー』、shop_ga01.jpg→『Louise Rever 店内 施術ルーム』、top_course1.png→『フェイシャルトリートメントコース』）。arrow.png（index.html:323ほか9箇所）や Spry_required.gif のような純装飾・UI画像は alt="" のままで正しいので区別して対応。

### 🟡 中 営業時間が終了時刻なし・NAP表記がGBP連携不能

- **箇所**: `shopinfo/index.html`:231 ／ 工数 S
- **証拠**: shopinfo/index.html:230-231 が <td>Open</td><td>10:00〜※予約制</td> で終了時刻の記載が無い。:234-235 の Holiday は『月曜日・第１第３日曜日』で全角数字と漢数字が混在。:220 の住所は『〒642-0002　和歌山県海南市日方1500-1-44　 グランドハイツ日方1F』（全角スペース＋半角スペースの連続）に対し index.html:557 では『〒642-0002<br />和歌山県海南市日方1500-1-44<br />グランドハイツ日方1F』と改行で分断され表記が一致しない。shopinfo/index.html:249 には運営元住所『和歌山県海南市日方1271-99-2F』と別電話 073-494-3227（:253）が併記されており、店舗住所と混在している。GBPへのリンク・埋め込みレビューは grep で確認できず、shopinfo/index.html:290 のGoogle Maps iframe のみ。
- **影響**: Googleビジネスプロフィールとサイトの NAP が文字レベルで一致しないとローカル検索での信頼シグナルが弱まる。営業終了時刻が不明なため、ユーザーは何時までに行けばよいか分からず電話で確認するか諦める。同一ページ内に店舗TELと運営元TELの2つの電話番号があるため、Googleがどちらを事業所電話と判定するか不安定になり、誤った番号がナレッジパネルに出るリスクがある。GBPへの導線が無いため口コミ投稿も促せない。
- **修正**: 営業時間を『10:00〜19:00（最終受付18:00）※完全予約制』のように明記し、GBPの登録内容と完全一致させる。住所表記を全ページで1文字単位に統一（全角スペースの重複を除去）。運営元情報は会社概要ページまたは別セクションに分離し、店舗NAPと視覚的・構造的に切り離す。shopinfo に GBP のレビュー導線（口コミを見る/書くリンク）を追加し、seo-01 の LocalBusiness JSON-LD の telephone は店舗番号 073-482-3765 のみを記載する。

### 🟡 中 FAQのカテゴリ内リンク #A1〜#A4 にジャンプ先が存在せず4本とも機能していない

- **箇所**: `faq/index.html` ／ 工数 M
- **証拠**: faq/index.html:265 に <a href="#A1">施術について</a> / <a href="#A2">料金について</a> / <a href="#A3">その他</a> / <a href="#A4">ブライダルエステについて</a> の4つのカテゴリボタンがあるが、同ファイルを grep 'id="A' で検索してヒットするのは :444 の id="ADDBGBOTTOM" のみで、id="A1"〜"A4" も name="A1"〜"A4" も存在しない。同種のページ内アンカーが正しく実装されている例は trial/index.html:272 の <span id="A" name="A">&nbsp;</span> で、FAQだけ受け側が欠落している。SP版 sp/faq/index.html にも同じカテゴリボタンがある。
- **影響**: （反証担当が追加検出）
- **修正**: faq/index.html の各カテゴリ h3（:270 施術について、:290 料金について、:310 その他、:330 ブライダルエステについて）の直前に <span id="A1" name="A1"></span> 〜 <span id="A4" name="A4"></span> を挿入する。trial/index.html:272 と同じ書式でよい。SP版も同様に修正。

### 🟡 中 予約フォームの送信が JavaScript の action に依存しており、JS無効・クロール時に完全に無反応

- **箇所**: `singlefolder/reservation.html` ／ 工数 M
- **証拠**: singlefolder/reservation.html:181 が <form id="SF-contact" name="SF-contact" action="javascript:TW_confirm('../cgiFolder/mail_send.php')">。action属性がURLではなく javascript: スキームのため、フォームのPOST先が静的に解析できず、JSが無効・エラーの環境では :502 の <input type="submit" value="入力内容確認"> を押しても何も起きない。バリデーションも Spry（:459 の Spry_valid.gif / Spry_required.gif）という保守終了ライブラリに依存している。さらにこのページは title / description が空（:8-9、seo-06参照）で、UA判定JSリダイレクト（:624）も抱えている。
- **影響**: （反証担当が追加検出）
- **修正**: form の action を実URL（../cgiFolder/mail_send.php）＋ method="post" に書き換え、JSは確認画面の上乗せとして扱う（プログレッシブエンハンスメント）。Spry依存のバリデーションはHTML5の required / type="tel" / type="email" に置き換える。送信完了ページを別URLで用意し、GA4のコンバージョン計測（seo-03）の到達点にする。

### ⚪ 軽 sitemap.xml と robots.txt がどちらも404

- **箇所**: `index.html` ／ 工数 S
- **証拠**: ローカルコピー直下に sitemap.xml / robots.txt は存在せず（find でヒット0）。オリジンでも curl https://www.louiserever.com/sitemap.xml → HTTP 404、https://www.louiserever.com/robots.txt → HTTP 404（Apache標準の 404 Not Found HTMLが返る）。サイト内にパンくずも無く（grep breadcrumb/パンくず が0件）、staff_*.html 6ページと reservation.html への内部リンクは beginner/index.html からの画像リンクのみ。
- **影響**: クロール経路が内部リンクだけに依存し、タイトル空のstaffページ・予約フォームなど下層ページの発見・再クロールが遅れる。robots.txt が無いため cgiFolder/ の管理系パスやSP版の重複URLに対するクロール制御ができず、限られたクロールバジェットが浪費される。Search Console でのインデックス状況の把握・是正も困難。
- **修正**: PC版15URL + SP版15URLを列挙した sitemap.xml をルートに設置（lastmod付き、PC/SPは Google推奨の sitemap 内 xhtml:link での対応付け、または少なくともPC版のみ列挙）。robots.txt に User-agent: * / Allow: / と Sitemap: https://www.louiserever.com/sitemap.xml を記載し、cgiFolder/analysis/admin/ を Disallow。Search Console から送信。

### ⚪ 軽 パンくずリストが全ページに存在しない

- **箇所**: `index.html`:205 ／ 工数 S
- **証拠**: grep -rn -iE 'breadcrumb|パンくず|topicpath|pankuzu' --include='*.html' --include='*.css' の結果が0件。index.html:205-211 のヘッダーはサイト名h1とロゴのみで階層表示が無く、course_plan/index.html:526-531 のフッターも著作権表記とPAGE TOPリンクのみ。BreadcrumbList の構造化データも当然無い（seo-01）。staff_*.html や reservation.html には上位ページへの導線が乏しい。
- **影響**: 検索結果のURL表示部にパンくずが出ず、階層構造が伝わらないためCTRが下がる。ユーザーが下層ページ（staffページ・予約フォーム）に直接着地した際、コース一覧や店舗情報へ戻る手段が無く離脱する。サイト構造がGoogleに伝わらず、コース関連ページ群のトピック的まとまり（トピッククラスタ）も評価されない。
- **修正**: 全ページのコンテンツ最上部に『ホーム > コース・プランのご案内』形式のパンくずを設置し、同時に BreadcrumbList の JSON-LD を出力。TieredWorks の共通テンプレートで階層を持たせるのが難しい場合、各ページに静的HTMLで記述するだけでも効果がある。

### ⚪ 軽 meta keywords が全30ページに残存（半数は空）

- **箇所**: `index.html`:10 ／ 工数 S
- **証拠**: index.html:10 に <meta name="keywords" content="和歌山県,海南市,エステサロン,フェイシャル,美白,痩身,脱毛" />。同一内容が beginner:10 / trial:10 / course_plan:11 とSP版4ファイルに存在。一方 campaign:10 / faq:10 / how_to_choose:10 / shopinfo:10 / staff全6ファイル:10 / reservation:10 は content="" の空タグ。全30ページに keywords タグが出力されている。あわせて index.html:1 は XHTML 1.0 Transitional DOCTYPE、index.html:5-6 に Content-Style-Type / Content-Script-Type、index.html:7 に generator=TieredWorks 1.4.1.3。
- **影響**: meta keywords は主要検索エンジンで10年以上前に評価対象外となっており、順位への影響は無い。ただし空タグ含め全ページに残っていることは保守放置の痕跡で、競合分析時に施策の古さが露見する。実害は軽微だが、keywords に列挙されている『和歌山県,海南市,ブライダル…』の語が肝心の title/h1/本文には反映されていない（seo-12）という不整合が、SEO設計が実質行われていないことを示している。
- **修正**: meta keywords を全30ページから削除。同時に keywords に書かれていた語（和歌山県・海南市・ブライダルエステ・脱毛）を title / h1 / 本文へ正しく配置し直す。あわせてSP版の sp/index.html:11 にある http:// html5shim.googlecode.com（既に廃止されたドメイン、混在コンテンツ）の script も削除する。


## 技術的負債・法務コンプライアンス（26件）

### 🔴 致命 電話番号が全ページで素のテキスト。tel: リンクがサイト全体で0件

- **箇所**: `sp/index.html` ／ 工数 M
- **証拠**: grep -rn 'tel:' で全HTML中0件（exit=1）。電話番号 073-482-3765 の記載は index.html:562 <td class="t_r_tel">073-482-3765</td>、sp/index.html:323 同上、shopinfo/index.html:226、sp/shopinfo/index.html:128 の4箇所のみで、いずれも <a href="tel:..."> でラップされていない。SP版（sp/ 配下15ページ、jQuery Mobile ベース）でもリンク化されておらず、スマートフォンで電話番号をタップしても発信できない。加えて電話番号はトップとshopinfoの2種のページにしか存在せず、beginner/trial/course_plan/how_to_choose/faq/campaign/staff_* には一切掲載がない。
- **影響**: （反証担当が追加検出）
- **修正**: 全ページ共通のフッターおよびSPのヘッダー固定領域に <a href="tel:0734823765">073-482-3765</a> を設置する。最低限、index.html:562・sp/index.html:323・shopinfo/index.html:226・sp/shopinfo/index.html:128 の4箇所を即座にtel:リンク化。SP版はjQuery Mobile の data-role="header" data-position="fixed"（sp/index.html:57 付近）に電話ボタンを追加すれば全ページで常時表示できる。

### 🔴 致命 トップページのCTAボタン「Contact」とバナー「はじめてのブライダルエステ」が href="#" の死んだリンク

- **箇所**: `index.html` ／ 工数 M
- **証拠**: grep -rn 'href="#"' の結果、index.html:585 <a href="#" target="_blank" class="button-rink2" style="color:#ffffff;">Contact</a>（フッター店舗情報ブロック内の唯一の問い合わせCTAボタン）、sp/index.html:346 に同一のものを確認。さらに index.html:281 <li class="SF-simpleImg"><a href="#"><img width="240" src="./assets/top_bana3.png" alt="はじめてのブライダルエステ"/></a></li>、sp/index.html:97 も同一で、トップページ上部4枚バナーのうち1枚（ブライダル導線）がどこにも遷移しない。他の3枚は campaign/index.html、https://louiserever.jp/blog/（curlで200を確認）、https://line.me/R/ti/p/%40pnb6242x（200を確認）へ正しくリンクしている。加えて index.html:579-580 / sp/index.html:340-341 の <i class="fab fa-instagram"></i> と <i class="fab fa-facebook-square"></i> はアイコン表示のみでリンクになっていない。
- **影響**: （反証担当が追加検出）
- **修正**: index.html:585 と sp/index.html:346 の Contact ボタンを ./singlefolder/reservation.html（SPは ./singlefolder/reservation.html）へ。index.html:281 と sp/index.html:97 のブライダルバナーを course_plan/index.html の BRIDAL Course セクション（course_plan/index.html:387 の id="B000000133"）へアンカーリンク。フッターのSNSアイコンは index.html:532 に既にある https://www.instagram.com/louise.rever_wakayama/ でラップし、Facebookアカウントが無いならアイコンごと削除する。

### 🟠 重大 FAQページ全4カテゴリがテンプレートのダミーQ&Aのまま公開

- **箇所**: `faq/index.html`:128 ／ 工数 M
- **証拠**: faq/index.html を本文抽出すると、104行「施術について」/124行「料金について」/144行「その他」/164行「ブライダルエステについて」の4カテゴリすべてに、108・128・148・168行と全く同一の質問「エステティックは初めてなので、何かと心配な私でも大丈夫？」＋同一回答「ご安心ください。ルイーズレヴェでは事前に丁寧なカウンセリングを行い…」が入っている。grep -c で faq/index.html・sp/faq/index.html ともに4回出現。
- **影響**: 「料金について」を開いても料金の答えが無く、「ブライダルエステについて」を開いてもブライダルの答えが無い。FAQは予約前の不安解消＝コンバージョン直結ページであり、未完成のまま公開されていることでサイト全体の信頼性が崩れる。同時に、キャンセル規定・解約条件・所要時間・支払方法といった特商法/消費者対応上も重要な情報を提供する唯一の受け皿が機能していない。
- **修正**: 実際に店舗へ寄せられる質問を各カテゴリ5〜8問ずつ作成。特にキャンセル規定（当日キャンセルの扱い）、支払方法、コースの中途解約、所要時間、生理中・妊娠中の可否、初回の持ち物を必ず含める。PC/SP両方に反映する。

### 🟠 重大 薬機法違反：疾病への効能効果を標榜

- **箇所**: `campaign/index.html`:232 ／ 工数 S
- **証拠**: campaign/index.html:232（およびSP版 sp/campaign/index.html:104 に一字一句同一）に「また、婦人科系疾患にお悩みの方やアレルギー・アトピーの方にも男女問わずオススメです。」と記載。直前231行「まだまだ冷えを感じる季節に内面から温め代謝UP！」も同ブロック。
- **影響**: 「婦人科系疾患」「アレルギー」「アトピー」は特定の疾病名であり、エステ役務・機器についてこれらへの効能効果を標榜することは医薬品医療機器等法66条（誇大広告）・68条（未承認医療機器の広告）に抵触。都道府県による指導、課徴金納付命令（対象売上の4.5%）のリスクがあり、SNS通報・炎上リスクも高い。予約導線の直前ページに掲載されており露出も大きい。
- **修正**: 当該一文を即時削除。疾病名・治療的表現を用いず「リラックスしたい方」「乾燥が気になる方」等の体感ベース表現に置換。あわせて薬機法NGワード辞書（疾患名／治療・改善・除去・再生／医療用語）を作り、公開前チェックを運用に組み込む。

### 🟠 重大 同一メニューの価格がページ間で不一致（旧税抜価格が残存）

- **箇所**: `how_to_choose/index.html`:506 ／ 工数 S
- **証拠**: how_to_choose/index.html:504-506「・ニキビ凹凸ケア（60分）10,000円／・シミ・美白ケア（90分）12,000円／・シワ・たるみ・ハリケア（90分）15,000円」。同じメニューが course_plan/index.html:345-359 では 11,000円／13,200円／16,500円。同様に 背中ニキビ集中ケア how_to_choose:540=3,000円 vs course_plan:273=3,300円、バックスリム how_to_choose:539=7,500円 vs course_plan:267=8,250円、グラマラス how_to_choose:678=18,000円 vs course_plan:255=19,800円、ベーシックモホロジー how_to_choose:677=23,000円 vs course_plan:237=25,300円、両ワキ脱毛 how_to_choose:608=￥2,000 vs course_plan:460=￥2,200。全て正確に1.1倍の関係で、how_to_choose 側が旧価格のまま。SP版 sp/how_to_choose/index.html:259-261 等も同じ旧価格。
- **影響**: 同一サイト内で同じ施術に2種類の価格が併記されている。安い方（how_to_choose）を見て来店した顧客が店頭で高い金額を請求されれば、景品表示法5条2号（有利誤認）に該当し得るうえ、その場でのクレーム・キャンセルが発生する。10%の乖離は客単価1万円超のエステでは無視できず、口コミ評価の毀損に直結する。
- **修正**: 価格をページに直書きするのをやめ、料金は course_plan/index.html の1箇所に集約。how_to_choose の価格列は削除して「料金はコース・プランのご案内をご覧ください」へリンクさせる。当面の応急処置として how_to_choose（PC/SP）の全価格を税込価格へ即時修正する。

### 🟠 重大 営業終了時刻が非公開（Open「10:00〜※予約制」）

- **箇所**: `shopinfo/index.html`:231 ／ 工数 S
- **証拠**: shopinfo/index.html:230-231 が <td class="t_l">Open</td><td class="t_r">10:00〜※予約制</td>。同ページの meta description（9行目）も「Open 10:00〜※予約制」。SP版 sp/shopinfo/index.html:133 も同一。一方 cgiFolder/core_rss_feed.html 内のブログ記事には「OPEN 10:00〜19:00」「AM10時〜PM19時まで」と繰り返し書かれており、予約フォーム（reservation.html:355-385）は10時〜20時の11枠を選択肢として提示している。
- **影響**: 店舗案内・ブログ・予約フォームで営業時間が3通り（終了時刻なし／19時／20時）に食い違っている。仕事帰りに通えるかを判断できず、19時以降の来店を検討する層が離脱する。20時枠を選んで送信した顧客に「その時間はやっていません」と返す運用は、電話対応の手間とキャンセルを生む。
- **修正**: 実際の営業時間（最終受付時刻を含む）を確定し、shopinfo（PC/SP）・meta description・予約フォームの時間選択肢を一致させる。GoogleビジネスプロフィールとLINEの表記も同時に揃える。

### 🟠 重大 予約フォームが送信先メールをクライアント側で渡し、CSRF/スパム対策ゼロ

- **箇所**: `singlefolder/reservation.html`:181 ／ 工数 M
- **証拠**: singlefolder/reservation.html:181 で form action="javascript:TW_confirm('../cgiFolder/mail_send.php')"。182-190行に site_name / admin_email / admin_reply_email / admin_mail_subject / auto_reply_mail_* が hidden で base64 埋め込み（admin_email の値 aW5mb0Bsb3Vpc2VyZXZlci5jb20= は info@louiserever.com とデコード可能）。cgiFolder/tieredworks_ajax.js:190-191 でこれら hidden をクライアント側で base64 デコードして POST パラメータに乗せている。全HTMLを grep しても captcha / recaptcha / token / csrf は0件。SP版 sp/singlefolder/reservation.html:99 も同一構造（TWsp_confirm）。
- **影響**: admin_email をはじめ宛先・件名・本文ヘッダ/フッタが利用者から改ざん可能な状態で mail_send.php に渡る。第三者が任意の宛先・任意の本文で当サロンのサーバからメールを送れる踏み台（オープンリレー相当）になり得、送信ドメインがスパム判定されると予約自動返信メールが顧客に届かなくなる。CAPTCHA/トークンが無いため自動投稿による予約フォームスパムで問い合わせ窓口が埋まるリスクも継続的にある。
- **修正**: 送信先アドレス・件名・自動返信文をサーバ側の設定ファイルに固定し、hidden から完全に排除。セッション単位のワンタイムトークン検証、Origin/Referer 検証、reCAPTCHA v3 または honeypot、同一IPのレート制限を実装。mail_send.php で改行を含む値のヘッダ混入（メールヘッダインジェクション）を遮断する。

### 🟠 重大 PC版とSP版のHTML二重管理（30ファイル・801行のテキスト重複）

- **箇所**: `sp/how_to_choose/index.html`:259 ／ 工数 L
- **証拠**: HTMLは31ファイル（PC15＋SP15＋RSS1）。テキスト抽出して比較すると PC側843行のうち801行が SP側にも同一文字列として存在（ユニーク453文字列）。CSSは同名ファイル153件のうち完全一致は13件のみ、140件が内容相違、PC専用88件・SP専用78件。実際に更新漏れが発生している：how_to_choose の価格（PC:504-506, SP:259-261）が course_plan の税込価格へ更新されず旧価格のまま両版に残存。またPC版 how_to_choose にのみ「詳しく見る▼」が11箇所あり SP版には存在しない（PC専有14行 vs SP専有3行）。
- **影響**: 1つの価格改定・キャンペーン差し替えのたびに最低2ファイル、ナビゲーション文言なら30ファイルを手で直す必要がある。実際に価格更新漏れという形で顕在化しており（legal-04）、景表法リスクと店頭クレームを生んでいる。更新コストが高いために『触らない』状態が固定化し、FAQのダミー放置やブログ4年半停止の遠因にもなっている。
- **修正**: PC/SPを1本のレスポンシブHTMLへ統合するのが根本解決。統合までの暫定運用として、価格・営業時間・電話番号など変動情報の「正」を1ページに定め、他ページからはリンクのみとする。更新時チェックリスト（PC/SP対で必ず両方修正）を用意する。

### 🟠 重大 予約フォームの送信成功判定が文字列一致のみで、メール未達でも「送信が完了しました」と表示される

- **箇所**: `cgiFolder/tieredworks_ajax.js` ／ 工数 M
- **証拠**: cgiFolder/tieredworks_ajax.js:352 が if (res.indexOf('success admin_send mail') != -1) { TWconfirmArea.innerHTML ='送信が完了しました。<br />ご利用ありがとうございました。'; }（353行）で、HTTPステータスも実際の送信結果も見ずレスポンス本文の部分文字列だけで成功表示を出す。本番 https://www.louiserever.com/cgiFolder/mail_send.php への GET レスポンス（HTTP 200）は、mb_detect_encoding/mb_convert_encoding の Warning 2件と「No recipient addresses found in header」という送信失敗メッセージを出力した直後に「success admin_send mail.」を出力しており、宛先が解決できず送信できていない状況でも成功トークンが返る実装であることが確認できる。357行の失敗判定 'error admin_send mail' に該当しない限り、TWconfirmArea には何も表示されないか成功表示が出る。sp/singlefolder/reservation.html:99 の TWsp_confirm 経路も同じ tieredworks_ajax.js を使用。
- **影響**: （反証担当が追加検出）
- **修正**: 短期：予約フォーム送信後に必ず info@louiserever.com へ実際に着信しているかを1週間毎日確認し、届いていない場合は即座にフォーム経由の予約受付を停止して電話・LINEへ誘導する。中期：mail_send.php 側で mail() の戻り値を判定して明示的なJSON（例 {"result":"ok"}）を返し、tieredworks_ajax.js:352 の判定をHTTPステータス＋JSONパースに置き換える。あわせて管理者宛メールとは別に、送信ログをサーバ側に記録して取りこぼしを検知できるようにする。

### 🟡 中 特定商取引法に基づく表記ページが皆無

- **箇所**: `course_plan/index.html`:407 ／ 工数 M
- **証拠**: 全30HTML（core_rss_feed.html除く）をgrepし「特定商取引」「特商法」「クーリング」「中途解約」「概要書面」「契約書面」いずれも0件。一方 course_plan/index.html:399-407 に「●Bコース フェイシャル5回・ボディ1回・シェービング1回 66,000円」「●Cコース フェイシャル7回・ボディ2回・シェービング1回 88,000円」、393-395に「●Aコース 33,000円」、457に脱毛「※1年6回保証」を掲載。
- **影響**: エステは特定継続的役務提供（1ヶ月超かつ5万円超）に該当し、概要書面/契約書面の交付、クーリングオフ8日間、中途解約権の明示が法定義務。5万円超のコースを公然と販売しながら法定表記ゼロは、消費者庁・都道府県による指示・業務停止命令の対象になり得る。トラブル時に契約無効を主張されれば全額返金リスクを負う。
- **修正**: 「特定商取引法に基づく表記」ページを新設し、事業者名（株式会社LIANGE）・代表者（西﨑朋子）・所在地・電話・役務の内容/対価/支払時期と方法/提供期間・クーリングオフ・中途解約時の精算方法（法定上限：提供済役務相当額＋2万円または残額の10%のいずれか低い額）・関連商品の返品条件を記載。全ページフッターからリンク。並行して5万円超コースの概要書面/契約書面の店頭運用も整備。

### 🟡 中 薬機法リスク表現がメニュー名に多数（脂肪溶解・肌質改善等）

- **箇所**: `course_plan/index.html`:316 ／ 工数 M
- **証拠**: course_plan/index.html:316「●スーパーセル脂肪溶解ラフォス（ラジオ波）＋ハンドトリートメント」、339「●改善コース クレストリバースケア」。index.html:405「セルライト・むくみ除去のための痩身メニュー」、442「肌質改善メニュー」。sp/course_plan/index.html:6 のmeta description「毛穴や肌を引き締め、肌質を改善するフェイシャル」。how_to_choose/index.html:414「狙った部位の脂肪＆セルライトを減少させ」、sp/trial/index.html:268「セルライト溶解オイルを塗布」。course_plan/index.html:375「●アンチエイジングケア」。index.html:328「シミ・美白ケア」。
- **影響**: 「脂肪溶解」「セルライトを減少させ」「除去」「改善」は身体の構造・機能への影響を標榜する表現で、非医療のエステでは薬機法上認められない。特に「脂肪溶解」は医療行為（脂肪溶解注射）を想起させ、医師法・医療広告規制の観点でも問題。検索流入の主要ページ（meta description含む）に埋まっているため、行政指導が入ると広範囲の書き換えが必要になり、SEO順位にも影響する。
- **修正**: メニュー名を機器名／施術名ベースへ改称（例：脂肪溶解ラフォス→ラフォス ラジオ波トリートメント、肌質改善メニュー→お肌のお手入れメニュー、シミ・美白ケア→ブライトニングケア）。「除去」「減少させ」「改善」を「アプローチ」「お手入れ」に統一。meta description も同時修正。

### 🟡 中 二重価格表示に期間・条件・通常価格の根拠がない

- **箇所**: `campaign/index.html`:235 ／ 工数 S
- **証拠**: campaign/index.html:235「【25分】通常￥4,400 → 特別価格￥2,200」、247「初回半額 ￥4,950 （６０分）」。SP版 sp/campaign/index.html:107・115 に同一記載。サイト全HTMLに「期間」「有効期限」「回数」の語は0件で、キャンペーンの実施期間・終了日・適用条件の記載がどこにもない。how_to_choose/index.html:251-253 にも「・通常価格 ￥12,000／トライアル価格 ￥6,000」があり、この通常価格12,000円自体が course_plan の税込価格と整合していない。
- **影響**: 景品表示法の価格表示ガイドラインでは、比較対照価格は最近相当期間（8週間以上）実際に販売していた価格である必要があり、根拠のない「通常価格」は有利誤認表示となる。期間の記載がないキャンペーンは何年も掲示され続けやすく、実際に本サイトは2024年11月更新のまま。措置命令・課徴金のリスクに加え、来店時に「まだやっていますか」の確認電話が発生して現場負担にもなる。
- **修正**: 各キャンペーンに「実施期間：YYYY年M月D日〜M月D日」「初回のご来店限定」「他券併用不可」等の条件を明記。通常価格は course_plan の税込価格と一致させ、実際に販売実績のある価格のみを比較対照に使う。掲載終了日をカレンダー管理する。

### 🟡 中 総額表示なし：サイト全体で「税込」「税別」「税抜」が0件

- **箇所**: `course_plan/index.html`:231 ／ 工数 S
- **証拠**: course_plan/index.html:231以降に 16,500円 / 25,300円 / 26,400円 / 88,000円 など約40件の価格を掲載しているが、全30HTMLを grep しても「税込」「税別」「税抜」「消費税」の語は1件も存在しない。how_to_choose/index.html:504-506 等の価格も同様に表記なし。
- **影響**: 2021年4月1日から消費者向け価格表示は総額（税込）表示が義務化されている。表記がないため顧客は税込か税抜か判断できず、course_plan の税込価格（16,500円等）と how_to_choose の旧税抜価格（15,000円等）が混在していることで誤解が増幅される。会計時のトラブルとクレームの直接原因になる。
- **修正**: 全価格に「（税込）」を付記し、ページ冒頭に「表示価格はすべて税込です」の一文を入れる。how_to_choose 側の旧価格は税込へ統一（legal-04と同時対応）。

### 🟡 中 プライバシーポリシーが独立ページになく、同意チェックボックスもない

- **箇所**: `singlefolder/reservation.html`:511 ／ 工数 M
- **証拠**: 「プライバシー」を含むHTMLは singlefolder/reservation.html と sp/singlefolder/reservation.html の2本のみ。reservation.html:509-541 に本文があるが、直後の <style> で #B000000313 { height: 200px; overflow: auto; } と高さ200pxのスクロールボックスに閉じ込められている。フォーム本体（181-535行）に同意チェックボックスは存在せず、grepでも「同意」はポリシー本文中の3箇所のみ。送信ボタンは534行の <input type="submit" value="入力内容確認"> のみ。利用目的として「エステサロン業務および付帯・関連するサービスの提供」とあるが、第三者提供・保有個人データの開示等請求手続・問い合わせ窓口の連絡先は具体的に書かれていない。
- **影響**: 予約フォームで氏名・ふりがな・電話番号・メールアドレス・来店希望日時・選択メニュー（＝身体の悩みに関する情報）を取得しているにもかかわらず、プライバシーポリシーが独立URLを持たず、他ページからリンクもされていない。個人情報保護法上の利用目的の通知・公表として不十分で、同意取得の記録も残らない。トラブル時に「同意していない」と主張された場合の反証手段がない。
- **修正**: /privacy/ として独立ページを新設し、全ページフッターからリンク。取得項目・利用目的・第三者提供の有無・保管期間・開示等請求の窓口（住所/電話/メール）・事業者名を明記。予約フォームに必須の同意チェックボックス（「プライバシーポリシーに同意する」＋リンク）を追加し、未チェックでは送信できないようにする。

### 🟡 中 禁忌・注意事項・個人差の但し書きが全ページで0件

- **箇所**: `trial/index.html`:264 ／ 工数 M
- **証拠**: 全30HTMLを走査し「個人差」「効果には」「注意事項」「禁忌」「妊娠」「医師」「医療機関」はいずれも0件。一方で how_to_choose/index.html:414「狙った部位の脂肪＆セルライトを減少させ」、sp/trial/index.html:364「効果を高め効率よく結果を出すことができます」、campaign/index.html:232「婦人科系疾患にお悩みの方やアレルギー・アトピーの方にもオススメ」といった結果を断定する表現は存在する。
- **影響**: 結果を断定する表現だけがあり、効果に個人差がある旨の注記が一切ない状態は景品表示法上の効果・性能に関する不当表示リスクを高める。より深刻なのは安全面で、妊娠中・皮膚疾患・ペースメーカー使用者などラジオ波や温浴系メニューの禁忌に該当する来店者への注意喚起がゼロであり、事故発生時にサロン側の説明義務違反を問われる。
- **修正**: 各施術ページに「効果には個人差があります」の注記と、共通の「ご利用いただけない場合（妊娠中・授乳中、皮膚疾患・炎症のある方、ペースメーカー等使用中の方、当日の飲酒・発熱時など）」の注意事項ブロックを設置。予約フォームにも該当有無の申告欄を追加する。

### 🟡 中 mail_send.phpがPHP警告とサーバ絶対パスを露出、PHP 7.4.33はEOL

- **箇所**: `cgiFolder/tieredworks_ajax.js`:343 ／ 工数 M
- **証拠**: 本番 https://www.louiserever.com/cgiFolder/mail_send.php へ GET すると本文に「Warning: mb_detect_encoding() expects parameter 1 to be string, array given in /home/louiserever/www/cgiFolder/mail_send.php on line 17」等が返る（HTTP 200）。レスポンスヘッダに x-powered-by: PHP/7.4.33。tieredworks_ajax.js:342-343 の TW_send がこのエンドポイントへ POST する。
- **影響**: display_errors が本番で有効になっており、サーバ内絶対パス（/home/louiserever/www/）・PHPバージョン・脆弱な行番号が攻撃者に開示される。PHP 7.4 は 2022年11月28日でセキュリティサポート終了済みで、以後の脆弱性が未修正のまま稼働している。予約という個人情報（氏名・電話・メール・来店希望日時）を扱う唯一のサーバ処理がこの状態にある。
- **修正**: display_errors=Off / log_errors=On に変更し、エラーはログのみへ。PHP を 8.2 以上へ更新（mail_send.php の mb_* 呼び出しの型不整合もあわせて修正）。x-powered-by ヘッダを expose_php=Off で抑止する。

### 🟡 中 CMSのログ解析管理画面が公開状態、jQuery 1.4.4を同梱

- **箇所**: `index.html`:665 ／ 工数 S
- **証拠**: index.html:665 の ana.exec('./cgiFolder/analysis/admin/index.php', ...) が示す管理ディレクトリ https://www.louiserever.com/cgiFolder/analysis/admin/ へアクセスすると HTTP 200 で <title>Analysis ログ解析</title> のログイン画面が表示され、そのHTML内で <script src="js/jquery-1.4.4.min.js"> を読み込んでいる。/cgiFolder/ 自体は403だがこの配下だけ200。
- **影響**: アクセス解析管理画面がインターネット全体から到達可能。ログイン試行の回数制限や2要素認証の形跡はなく、総当たり攻撃の的になる。突破されればサイト訪問者のアクセスログを閲覧され、同CMSの管理機能経由でページ改ざん（予約先電話番号やLINEリンクの差し替え）に発展し得る。jQuery 1.4.4（2010年）は多数の既知XSSを含む。
- **修正**: 該当ディレクトリを Basic 認証＋IP 制限で保護するか、使用していないなら削除。使用中ならログイン試行回数制限を導入し、同梱 jQuery を更新する。

### 🟡 中 jQuery 1.9.1 / jQuery Mobile 1.3.2 / Adobe Spry という13年前の停止済みライブラリ群

- **箇所**: `cgiFolder/tieredworks_libs.js`:2 ／ 工数 L
- **証拠**: cgiFolder/tieredworks_libs.js:1-2 のヘッダに「/* tieredworks_libs.js ver1.0.3 2013.06.27 */ /*! jQuery v1.9.1 | (c) 2005, 2012 jQuery Foundation」。sp/tw-static/jqmobile/jquery.mobile-1.3.2.min.js の中に version:"1.3.2"。SP版14ページすべてが sp/*/index.html:22 でこれを読み込む。cgiFolder/tieredworks_spry.js:1-2 は「/* SpryValidation*/ // Copyright (c) 2006. Adobe Systems Incorporated.」で135KB、PC/SP双方の予約フォームのバリデーションに使用（reservation.html:207 等の Spry.Widget.ValidationRadio）。
- **影響**: jQuery 1.9.1（2013年2月）は CVE-2015-9251（クロスドメインajaxのXSS）、CVE-2019-11358（プロトタイプ汚染）、CVE-2020-11022/11023（htmlPrefilter経由のXSS）が未修正。jQuery Mobile は2021年10月に開発終了、1.3.2 は2013年版で iOS/Android の現行 WebKit を想定していないためスクロール・タップ遅延・パネル動作が壊れやすい。Adobe Spry も2012年に提供終了しており、予約フォームの入力チェックが誰にも保守されていないコードに依存している。予約フォームが動かなくなった時点で問い合わせ経路が電話のみになる。
- **修正**: SP版を廃止して単一のレスポンシブHTMLへ統合する再構築が本筋（tech-03参照）。それまでの暫定策として、予約フォームのバリデーションを Spry から HTML5 標準の required / type=tel / type=email / pattern へ置換し、Spry と jQuery Mobile への依存を段階的に外す。

### 🟡 中 CSSが379本のmodule_B*.cssに細分化され@import3階層で直列読み込み

- **箇所**: `css/G000000001/cssfiles/page.css`:3 ／ 工数 M
- **証拠**: CSSファイル総数476本。うち module_B*.css は PC 163本・SP 216本の計379本。index.html:12-13 が css/site.css と css/G000000001/cssfiles/page.css を読み、site.css は base.css と sitetheme.css を @import、page.css:3-6 は theme.css / pagelayout.css / blockdesign.css / modulestyle.css を @import、その modulestyle.css がさらに module_B000000002.css 〜 module_B000000411.css を22本 @import。結果としてトップページだけで31本のローカルCSSが3階層の @import で直列取得される。
- **影響**: @import はネスト段ごとに直列化されるため、CSSの取得完了までレンダリングが待たされる。スマホ回線ではファーストビュー表示が明確に遅れ、直帰率に直結する。保守面では『トップの見出し色を変えたい』ときに module_B0000000xx.css のどれが該当するかHTML側のブロックIDを辿らないと分からず、CMS外部の担当者が触れない構造になっている。
- **修正**: ビルド時に全CSSを1〜2本へ結合・最小化して <link> で並列読み込みさせる。将来的にはブロックID依存の命名をやめ、コンポーネント単位のクラス設計へ移行する。

### 🟡 中 www/apexのリダイレクトが不整合でHOMEリンクが毎回2回301される

- **箇所**: `index.html`:671 ／ 工数 S
- **証拠**: curlで実測：https://www.louiserever.com/ は200。https://www.louiserever.com/index.html は301→https://louiserever.com/、その https://louiserever.com/ は301→https://www.louiserever.com/ で最終200（2ホップ）。https://louiserever.com/index.html は301→https://louiserever.com/ →さらに301。sp側も https://www.louiserever.com/sp/index.html が301→https://louiserever.com/sp/。一方 sp/index.html:13 の canonical は https://www.louiserever.com/index.html を指しており、その URL 自体がリダイレクトされる。index.html:671 のPC/SP切替リンクも https://www.louiserever.com/sp/index.html を直書き。
- **影響**: サイト内のHOMEリンクはすべて ./index.html 形式のため、ヘッダーのロゴやグローバルナビからHOMEへ戻るたびに301が2回発生する。モバイル回線では体感できる待ち時間になり、離脱要因となる。またSP全14ページの canonical がリダイレクトされるURLを指しているため、Googleへ渡す正規化シグナルが弱まりPC版の評価が正しく集約されない。
- **修正**: nginx側で apex→www（または www→apex）へ一方向に統一し、/index.html→/ の正規化も同じ1ホップで完結させる。canonical と PC/SP切替リンクを最終到達URL（末尾スラッシュ形式）に合わせて書き換える。

### 🟡 中 TieredWorks 1.4.1.3のブロックIDがHTML/CSS/JSに直書きされロックイン

- **箇所**: `singlefolder/reservation.html`:179 ／ 工数 L
- **証拠**: 全ページの <meta name="generator" content="TieredWorks 1.4.1.3" />（index.html:7）。HTML本文が <div id="B000000311" class="SF-module-container">（reservation.html:179）のようなブロックIDで構成され、CSSファイル名も module_B000000311.css と1対1対応。JSも reservation.html:207 で new Spry.Widget.ValidationRadio("B0000003118") のようにIDを直参照し、index.html:665 では ana.exec(...,'D000000500','HOME','G000000001',...) とページIDを埋め込む。CSSディレクトリも G000000001〜G000000018 のページID単位。index.html:552 では <p><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css"> と、body内の<p>要素の中に<link>が置かれている。
- **影響**: HTMLの構造・CSSのファイル名・JSの初期化コード・解析タグがすべて生成CMSの内部IDで結合されており、CMS外での部分改修が極めて難しい。『このボタンの色を変える』程度の依頼でもIDの追跡が必要で、外部制作者に引き継げない。結果として現行CMSのベンダーに依存し続けるか、全面作り直しかの二択になる。
- **修正**: 部分改修を積み重ねる方針は費用対効果が悪い。PC/SP統合（tech-03）とあわせて、モダンな静的サイトジェネレータまたは一般的なCMSへ移行し、コンテンツ（テキスト・価格・画像）をHTMLから分離する。移行までは既存HTMLを直接編集する前提で、変更手順書を残す。

### 🟡 中 トップページのブログiframe内に化粧品の効能効果標榜と販売価格が掲載されている

- **箇所**: `cgiFolder/core_rss_feed.html` ／ 工数 M
- **証拠**: index.html:471 の <iframe class="coreRssFeed" src="./cgiFolder/core_rss_feed.php">（sp/index.html:242 も同様）でトップページに常時埋め込まれているフィード本文、cgiFolder/core_rss_feed.html:115 に「そのほか、抗炎症・抗アレルギー・美白・透明感・ハリ・リフトアップ・ニキビなどに効果有。」および「ＣＯ２ブーティストミニ１本￥7480（税込）となっております。」と記載。これは役務ではなく化粧品という物品についての効能効果標榜であり、化粧品の効能効果の範囲（56項目）を明確に逸脱する「抗アレルギー」「抗炎症」「ニキビに効果有」を含む。同一記事内に価格と「気になる方は是非ルイーズレヴェまでお問合わせくださいませ」という購入誘導もある。legal-02（campaign/index.html:232）は役務広告で薬機法の直接適用に議論の余地があるのに対し、こちらは物品の広告のため薬機法66条の適用対象になり得る点でむしろ問題が明確。
- **影響**: （反証担当が追加検出）
- **修正**: 当該ブログ記事をAmeba側で修正または非公開にする。あわせて、トップページのフィード枠は2021年12月04日で更新が止まっている（core_rss_feed.html 内の published 全10件が2021年8月〜12月）ため、iframe を削除して index.html:280 / sp/index.html:96 で既にリンクしている稼働中の https://louiserever.jp/blog/（curlで200確認済み）への導線に一本化するのが最も低コスト。

### ⚪ 軽 景表法：「和歌山では珍しい」の裏付け表示なし

- **箇所**: `campaign/index.html`:229 ／ 工数 S
- **証拠**: campaign/index.html:229「<span class="mincho">和歌山では珍しいコラーゲンライト</span>」、SP版 sp/campaign/index.html:100 に同一。サイト内に導入店舗数の調査根拠や調査時点の記載はない。あわせて index.html:8 の <title>海南市で人気のエステサロン【LOUISE REVER】</title>、index.html:208 の h1「フェイシャルエステ・ブライダルエステが人気の海南市のエステサロン」など「人気」表記が全23箇所。
- **影響**: 「和歌山では珍しい」は地域内での希少性を示す優位性表示であり、景品表示法上は合理的な根拠資料（調査時点・調査範囲・出典）の保有が求められる。消費者庁から表示の裏付けとなる資料の提出を求められた際に出せなければ不当表示と扱われる。「人気」は主観表現として比較的許容範囲だが、No.1表示・ランキング表示（サイト内では0件）に踏み込むと同様のリスクが生じる。
- **修正**: 「和歌山では珍しい」を削除するか、「和歌山県内の導入サロンが少ない（当社調べ・YYYY年M月時点）」のように調査主体・時点を併記する。今後「地域No.1」「県内唯一」等の表現を使う場合は根拠資料を必ず保管する運用にする。

### ⚪ 軽 robots.txt / sitemap.xml が404

- **箇所**: `index.html`:11 ／ 工数 S
- **証拠**: https://www.louiserever.com/robots.txt は404（Apacheの Not Found を返す）、https://www.louiserever.com/sitemap.xml も404。一方 index.html:11 の rel="alternate" と sp/*/index.html:13 の rel="canonical" による PC/SP 分離構成を採っており、クローラーに正しく対応関係を伝える必要がある構造になっている。
- **影響**: PC30ページ+SP15ページという分離構成でsitemapが無いため、クロール対象の網羅性と更新検知が検索エンジン任せになる。tech-06の301チェーンと組み合わさると、どのURLを正規とみなすかの判断がさらに不安定になり、指名検索以外の流入を取りこぼす。
- **修正**: PC版15ページのURLを列挙した sitemap.xml を設置し、robots.txt から参照。あわせて Google Search Console に登録してインデックス状況を確認する。

### ⚪ 軽 セキュリティヘッダが一切設定されていない

- **箇所**: `index.html`:1 ／ 工数 S
- **証拠**: curl -I https://www.louiserever.com/ のレスポンスは server: nginx / date / content-type / content-length / last-modified / etag / accept-ranges のみ。Strict-Transport-Security、X-Content-Type-Options、X-Frame-Options（またはCSP frame-ancestors）、Content-Security-Policy、Referrer-Policy はいずれも無い。http:// は301でhttpsへ転送される。last-modified は Fri, 29 Nov 2024（約1年8ヶ月更新なし）。
- **影響**: HSTSが無いため初回アクセス時の中間者攻撃でHTTPSへの昇格を阻害され得る。X-Frame-Options/CSPが無いため予約フォームを外部サイトのiframeに埋め込んでのクリックジャッキング（意図しない予約送信）を防げない。個人情報を入力させるフォームを持つサイトとして最低限の防御が欠けている。
- **修正**: nginxに Strict-Transport-Security: max-age=31536000; includeSubDomains、X-Content-Type-Options: nosniff、X-Frame-Options: SAMEORIGIN、Referrer-Policy: strict-origin-when-cross-origin を追加。将来的に Content-Security-Policy を段階導入する。

### ⚪ 軽 SP全14ページがhttp://html5shim.googlecode.com（2016年閉鎖）を参照

- **箇所**: `sp/index.html`:11 ／ 工数 S
- **証拠**: grep結果、sp/index.html:11、sp/beginner/index.html:11、sp/trial/index.html:11、sp/course_plan/index.html:12、sp/how_to_choose/index.html:11、sp/faq/index.html:11、sp/campaign/index.html:11、sp/shopinfo/index.html:11、sp/singlefolder/reservation.html:11、sp/singlefolder/staff_1/3/3_1/4/5/6.html:11 の計14ページに <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>。いずれも <!--[if lte IE 9]> 〜 <![endif]--> の条件付きコメント内。
- **影響**: googlecode.com は2016年に完全閉鎖済みで、このURLは既に存在しない。条件付きコメントはIE10以降では評価されないためモダンブラウザで実際にリクエストは飛ばないが、https ページから http URL を参照する記述が14ファイルに残っていることはセキュリティ診断・監査で mixed content 指摘として必ず挙がる。またIE向けの死んだコードが14ファイルに散在していること自体が二重管理コスト（tech-03）の実例。
- **修正**: 該当の条件付きコメント3行を全14ファイルから削除。


## デザイン・ビジュアル・レスポンシブ（28件）

### 🟠 重大 予約フォームが信号色＋90年代ベベルボタン

- **箇所**: `css/G000000011/cssfiles/module_B000000311.css`:222 ／ 工数 S
- **証拠**: module_B000000311.css:165 で入力成功時 background-color:#b8f5b1（蛍光緑）、:178 でエラー時 #ff9f9f（蛍光ピンク）、:183 でフォーカス時 #ffffcc（蛍光黄）。エラー文言は :168-175 で color:#ff3333 / font-size:10px。送信ボタンは :222-231 `#submit input { margin:10px; padding:3px 5px 3px 5px; color:#ffffff; background-color:#7f7f7f; font-size:12px; border-width:1px; border-color:#bdbdbd #696969 #696969 #bdbdbd; }`（上左が明・下右が暗の疑似3D立体枠）。確認画面用 :239-246 も同一。singlefolder/reservation.html:502 では送信ボタンの隣に `<input type="reset" value="リセット">` が並ぶ。sp/css/G000000011/cssfiles/module_B000000311.css は「送信ボタン」セクションが空でSP側の指定が無い。
- **影響**: 最重要KPIである来店予約フォームで、ブランドカラーが一切使われず灰色12pxのボタンが最終CTAになっている。padding 3px のため高さ約20pxで、スマホでは押しづらくタップミスが起きる。隣のリセットボタンを誤押下すると入力が全消去され離脱に直結する。10pxの赤エラー文字は40代以上には読めない。
- **修正**: #submit input をブランドゴールド(#70592C 背景/白文字)、font-size:16px、padding:16px 32px、border:none、border-radius:4px、min-height:48px、width:100%(SP)に変更。border-color の疑似3D指定を削除。reservation.html:502 の reset ボタンを削除。エラー文字は14px以上・背景色は薄いベージュ系に置換する。

### 🟠 重大 SPトップ「おすすめプラン」3枠のリンク先が全て自分自身（sp/index.html）

- **箇所**: `sp/index.html` ／ 工数 M
- **証拠**: sp/index.html:209 `<a href="index.html" target="_self"><img src="../assets/arrow.png" style="position: absolute; bottom: 0; right: 0;"></a>`、同 :220、:230 の 3 箇所すべてが href="index.html"、つまり SP トップ自身を指している。矢印アイコンで「次へ進める」と示唆しているが、タップしても同じページに戻るだけ。対して PC 版 index.html:322 は同じ構造で `<a href="trial/index.html#A">` と正しい遷移先を持っており、SP だけが取り残されている。該当枠は「ヘッドスパ＆頭皮ケア（￥8,250）」「部分痩せメニュー（￥6,600）」「肌質改善メニュー（￥11,000）」で、いずれも単価の高い主力メニュー。
- **影響**: （反証担当が追加検出）
- **修正**: sp/index.html:209/220/230 の href を PC 版と同じ遷移先（trial/index.html#A、course_plan/index.html の該当アンカー等）に修正する。PC/SP で導線定義が二重管理になっている構造自体が原因なので、リンク先はデータ側で 1 箇所管理にする。

### 🟠 重大 sp/how_to_choose の回遊カード3枚が全て trial/index.html に飛ぶ（ラベルと遷移先が不一致）

- **箇所**: `sp/how_to_choose/index.html` ／ 工数 M
- **証拠**: sp/how_to_choose/index.html:357 / :362 / :367 がいずれも `<p class="contentTextStyle"><a href="../../assets/../trial/index.html" target="_self"></a></p>`。見出しは :355「トライアル（体験）コース」、:360「コース・プランのご案内」、:365「コース・プランの選び方」と 3 種類あるのに、遷移先は 3 枚とも trial/index.html。さらに a 要素にテキストが無く、extends_style.css:517-531 の `a{position:absolute;width:100%;height:100%;text-indent:100%}` でカード全面リンクとして機能しているため、利用者はラベルを信じてタップし別ページに着地する。パスも `../../assets/../trial/index.html` という生成ミス由来の冗長形。
- **影響**: （反証担当が追加検出）
- **修正**: sp/how_to_choose/index.html:362 を course_plan/index.html、:367 を該当セクションのアンカーに修正し、`../../assets/../` の冗長パスを正規化する。同構造は B000000054/071/124/148/158 の各ページにもあるため全ブロックで遷移先を照合する。

### 🟠 重大 PC/SP トップの「Contact」ボタンとブライダルバナーが href="#" のデッドリンク

- **箇所**: `index.html` ／ 工数 M
- **証拠**: index.html:585 `<a href="#" target="_blank" class="button-rink2" style="color:#ffffff;">Contact</a>` — 店舗情報パネル（#B000000031、module_B000000031.css:22 で background-color:#555555）の最下部に置かれた唯一の CTA ボタンが遷移先なし。sp/index.html:346 にも同一の記述がある。加えて index.html:281 と sp/index.html:97 の `<li class="SF-simpleImg"><a href="#"><img src="./assets/top_bana3.png" alt="はじめてのブライダルエステ"/></a></li>` も href="#"。サイト全体で href="#" は 4 箇所、その全てが CTA・バナーという構成。
- **影響**: （反証担当が追加検出）
- **修正**: index.html:585 / sp/index.html:346 の Contact ボタンを singlefolder/reservation.html（または LINE 追加 URL）に接続する。index.html:281 / sp/index.html:97 のブライダルバナーは対応ページが無いなら該当バナー自体を差し替えるか非表示にし、target="_blank" のまま空リンクを残さない。

### 🟠 重大 トップページ中央のブログ枠が2021年12月で更新停止したまま常時表示されている

- **箇所**: `cgiFolder/core_rss_feed.html` ／ 工数 M
- **証拠**: index.html:471 と sp/index.html:242 が iframe で読み込む cgiFolder/core_rss_feed.html 内の `<span class='published'>` を全件抽出すると、最新が「2021年 12月 04日 16時44分」、以降 2021年10月22日 / 10月20日 / 10月08日 / 09月08日 … と続き、2022年以降の記事が 1 件も無い。この枠は index.html:476-482 で height:408px・width:100% を与えられ、SF-row2 col1（blockdesign.css:9 で width:480px）に常時表示される。
- **影響**: （反証担当が追加検出）
- **修正**: 更新が止まっているならトップの RSS 枠を撤去し、その面積をキャンペーン・トライアル価格・LINE予約の導線に置き換える。運用を再開するなら、記事が一定期間更新されない場合に枠を自動的に非表示にするフォールバックを入れる。

### 🟠 重大 PC版全16ページにviewport metaが無く1000px固定

- **箇所**: `css/G000000001/cssfiles/pagelayout.css`:3 ／ 工数 L
- **証拠**: pagelayout.css:3 で #SF-outer-container{width:1000px}、blockdesign.css:3/9/16/23/30 で各カラムが 1000px/480px/500px/500px/500px の px 固定。site 配下の HTML 31 本のうち <meta name="viewport"> を持つのは sp/ 配下の 15 本だけで、PC 版 index.html / beginner / trial / course_plan / how_to_choose / faq / campaign / shopinfo / singlefolder の 16 本には 1 つも無い。さらに index.html:676 のリダイレクト判定は `navigator.userAgent.indexOf("iPad") == -1` で iPad を明示的に除外しているため、iPad は SP 版に飛ばず PC 版を受け取る。
- **影響**: iPad・Androidタブレット・小型ノートで、viewport 未指定のため既定 980px ビューポートに 1000px レイアウトが載り、横スクロールと全体縮小が発生する。13px 本文が実効 9〜10px まで縮み、電話番号・料金・予約ボタンが読めない。エステの主要顧客層である 30〜50 代女性のタブレット閲覧がそのまま離脱になる。
- **修正**: 全 PC ページの <head> に <meta name="viewport" content="width=device-width, initial-scale=1"> を追加したうえで、pagelayout.css:3 を width:1000px → max-width:1000px; width:100%、blockdesign.css の各カラム px 指定を % または flex/grid に置換する。恒久対応としては PC/SP 2 系統をやめ、1 ソースのレスポンシブに統合する。

### 🟡 中 トップのブログ枠が外部HTMLをそのまま表示しパレットが崩壊

- **箇所**: `cgiFolder/core_rss_feed.html`:120 ／ 工数 M
- **証拠**: index.html:471 と sp/index.html:242 が `<iframe class="coreRssFeed" src="./cgiFolder/core_rss_feed.html">` を埋め込んでいる。その core_rss_feed.html:120 以降にはアメブロから貼られた生HTMLが入り、rgb(255,0,0) が9箇所、rgb(204,0,0) が4箇所、rgb(255,127,0) が3箇所、rgb(0,175,255) が3箇所、font-size:2.74em が12箇所、font-size:22.4px が7箇所、さらに <font color="#ff7f00"> タグと外部絵文字画像(stat100.ameba.jp)が使われている。同ファイル:46 では line-height:1.3（サイト標準は sitetheme.css:6 の 1.7）、:36 のSP用メディアクエリは max-width:350px と現行機種に当たらない値。
- **影響**: 金・ベージュ(#D9C79D/#70592C)で作った高級感のあるトップページの中央に、赤・オレンジ・水色の巨大文字が並ぶ枠が常時表示される。ブランドイメージが即座に「個人ブログ」レベルまで落ち、客単価2万円前後のメニューの説得力が失われる。
- **修正**: RSS表示側で流し込みHTMLの style/font 属性をサニタイズし、テキストと画像だけを取り出してサイト側CSS（Noto、#70592C、line-height 1.7）で描画する。当面は core_rss_feed.html に `#rssBox * { font-size: inherit !important; color: inherit !important; }` を追加して上書きする。

### 🟡 中 赤系が6色混在しブランド金と衝突している

- **箇所**: `index.html`:98 ／ 工数 M
- **証拠**: CSS/HTML全体で使われる赤系は #FF7272（index.html:98 の .trial、初回トライアル価格）、#FF7D7D（sp/trial/index.html:119 ほかインライン74箇所、PC/SPのトライアル価格とスタッフ紹介見出し）、#b20000（extends_style.css:237 の .price と faq/index.html:278 ほか9箇所）、#ff3333（module_B000000311.css:168/222 の必須マークとエラー）、red（module_B000000311.css:187）、#ff9f9f（同:178 のエラー背景）の6種類。ブランド側は #D9C79D / #70592C / #705A2C / #BC9C52 / #C4A764 / #A4833F の6段階の金・ベージュ。CSS全体のユニーク色コードは39色。
- **影響**: 「初回トライアル ￥4,400」がピンク寄りの#FF7D7D、FAQの注意書きが暗赤#b20000、フォームのエラーが#ff3333と、同じ「注意・強調」の役割に3つの赤が使われている。金基調の中に彩度の高いピンクが1.5emで入ることで、量販チラシのような印象になり、2万円台のメニューの価格説得力を下げている。
- **修正**: 強調色を1色（例：#B23A48 のような彩度を落とした赤）に統一し、価格強調はゴールド#70592Cの太字＋大きさで表現する方針に変える。#FF7272/#FF7D7D の74箇所超のインライン指定を .price-trial クラスに置換する。

### 🟡 中 トップのコース／バナー画像に height 属性が無くレイアウトシフトが発生する

- **箇所**: `index.html` ／ 工数 M
- **証拠**: index.html:279-282 のバナー 4 枚は `<img width="240" src="./assets/top_bana1.png" ...>` で height 指定なし、index.html:317/330 ほかのコースサムネイルも `<img width="300" src="./assets/top_course1.png" alt=""/>` で height なし。SP 側 sp/index.html:95-98 は width すら無い。対象画像は top_course1.png 81,393B、top_course5.png 105,790B、top_course6.png 111,573B、ヒーロー 3 枚 計 971,324B と重く、読み込み完了まで高さが確定しない。loading="lazy" もサイト内の img に 1 つも付いていない。
- **影響**: （反証担当が追加検出）
- **修正**: 全 img に width/height（または CSS の aspect-ratio）を付与して読み込み前に領域を確保する。ファーストビュー外の画像には loading="lazy" を追加する。

### 🟡 中 バナー画像が240x120と低解像度で文字が焼き込み

- **箇所**: `sp/tw-static/jqmobile/extends_style.css`:251 ／ 工数 M
- **証拠**: assets/top_bana1.png・top_bana2_2.png・top_bana3.png・top_bana4.png はいずれも実寸 240x120px。index.html:279-282 は `<img width="240">`、sp/index.html:95-98 は同じ画像を使い extends_style.css:250-253 の `#B000000024 ul li.SF-simpleImg img { width: 50%; float: left; }` で表示される。alt属性から「コラーゲンライト　お試しキャンペーン中」「お悩み別　無料カウンセリング予約受付中！」など訴求コピーが画像に焼き込まれていることが確認できる。375px端末では表示幅約188px、DPR3の端末では実デバイス564px対して原寸240pxで2.35倍の拡大。
- **影響**: キャンペーン名・カウンセリング無料という最も強い訴求文が、Retina端末でぼやけて表示される。文字が画像なので拡大もコピーもできず、キャンペーン内容を変えるたびに画像の作り直しが必要で運用が止まる。検索にも一切引っかからない。
- **修正**: バナーは背景画像＋HTMLテキストの構成に変更し、コピーはCSS(.gothic/#70592C)で描画する。写真部分だけを画像として2倍解像度(480x240)で書き出し、srcset で出し分ける。

### 🟡 中 写真をPNG保存しており容量が3〜5倍

- **箇所**: `index.html`:317 ／ 工数 M
- **証拠**: index.html:317/330/356/369/382 と sp/index.html:123/134/156/167/178 が参照する top_course1.png(300x200/81,393B)、top_course3.png(89,803B)、top_course4.png(90,494B)、top_course5.png(105,790B)、top_course6.png(111,573B)、top_gaz3.png(300x150/83,640B)、top_gaz3_1.png(77,556B)、top_gaz3_2.png(70,712B) はすべて写真だが PNG。同じ 300x200 の写真である course_gaz2.jpg は 25,432B、shop_ga01.jpg は 19,780B、trial_gaz1.jpg は 15,928B。how_to_choose_item_1〜12.png(200x200) も 39〜65KB で12点合計約667KB。またトップのPCスライダー3枚は top_image.jpg 314,436B / top_imagi02.jpg 414,060B / top_imagi03.jpg 242,828B の計971KB。
- **影響**: 同等の見た目で3〜5倍の転送量になっている。トップページだけで画像が2MB近くに達し、和歌山の3G/低速回線や地下・車内での閲覧で初回表示が数秒遅れる。表示前に離脱すれば予約導線に到達しない。
- **修正**: 写真PNG(top_course*.png / top_gaz3*.png / how_to_choose_item_*.png)をJPEG品質80またはWebPへ変換し、透過が必要なものだけPNGで残す。ヒーロー3枚は幅1920で再書き出しし WebP 化する。全imgに loading="lazy" と width/height を付与する。

### 🟡 中 PC下部の店舗情報がvw/px混在で幅により位置がずれる

- **箇所**: `index.html`:147 ／ 工数 M
- **証拠**: index.html:130-157 の `@media screen and (min-width:1000px)` 内で `#B000000031 { position:relative; margin-left: calc(50% - 50vw); padding-left: 42vw; }` `#B000000032 { position:relative; margin-right: calc(50% - 50vw); padding-right: 260px; }`。B31 の素のサイズは module_B000000031.css:6-8 で `width:270px; height:410px;`、:22 で `background-color:#555555`。親は blockdesign.css:23/30 の `#SF-row3 .SF-col1{width:500px} #SF-row3 .SF-col2{width:500px}`。計算するとビューポート1000pxのとき margin-left=250-500=-250px、padding-left=420px でコンテンツ開始位置は列頭+170px、右端は 555px となり col2（地図、500px開始）に55px食い込む。ビューポート1920pxでは margin-left=-710px、padding-left=806px でコンテンツ開始位置は列頭+96px、右端は481pxとなり地図との間に19pxの隙間ができる。
- **影響**: 住所・電話番号・営業時間を載せたグレーパネルと Google マップの位置関係が、ウィンドウ幅ごとに「重なる」「離れる」と変化する。1000px前後の一般的なノートPCでは地図の左端が灰色パネルに隠れ、来店前の最終確認である住所と地図が同時に読めない。さらに height:410px 固定のため、文字サイズ変更や住所追記で内容がはみ出す。
- **修正**: index.html:139-163 の vw ハック一式を撤去し、B31/B32 を1本の flex コンテナ（左:店舗情報、右:地図）に組み替える。module_B000000031.css:6-8 の width:270px/height:410px を width:auto/min-height に変更する。

### 🟡 中 2026年基準で古く見える装飾が全面に残存

- **箇所**: `sp/tw-static/jqmobile/extends_style.css`:621 ／ 工数 L
- **証拠**: (1) 疑似3Dベベル：module_B000000311.css:230/245 の `border-color:#bdbdbd #696969 #696969 #bdbdbd`、:86-87 の入力欄 `border-color: #aaaa94 #dfdfd6 #dfdfd6 #aaaa94`。(2) text-shadow による凸文字：extends_style.css:621 の `.ui-bar-a{text-shadow:0 1px 0 #ffffff}`、sp/css/G000000001/cssfiles/module_B000000010.css:30 `text-shadow: 0 1px 0 #ffffff`。(3) 同色2点間のダミーグラデーション：extends_style.css:621 に `-webkit-gradient(linear,...from(#d9c79d),to(#d9c79d))` 等のベンダープレフィックス付き記述が.ui-bar-a/.ui-body-a/.ui-btn-up-a/.ui-btn-hover-a/.ui-btn-down-a/.ui-btn-active の6セット。(4) 点線区切り：extends_style.css:326/332/339/419/427 の `border-bottom: 1px dotted #cccccc`、:601 の `border-top: 1px dashed #70592C`。(5) テーブルレイアウト：レイアウト用 table が PC/SP 合わせて41個。(6) -moz-border-radius / -webkit-box-shadow などのベンダープレフィックスが146ファイルに残存。(7) index.html:10-12 相当の IE9 向け html5shim（sp/index.html:10-12）。
- **影響**: 影付き立体ボタン、白い凸文字、点線区切り、テーブル組みという2010年前後の記号が画面全体に出ており、初見の数秒で「10年以上更新していないサロン」と判断される。競合サロンのサイトと並べたとき、施術内容ではなくサイトの古さで比較負けする。
- **修正**: フォームボタンと入力欄のベベル指定を削除しフラット化（border:1px solid + border-radius:4px）、text-shadow を全廃、同色グラデーション記述を単色background に置換、点線を 1px solid #E8E0CE に統一、レイアウト用tableをflex/gridへ置換、旧ベンダープレフィックスとIE向けshimを削除する。

### 🟡 中 インラインstyleが578箇所・同一指定が15ページに複製

- **箇所**: `index.html`:212 ／ 工数 M
- **証拠**: HTML31本の style="..." は計578箇所。うち245箇所はCMS生成の `style="min-width:15px;min-height:15px"`、残り333箇所が手書き。頻出は `style="padding-left: 20px;"` 52箇所、`style="position: absolute; bottom: 0; right: 0;"` 18箇所、`style="padding:15px; border-spacing: 0; border: 2px solid #C4A764;"` 16箇所、`style="position: absolute; top: 3px; right: 0;"` 15箇所（index.html:212 の予約ボタン、PC全15ページに複製）、`style="left: 0px; top:45px;"` 15箇所（index.html:209 のロゴ）、`style="...width:375px;font-size:x-large;"` 15箇所（index.html:671）。position:absolute のインライン指定は全体で33箇所。
- **影響**: ヘッダーの高さやロゴ位置を1px動かすだけでPC15ファイル・SP15ファイルの手修正が必要になり、改修のたびにページ間で位置ズレが残る。実際に「予約はこちら」ボタン（最重要CTA）の位置がインラインの top:3px right:0 に依存しており、CSSだけでは動かせない。
- **修正**: 繰り返し出現する6パターンをクラス化（.header-logo / .header-cta / .card-arrow / .course-table / .view-switch）してCSSへ移す。特に .header-cta と .header-logo は corestyle.css:213-215 の position:absolute 指定と併せて1箇所で管理する。

### 🟡 中 PC版とSP版でトップのコース表現が完全に別デザイン

- **箇所**: `sp/css/G000000001/cssfiles/module_B000000010.css`:82 ／ 工数 L
- **証拠**: 同じ6コースの見せ方が、PC: index.html:311-392 で `ul.thumbnailList` の3列サムネイル（img width=300、index.html:41-43 で2番目・5番目に margin:0 50px を当てて列間調整）、背景なし。SP: sp/index.html:120-187 で1件ずつ独立divとなり module_B000000010.css:82-99 の `div.SF-block-normal[data-role="none"] { background-color:#F5F1E7; padding:15px; font-size:0.9em; border-radius:0em; }` によりベージュのカード風になる。見出しサイズも PC は h3 既定18px、SP は extends_style.css:179-184 で 15px。価格ボックスも PC は index.html:82-94 の `.c_box{height:80px}` `.c_box2{height:60px}`、SP は extends_style.css:263-268/289-294 の `.c_box{height:auto;padding:20px}` `.c_box2{height:30px;padding:10px}` と別値。同様に .kome_line の装飾線幅も PC 40%（index.html:183）／SP 30%（extends_style.css:307）で異なる。
- **影響**: PCで見て気に入った人がスマホで再訪すると別のサイトに見え、ブランドの一貫性が崩れる。制作・更新も2系統になり、コース追加や価格改定のたびに PC/SP 両方のHTML/CSSを別々に直す必要があるため、片方だけ古い価格が残るリスクが常にある（実際に .c_box の高さ・.kome_line の幅など既に値がずれている）。
- **修正**: 中期的にはレスポンシブ1ソースへ統合する。それまでの暫定策として、カード（背景#F5F1E7＋余白）表現をPC側にも適用して両者の見た目を寄せ、.c_box/.c_box2/.kome_line の値をPC/SP共通CSSに切り出して1箇所管理にする。

### 🟡 中 SP版6ページで導線カード画像がheight:0で非表示

- **箇所**: `sp/tw-static/jqmobile/extends_style.css`:285 ／ 工数 S
- **証拠**: extends_style.css:280-286 に `#B000000054 ... img,#B000000071 ... img,#B000000124 ... img,#B000000141 ... img,#B000000148 ... img,#B000000158 ... img,#B000000397 div.SF-block-normal[data-role="none"] img { width:100%; height:0px; }` がある。該当ブロックは sp/beginner(B054)、sp/trial(B071)、sp/course_plan(B124)、sp/faq(B148)、sp/campaign(B158)、sp/how_to_choose(B397) の 6 ページに実在し、例えば sp/how_to_choose/index.html:356 は `<img src="../../assets/course_gaz1.jpg">` を含む `div.SF-block-normal[data-role="none"]` 構造で完全に一致する。sp/css/G000000007/cssfiles/module_B000000397.css には img 指定が 1 行も無く、height を戻す規則は存在しない。PC 版 how_to_choose/index.html:230 では同じ course_gaz1.jpg が width=300 で表示されている。
- **影響**: 下層6ページ末尾の「トライアル/コース案内/選び方」への回遊カードが、SPでは画像ゼロの文字リンクだけになる。PC版と印象が別物になり、写真で興味を引いて次ページへ送る導線が機能しない。しかも course_gaz1〜3.jpg(計61KB)は表示されないのにダウンロードされる。
- **修正**: extends_style.css:280-286 の height:0px を削除する（width:100% のみ残す）。ブロック全体をリンク化する意図なら、img は表示したまま親に position:relative、a に position:absolute; inset:0 を当てる（同ファイル 512-531 行に既にその実装がある）。

### 🟡 中 SP下層ページの主役画像が1600x400のPC用使い回し

- **箇所**: `sp/beginner/index.html`:88 ／ 工数 M
- **証拠**: sp/beginner/index.html:88 は `<img src="../../assets/beginner_image.jpg" style="padding-bottom:20px;">`。assets/beginner_image.jpg は 1600x400（4:1）、142KB。同様に trial_image.jpg 1600x400/105KB、course_plan_image.jpg 1600x400/250KB、qa_img.jpg 1600x400/133KB、shopinfo_image.jpg 1600x400/167KB、campaign_img.jpg 1600x400/168KB、staff_image.jpg 1600x400/120KB がすべて SP 側でもそのまま参照されている。extends_style.css:4-9 の img{max-width:100%} で幅 375px に縮むため、表示高は 375÷4=約94px。一方 SP トップだけは専用の sp_slide_001〜004.jpg(640x900) を使っている。
- **影響**: 下層6ページのメインビジュアルが iPhone で高さ94pxの細帯になり、被写体（施術シーン・スタッフ）がほぼ判別できない。ページの第一印象が「潰れた画像」になり信頼感を損なう。加えて375px幅の端末に250KBの画像を送るため表示も遅い。
- **修正**: SPトップと同様に各下層ページ用の縦長〜正方形クロップ（例 750x750）を用意し、<picture>+media で切り替える。当面の応急処置としては、SP側のimgを親要素で aspect-ratio:16/9 + object-fit:cover に包み、中央付近をトリミング表示する。

### 🟡 中 SP料金表がtableの50/25/25%固定で折返しが崩れる

- **箇所**: `sp/tw-static/jqmobile/extends_style.css`:374 ／ 工数 M
- **証拠**: extends_style.css:373-387 で `.course_l{width:50%;padding:5px} .course_c{width:25%;padding:5px} .course_r{width:25%;text-align:right;padding:5px}`。sp/course_plan/index.html:109 以降でこれらが `<table border="0" width="100%" style="padding:15px; border-spacing: 0; border: 2px solid #C4A764;">` の中で使われ、例えば :117-120 は「・ベーシック（Body Method）　アトニック（引きしめ）」(24文字)／「90分」／「26,400円」という並び。sp/course_plan/index.html には table が7個、sp/trial には6個、sp/faq には4個ある。375px端末では左セルの実効幅は約155px、フォントは0.9em(約12.6px)なので24文字は3行に折り返す。
- **影響**: 料金表がスマホで左だけ3行・右は1行という不揃いな段組になり、どの分数・どの価格がどのメニューのものか対応が読み取れない。コース選択がSP来訪者の主要行動なのに、比較検討ができず問い合わせ前に離脱する。
- **修正**: SPでは table を display:block 化し、1メニュー1カード（名称→時間→価格の縦積み）に組み替える。CSSのみで対応するなら .course_l/.course_c/.course_r を display:block; width:100%; text-align:left にし、価格だけ font-weight:bold で右寄せする。

### 🟡 中 font-sizeが50種類・タイポスケールが存在しない

- **箇所**: `css/G000000001/cssfiles/module_B000000007.css`:37 ／ 工数 L
- **証拠**: CSS(css/, sp/css/, extends_style.css, corestyle.css)とHTML内インラインを合わせた font-size 値のユニーク数は50。px 系だけで 9,10,12,13,14,15,16,18,20,22,24,25,26,28,36px、相対値で 0.5em,0.7em,0.8em,0.875em,0.9em,1.2em,1.3em,1.4em,1.5em,1.7em,2.2em,2.5em,2.74em、さらに 90%、x-large、22.4px が混在。加えて `font-size:px` `font-size:` という値欠落の壊れた宣言も存在する（module_B000000007.css の生成テンプレート由来）。HTML 内インラインだけでも font-size:1.2em が78箇所、x-large が15箇所。
- **影響**: 見出しレベルと文字サイズが対応しておらず、ページごとに情報の階層が変わる。読み手が「どこが重要か」を判断できず、料金・トライアル価格・電話番号といった意思決定情報が埋もれる。改修時もどの値が正なのか判断できず修正コストが膨らむ。
- **修正**: 12/14/16/20/24/32/40px 程度の7段階タイプスケールをCSS変数で定義し、各モジュールCSSとインラインの font-size を全てそこへ寄せる。まずインライン指定（HTML内で200箇所超）をクラス化するところから着手する。

### 🟡 中 本文13px・行間設定の不統一で日本語が読みにくい

- **箇所**: `css/sitetheme.css`:5 ／ 工数 M
- **証拠**: PC: sitetheme.css:5-6 `font-size:13px; line-height:1.7`（base.css:19 は body 12px でこれを上書き）。SP: extends_style.css:195-205 で `p.contentTextStyle{font-size:14px}` `.ui-body-a,.ui-overlay-a{font-size:14px}` `.ui-btn-inner{font-size:14px}`。iframe内ブログ: core_rss_feed.html:45-46 `font-size:0.875em; line-height:1.3`。CSS全体の line-height 実値は inherit(157) / 1.7(79) / 1.5(79) / 1(15) / 1.4(1) / 1em(1) に加え、40px(30) / 50px(17) / 13px(15) / 30px(3) / 32px(1) / 37px(1) / 12px(2) / 0(2) という固定px指定、さらに `line-height:px` `line-height: px` という値欠落が3箇所。
- **影響**: 本文13px・行間1.7と、同一画面内のブログ枠が14px相当・行間1.3という2つの読み心地が並ぶ。固定pxのline-height（13px/40px/50px）は文字サイズを変えると行が重なる。30〜50代女性が主客層のサービスで13pxは小さく、コース説明文が読まれずに離脱する。
- **修正**: 本文を16px / line-height 1.8 に引き上げ、line-height は全て単位なし数値（1.8、見出し1.4）に統一する。値欠落の line-height:px を含む壊れた宣言を削除する。

### ⚪ 軽 ロゴが311x64pxでRetinaに耐えない

- **箇所**: `index.html`:209 ／ 工数 S
- **証拠**: assets/logo.png は 311x64px / 6537B、assets/logo2.png は 270x95px / 6479B。index.html:209 `<a id="HDLOGO" href="./index.html"><img src="./assets/logo.png" style="left: 0px; top:45px;" class="antiAlpha" /></a>` で等倍表示、sp/index.html:312 では logo2.png を SP フッター見出しに使用。PC全16ページ共通。SVG形式のロゴは assets/ 内に1点も存在しない（104点すべて png/jpg/gif）。
- **影響**: ブランドの顔であるロゴが、Retina MacBook・iPhone・4Kモニタで輪郭がぼやける。細い欧文セリフのロゴタイプほど劣化が目立ち、初見の印象で「作りが古い」と判断される。
- **修正**: ロゴをSVGで書き出して差し替える。原本が無い場合は最低でも2倍(622x128)のPNGを用意し width/height をCSSで半分に指定する。

### ⚪ 軽 PCグローバルナビが12px・高さ30px・合計951px固定

- **箇所**: `css/G000000001/cssfiles/module_B000000002.css`:8 ／ 工数 S
- **証拠**: module_B000000002.css:8 `height:30px`、:16-17 `padding-left:24px; padding-right:24px`、:39 `line-height: 13px`、:51 `font-size: 12px; font-weight: bold`。各項目幅は個別ID指定で home 75px / mmenu1 120px / mmenu2 96px / mmenu3 168px / mmenu4 168px / mmenu5 108px / mmenu6 108px / mmenu7 108px の計951px、左右padding 48px を足して999pxとなり1000pxにちょうど収まる設計。ドロップダウンは :63-66 で `top:13px; width:154px`。
- **影響**: クリック可能領域が実質13px高で、マウス操作でも外しやすい。12pxのメニュー文字は主要顧客層には小さい。さらに幅が1px単位で1000pxに詰め込まれているため、メニュー名を1文字増やす／1項目追加するだけでナビが2段に折り返してヘッダーが崩れる。運用でメニューを触れない状態。
- **修正**: module_B000000002.css の個別width指定を全廃し、ul を display:flex; justify-content:space-between に、li a を padding:14px 16px; font-size:15px; line-height:1.4 に変更する。ナビ高さは auto にする。

### ⚪ 軽 SPトップのbxSliderにPC用slideWidth:1000が残置

- **箇所**: `sp/index.html`:92 ／ 工数 S
- **証拠**: sp/index.html:92 の初期化に `slideWidth: 1000` が含まれる。cgiFolder/js/bxslider/jquery.bxslider.min.js（v4.1.2）の該当処理では、mode が 'horizontal' 以外（ここでは 'fade'）のとき viewport の親に `maxWidth: slideWidth` すなわち max-width:1000px を設定する。表示用画像 sp_slide_001〜004.jpg は 640x900px（縦長）で、375px幅では高さ約527pxになる。加えて jquery.bxslider.css:19 の `.bx-wrapper{margin:0 auto 60px}` と sp/index.html:92 の `<ul class="bxslider" style="margin-bottom:30px;">` が重なる。
- **影響**: SP専用ページのスライダー設定にPC用の1000px指定が残っており、意図が読めないまま次の改修者が触ると横幅が壊れる。実害としては、高さ527pxのスライダー＋90pxの余白でファーストビューがほぼ画像だけになり、キャンペーンバナーや電話番号がスクロールしないと現れない。
- **修正**: sp/index.html:92 の slideWidth:1000 を削除（0=自動）し、slideMargin/pager 設定を見直す。スライド画像を 640x640 程度に作り直してファーストビューにCTA（電話・LINE予約）を入れる。.bx-wrapper の margin-bottom 60px と ul のインライン margin-bottom 30px は一方に統一する。

### ⚪ 軽 表示切替リンクがwidth:375px・x-largeで全PCページに露出

- **箇所**: `index.html`:671 ／ 工数 S
- **証拠**: index.html:671 `<div id="SF-switch-link" style="margin-left:auto;margin-right:auto;padding:15px;margin-bottom:40px;text-align:center;position:relative;clear:both;width:375px;font-size:x-large;">表示：<a ...>モバイル</a>...</div>`。同一のインラインstyleがPC全15ページに複製されている。直後の index.html:674-682 のスクリプトは `if(document.cookie.indexOf("tw_redirect=false") == -1)` の条件下でのみ `element.style.cssText="display:none;"` を実行するため、SP版で「パソコン」を選んで tw_redirect=false のcookieを持つ利用者には非表示処理が走らず、この要素が表示されたままになる。
- **影響**: 一度SPからPC表示に切り替えた利用者には、PC全ページのフッターに幅375px・x-large(約24px)の「表示：モバイル｜パソコン」ブロックが残る。本文13pxの中で最も大きい文字がこの切替リンクになり、ページの締めくくりが不格好になる。
- **修正**: index.html:671 のインラインstyleをクラス化してCSSへ移し、font-size:13px・width:auto・目立たない配色に変更する。恒久的にはレスポンシブ統合により切替UI自体を撤去する。

### ⚪ 軽 セクション余白が9段階でリズムが崩れている

- **箇所**: `css/G000000001/cssfiles/module_B000000024.css`:8 ／ 工数 M
- **証拠**: PC側CSSの margin-bottom 実値は 5px(46) / 10px(23) / 15px(3) / 20px(43) / 25px(1) / 30px(2) / 50px(14) / 80px(1) / 100px(4) の9段階。margin-top も 5/10/15/20/30/50px の6段階。SP側 margin-bottom は 0/5/10/20/30/50px。さらに負マージンによる位置合わせが散在し、module_B000000024.css:8 `margin-top:-15px`（トップバナー帯）、extends_style.css:218 `#B000000191,...{margin:-15px -15px 0}`、:222 `#B000000189{margin:-30px -15px 0}` がある。padding は `padding:0`(111) `padding:0px`(79) `padding: 0px 0px`(28) `padding: 10px 10px`(15) `padding: 0 0px`(15) と同義の書き方が5通り混在。
- **影響**: セクション間の間隔が5px〜100pxまで不規則に並び、「どこからどこまでが1つの情報のかたまりか」が視覚的に伝わらない。特にトップページはコース6枠→おすすめ3枠→SNS→LINE→店舗情報と続くため、区切りが読めないまま流し読みされ、トライアル価格に注意が向かない。
- **修正**: 8pxベースのスペーシングスケール(8/16/24/40/64px)をCSS変数で定義し、全モジュールの margin/padding をそこへ寄せる。負マージンによる位置補正(module_B000000024.css:8、extends_style.css:218/222)は親要素のpaddingで正しく設計し直す。

### ⚪ 軽 ブランドフォント名が誤記で価格ボックス等に適用されていない

- **箇所**: `sp/tw-static/jqmobile/extends_style.css`:267 ／ 工数 S
- **証拠**: extends_style.css:267 `.c_box { font-family: 'Noto Sans Japanese', sans-serif; }`、:293 `.c_box2 { font-family: 'Noto Sans Japanese', sans-serif; }`、:417 `.q_l { font-family: 'Noto Serif Japanese', serif; }`。一方 sp/index.html:92 で読み込んでいるのは `Noto+Sans+JP` と `Noto+Serif+JP` であり、'Noto Sans Japanese' / 'Noto Serif Japanese' というファミリ名はこのページにロードされていない（Google Fonts Early Access の旧名称）。同ファイル :621 の .ui-body-a 系は font-family:Helvetica,Arial,sans-serif なので、フォールバック先は端末既定の日本語フォントになる。
- **影響**: 価格表示ボックス（.c_box/.c_box2）とQ&Aの見出し（.q_l）が意図した Noto Sans/Serif ではなく端末既定フォントで表示され、iPhone(ヒラギノ)とAndroid(Noto Sans CJK)で見た目が変わる。ブランドの「上品な明朝」という狙いが最も目立つ価格まわりで崩れる。
- **修正**: extends_style.css:267/293/417 のファミリ名を 'Noto Sans JP' / 'Noto Serif JP' に修正する。合わせて既存の .gothic/.mincho クラスに統一し、個別の font-family 指定を廃止する。

### ⚪ 軽 本文の既定フォントがHelvetica/メイリオでブランドフォントが局所適用

- **箇所**: `sp/tw-static/jqmobile/extends_style.css`:621 ／ 工数 M
- **証拠**: SP: extends_style.css:621 の jQuery Mobile テーマで `.ui-body-a,.ui-body-a input,...{font-family:Helvetica,Arial,sans-serif}` および `.ui-bar-a{...font-family:Helvetica,Arial,sans-serif}` `.ui-btn-up-a,.ui-btn-hover-a,.ui-btn-down-a{font-family:Helvetica,Arial,sans-serif}` が指定されている。PC: cgiFolder/corestyle.css:69-71 で `h1,h2,h3,h4,p,ul,li,strong,div,span,td,th,input,textarea { font-family:"メイリオ", Meiryo, "ヒラギノ角ゴ Pro W3", ... }`。Noto は HTML 側で class="gothic"/"mincho" を付けた要素にだけ当たる（index.html:28-34）。
- **影響**: 同一画面内でメイリオ／ヒラギノ／Noto Sans JP／Noto Serif JP が混在し、見出しは明朝・本文はゴシック・ボタンはOS依存という3系統になる。高単価サービスを売る美容サロンでフォントが揃っていないのは、そのまま「作りが安い」という印象に直結する。
- **修正**: corestyle.css:69-71 と extends_style.css:621 の font-family を 'Noto Sans JP' 基準に統一し、明朝を使う箇所だけ .mincho で上書きする方式に一本化する。

### ⚪ 軽 サイトのH1が9pxで実質不可視

- **箇所**: `css/G000000001/cssfiles/module_B000000007.css`:37 ／ 工数 S
- **証拠**: module_B000000007.css:29-43 の `#Module-default-container #Header-title { display:inline; float:left; margin-top:5px; font-size:9px; font-weight:bold; }`。対象は index.html:208 の `<h1 id="Header-title"><a href="./index.html">フェイシャルエステ・ブライダルエステが人気の海南市のエステサロン【LOUISE REVER】</a></h1>` で、PC全16ページ共通。PC CSS 内で 9px 指定は15箇所ある。
- **影響**: サイトで唯一のH1が9pxのため、視覚的には「読ませる気のないSEO文字列」としてヘッダー左上に残り、ロゴ（assets/logo.png、top:45px に絶対配置）と視覚的に競合する。ブランド名が最初に目に入るべきヘッダーで、可読性・見た目の両方を損ねている。
- **修正**: H1 をロゴ画像そのものに置き換え（img の alt にサイト名）、テキストが必要ならスクリーンリーダー用の視覚的非表示（clip-path 方式）にする。9px という中途半端なサイズ指定は削除する。


---

# ロードマップ


## Phase 0 応急処置（1〜2週間／既存HTMLへの直接修正のみ・サイトは公開したまま）

**目的**: 「今も営業していて、どのページからでも今すぐ予約できるサロン」に見える状態へ戻す。同時に、以降の改善効果を数字で判断できる土台（計測）を先に敷き、法務リスクを消す。作り替えの意思決定を待たずに単独で実施できる範囲に限定する。

- GA4 と Search Console を最優先で導入（改修前のベースラインを取るため、他のどの修正よりも先に入れる）。イベントは tel_click／line_click／reservation_submit／instagram_click
- 電話番号を全ページで <a href="tel:0734823765"> にリンク化（現在サイト全31ファイルで tel: が0件）。あわせて共通フッターにNAPブロック（店名・住所・電話・営業時間・定休日）を設置し、現在番号が載っていない12ページにも掲載する
- PC/SP全ページに固定CTAバー（電話／LINEで予約／予約フォーム の3択）を1ブロック追加。グローバルナビに「ご予約」を追加。ヘッダーの「ご予約はこちら」はLINEへ飛ぶ実態に合わせラベルを修正し、フォーム・電話を別ボタンで並置
- singlefolder/reservation.html:190 と sp 版 :108 の auto_reply_mail_flag を 0→1 に変更（返信文面は既に用意済み）。1週間、テスト送信で info@louiserever.com への実着信を毎日確認し、届かない場合はフォーム受付を一時停止して電話・LINEへ誘導
- how_to_choose（PC/SP）の全価格を course_plan と同じ税込へ修正。全料金表（PC/SP計10ページ）に「表示価格はすべて税込です」を明記。course_plan:320 の12,000円も正しい税込価格を確認して修正
- index.html:471 と sp/index.html:242 のブログiframeを撤去し、その面積を「今月のキャンペーン／営業カレンダー／予約CTA」に差し替え（2021年12月停止の告知と、iframe内の化粧品効能標榜の露出が同時に消える）
- campaign/index.html:232 と sp:104 の「婦人科系疾患・アレルギー・アトピー」の一文を削除。季節表現「まだまだ冷えを感じる季節」を現行季節へ差し替え、各キャンペーンに期限・先着数・「初回のみ／お一人様1回限り」を明記
- リンク切れ46箇所の修正：回遊カード36箇所を <li> ごと <a> でラップ、how_to_choose の3枚を正しい遷移先へ、おすすめプラン3枚（PC/SP計6箇所）を course_plan の該当ブロックへ、href="#" 4件（ブライダルバナー／Contactボタン）を接続
- 営業時間を「10:00〜◯◯:00（最終受付◯◯:00）※完全予約制」に統一。shopinfo・index の PC/SP 4箇所＋meta description 2箇所＋予約フォームの時間選択肢＋Googleビジネスプロフィール＋LINE を同時に一致させる
- FAQ を各カテゴリ5問以上に拡充し、#A1〜#A4 のアンカーを実装（現在は4カテゴリ全てが同一の1問で、ボタンを押しても何も起きない）
- staff 6ページ＋予約フォームの title/description（PC/SP計14ページ）を記入。staff_5／staff_6 のプロフィールを取材して埋める（すぐ埋まらない場合は beginner の該当サムネイルからリンクを外す）
- 画像の応急軽量化：ヒーロー3枚（計971KB）をWebP化し2枚目以降に loading="lazy"、how_to_choose_item_*.png 12点（計668KB）と top_course*.png をJPEG/WebP変換、全imgに width/height を付与
- SPへのUA判定リダイレクトを </body> 直前から <head> 内へ移動し、判定条件に iPad／Tablet を追加（現在 iPad は明示的に除外され1000px固定のPC版を縮小表示している）
- /cgiFolder/analysis/admin/ に Basic認証＋IP制限（未使用なら削除）、display_errors=Off、expose_php=Off、セキュリティヘッダ追加
- Googleビジネスプロフィールの情報をサイトと1文字単位で一致させ、写真の追加・投稿・口コミ返信の運用を開始する

**期待効果**: 最大の離脱要因である「閉店したのでは」という疑念が消え、全ページから電話・LINE・フォームの3経路で予約できるようになる。特に tel: リンクとCTA設置は、スマホからの発信が現状ほぼゼロの状態から立ち上がるため単体で効果が大きい。価格矛盾と疾病訴求という2つの法務リスクが同時に消え、店頭クレームと当日キャンセルの発生源が断たれる。自動返信の有効化で「送ったのに何も来ない」という信頼毀損がなくなる。GA4導入により、以降の施策を推測ではなく数字で判断できるようになる。制作会社実働で概ね5〜8人日、Phase 1 の意思決定を待たずに着手できる。


## Phase 1 作り替え（8〜12週）

**目的**: PC/SP二重管理をやめてレスポンシブ1ソースへ統合し、サロン自身が更新できるCMSへ移行する。予約を「送信後に電話待ち」から「その場で確定」に変え、指名検索の受け皿として機能する情報設計へ組み替える。

- レスポンシブ1ソースへ全面移行（PC15＋SP15ページ → 15ページ相当）。TieredWorks 1.4.1.3／jQuery Mobile 1.3.2／Adobe Spry／jQuery 1.9.1／PHP自前運用から離脱し、ブロックID（B000000xxx）に依存した構造を廃止する
- 予約を空き枠カレンダー型の外部予約システムへ置換し、LINE公式アカウント（@pnb6242x）と連携。現行の自社フォーム（14項目47コントロール、重複ID40個、電話欄がtype=text、希望日が任意、同意チェックなし、リセットボタンが送信の隣）は再構築せず廃止する
- 情報設計の再編：ナビを「初めての方へ／お悩みから選ぶ／メニュー・料金／キャンペーン／よくある質問／店舗・アクセス／ご予約」に整理。現在「トライアル」「コース・プランのご案内」「コース・プランの選び方」の3つが似た名前で並び違いが判断できない状態を解消する
- 価格・営業時間・電話番号など変動情報のマスタを1箇所に集約し、他ページは参照のみとする（今回の価格矛盾の再発防止）
- ブライダルエステ専用ページを新設。33,000〜88,000円の最高単価かつ挙式日という締切があり成約率が最も高いセグメントで、現在は専用ページもtitle内キーワードもバナーのリンク先も存在しない
- ファーストビューの作り直し：「和歌山県海南市／初回トライアル◯◯円／完全予約制」のコピーと電話・LINE・予約の3ボタンを最初の画面に置く。SPスライダーの開店祝いの花が写った写真2枚を差し替える
- お客様の声・施術実績・ビフォーアフターを追加（薬機法・医療広告に配慮した表現で）。現在サイト上に1件もなく、高単価メニューの説得力を支える証拠が存在しない
- LocalBusiness(BeautySalon)／Service／FAQPage／BreadcrumbList／Person の JSON-LD、OGP、自己参照canonical、sitemap.xml、robots.txt を整備。titleを『主題｜サービス＋地域｜店名』形式に統一し「和歌山」「ブライダル」「脱毛」を含める（現在は全titleに1つも入っていない）
- www/apex の301を一方向に統一（現在は www→apex→www の2ホップ）し、canonical を最終200 URLへ。louiserever.jp/blog との関係も整理
- アクセシビリティの基礎整備：コントラスト是正（初回トライアル価格 #FF7272 2.36:1、コース見出しの白文字/#C4A764 2.32:1、おすすめメニュー名 #FF7D7D 2.48:1、エラー文字10px 3.64:1）、本文16px/行間1.8、フォーカス可視化、lang="ja"、ランドマーク要素、画像のalt整備
- 画像を srcset／WebP／寸法指定つきで再書き出し（現在 assets 104点5.2MB、下層6ページのメインビジュアルは1600x400のPC用を流用しSPで高さ94pxの帯になっている）
- キャンセル規定・トライアル利用条件・回数コースの有効期限と中途解約、プライバシーポリシーの独立ページ化と同意チェックを整備

**期待効果**: 更新1回あたりの作業対象が2ファイル→1ファイルになり、価格改定やキャンペーン差し替えが当日中に完了する。「更新コストが高いから触らない」という今回の根本原因が構造的に解消される。予約が電話待ちなしでその場で確定するため、営業時間外（19時以降・月曜/第1第3日曜）に検討している見込み客を取り逃さなくなる。表示速度とモバイル体験の改善で、同じ流入量でも直帰が減り予約への変換率が上がる。ブライダル専用ページにより、最高単価セグメントの検索需要を初めて拾えるようになる。構造化データとNAP統一により、ローカル検索での表示面積が広がる。


## Phase 2 成長（移行後3〜12ヶ月／月次運用）

**目的**: ポータル依存を段階的に下げ、自社サイトを「指名検索の受け皿」と「予約の一次窓口」として機能させ続ける。放置による信頼毀損が二度と起きない更新サイクルを定着させる。

- Googleビジネスプロフィール運用の定着：週1回の投稿、口コミの依頼と全件返信、写真追加、臨時休業・営業時間変更の即時反映。商圏規模から見てサイト以上に流入を左右する資産として最優先で回す
- 悩み別コンテンツの拡充：「海南市 しみ エステ」「和歌山 ブライダルエステ 何ヶ月前から」など購買意図の強いロングテールに対し1テーマ1ページを月1〜2本追加。現在の how_to_choose の12カテゴリを起点にする
- スタッフ個人ページを指名予約の入口として運用（得意施術・保有資格・Instagram連携）。エステは「誰が施術するか」が来店判断とリピートに直結する
- LINE公式でのリピート施策：来店後のフォロー配信、次回予約の案内、会員限定メニュー。サイトからの友だち追加導線とセットで設計する
- キャンペーンの月次更新を運用ルール化：期限・条件・先着数を必ず明記し、掲載終了日をカレンダー管理。掲載できる企画がない月は「今月のおすすめ」として通常メニューを回す
- お客様の声・施術実績を月◯件ずつ追加し、掲載許諾の取得を来店フローに組み込む
- GA4で「フォーム／電話／LINE」別のCV数と、流入元（自然検索／GBP／Instagram／ポータル）別の貢献を月次レビュー。ポータル経由と自社経由の比率を追う
- コアウェブバイタルと検索順位の定点観測、および価格・営業時間・スタッフ情報の四半期棚卸し（PC/SP統合後は1箇所の確認で済む）

**期待効果**: 自社サイト経由の予約比率が上がり、ホットペッパービューティー等ポータルへの送客手数料依存を段階的に下げられる。指名検索（「ルイーズレヴェ 予約」「ルイーズレヴェ 和歌山」）と地域検索の受け皿が両方機能し、GBP経由の電話発信・経路検索が可視化される。悩み別コンテンツとスタッフページの蓄積で、指名検索以外の新規発見経路が育つ。何より、月次で更新する仕組みが回ることで、今回のような「4年8ヶ月放置」が構造的に起こらなくなる。


---

# 技術スタック選定

【選定基準】このサロンにとっての正解は「最新かどうか」ではなく、(1)スタッフ6名が自分で更新できるか (2)5年放置しても壊れないか (3)ローカルSEOに必要な要素を仕込めるか、の3点で決まる。今回の失敗の本質は技術の古さではなく、「TieredWorks 1.4.1.3 という触れないCMSに閉じ込められ、PC15＋SP15ページの二重管理で更新コストが高すぎたために放置された」ことにある（同一メニューの価格が how_to_choose と course_plan で1.1倍ずれたまま残存、FAQ がテンプレートのダミーのまま公開、お知らせが4年8ヶ月停止、はすべてこの構造の結果）。同じ轍を踏まない選定が最優先。

【第一推奨：本体サイト】STUDIO（CMSプラン）等のノーコード型レスポンシブCMS
・レスポンシブ1ソースが前提のため、PC/SP二重管理という今回の根本原因が構造的に発生しない。
・サーバー・PHP・ライブラリの保守が不要。現状は PHP 7.4.33（2022年11月にEOL）、jQuery 1.9.1（2013年）、jQuery Mobile 1.3.2（2021年開発終了）、Adobe Spry（2012年提供終了）、管理画面同梱の jQuery 1.4.4（2010年）という負債が積み上がっており、自前運用を続ける限りこれが再生産される。
・お知らせ・キャンペーン・スタッフ紹介をサロン側が管理画面から更新できる。月次更新の運用ルールが回る前提条件がこれ。
・カスタムコード埋め込みで GA4 と LocalBusiness/FAQPage の JSON-LD を入れられるため、ローカルSEO要件を満たせる。
・月額は数千円規模で、現行のレンタルサーバー＋CMS保守と大きく変わらない。

【第二候補：表示速度と自由度を優先する場合】Astro（静的生成）＋ microCMS ＋ Cloudflare Pages
・ビルド済みHTMLを配信するのでランタイムがなく、放置しても壊れない。ホスティングは実質無料。現状トップ約2.3MB（画像1,971,656B＋JS 303,617B＋CSS @import 3階層31本）という重さを根本から解消できる。
・更新は microCMS の管理画面でサロン側が可能。
・難点は、初期構築と改修に開発者が必要で、制作会社との関係が切れたときに引き継げる人を地方で探しにくいこと。制作会社との継続関係が前提にできるならこちらを推す。

【非推奨：WordPress 自前運用】
日本のサロン案件では最も一般的で引き継ぎ先も多いが、本件はまさに「更新されないCMS」で失敗している。プラグインとPHPの継続更新を6名のサロンが担うのは非現実的で、放置されれば脆弱性がそのまま残る。すでに /cgiFolder/analysis/admin/ が認証なしで HTTP 200 を返している状態を再生産することになる。

【予約システム】自社フォームは再構築せず廃止し、空き枠カレンダー型の外部予約システム（STORES予約／リザービア等）へ置換
・現行 singlefolder/reservation.html は 14項目47コントロール、重複IDが40個、電話欄が type="text"、希望日が任意、auto_reply_mail_flag=0 で自動返信無効、送信成功判定は tieredworks_ajax.js:352 の文字列一致のみ、という状態。作り直すより外部サービスに載せ替える方が安く確実。
・最大のCV要因は「その場で予約が確定すること」。現状は beginner/index.html:260-262 のとおり送信後に店舗から確認電話をして初めて確定する運用で、待っている間に競合へ流れる。営業時間外（19時以降・月曜/第1第3日曜）の予約を取りこぼしている。
・個人情報（氏名・電話・メール・来店希望日時・選択メニュー）を扱うサーバー処理を自前で持たなくて済む副次効果も大きい。
・LINE公式（@pnb6242x）は既に稼働しているので予約システムと連携させ、「電話／LINE／Web予約」の3経路を全ページ固定CTAに常設する。LINEに一本化しないこと（40代以上・LINE友だち追加を嫌う層の受け皿が消える）。

【ドメイン・配信】
louiserever.com を正とし、www か apex のどちらか一方向へ301を統一する（現状は www/index.html → apex → www の2ホップで、SP版15ページの canonical がこのリダイレクトされるURLを指している）。louiserever.jp/blog との関係を整理し、本体サイト配下へ統合するか301で寄せる。ameblo.jp/louisrever は停止済みなので撤去。

【計測・ローカルSEO】GA4 ＋ Search Console ＋ Googleビジネスプロフィールの3点セット
海南市＋和歌山市という商圏規模では、GBP が自社サイト以上に流入を左右する。サイトのNAP（店名・住所・電話・営業時間・定休日）とGBPの登録内容を1文字単位で一致させることを移行時の必須チェック項目にする。現状は住所表記が shopinfo/index.html:220（全角スペース＋半角スペース連続）と index.html:557（brで分断）で不一致、営業時間はサイト「10:00〜」／ブログ「10:00〜19:00」／予約フォーム「10時〜20時」の3通りに割れている。

---

# クライアント確認事項

1. 営業時間の確定：サイトは「10:00～※予約制」、ブログは「10:00～19:00」、予約フォームは10時～20時の11枠と3通りに割れています。実際の営業終了時刻と最終受付時刻はいつですか。Googleビジネスプロフィールにはどう登録されていますか。
2. 価格のマスタ確定：course_plan/index.html の税込価格を唯一の正としてよいですか。また同ページ :320「スーパーセル脂肪溶解ラフォス 上半身または下半身 60分 12,000円」だけが他の価格と違い1.1で割り切れません。これは税込ですか、それとも13,200円への更新漏れですか。
3. メニューの現況：index.html:9 の meta description で訴求している「ゲルマニウム温浴」「まつ毛カール」、beginner/index.html:224 の「ホワイトニング」は現在も提供していますか。course_plan の料金表には1行も掲載がありません（提供中なら掲載漏れによる売上機会損失、提供終了なら表示の是正が必要）。
4. スタッフ体制：池田真比呂さん・西崎彩奈さんは現在も在籍していますか（staff_5.html／staff_6.html は見出しだけで本文が全て空欄）。また写真ファイルとページの対応が崩れており（beginner/index.html:373 が吉田颯生さんに staff_2.jpg を使用、assets に拡張子の壊れた staff_3._2jpg が存在）、6名分の写真と担当の対応表をご提供いただけますか。
5. キャンセルポリシー：当日キャンセル料の有無・料率、連絡期限を教えてください。ブログには「当日キャンセル等はお控えくださいませ」とだけありますが、サイト本体に規定の記載が1件もありません（現状はサロン側も無断キャンセルを注意する根拠を持てていません）。
6. トライアルの利用条件：「初回のお客様のみ」「お一人様1回限り」「他券併用不可」などの条件を明記してよいですか。現在はtrialページに条件の記載が一切ありません。
7. ブライダルコースの契約形態：33,000／66,000／88,000円のA〜Cコースについて、有効期限（通う期間）と回数、中途解約時の精算方法を教えてください。提供期間が1ヶ月を超え5万円を超える場合、特定継続的役務提供として概要書面・契約書面の交付とクーリングオフ・中途解約の説明が店頭運用として必要になります。
8. キャンペーンの現況：コラーゲンライトとミネラリアダイエットは現在も実施中ですか。今後掲載する際の期限・先着数・併用条件をどう設定しますか。また campaign/index.html:229「和歌山では珍しいコラーゲンライト」の根拠（調査時点・調査範囲）はお持ちですか。
9. 情報発信チャネルの一本化：ameblo.jp/louisrever（2021年12月で停止）、louiserever.jp/blog、Instagram @louise.rever_wakayama の3系統が併存しています。今後どれを運用しますか。またフッターにアイコンだけあるFacebookページは実在しますか（サイト内に実URLが1件も存在しません）。
10. Googleビジネスプロフィールの管理権限をお持ちですか。現在の登録内容（店名・住所表記・電話・営業時間・定休日）を共有いただけますか。商圏規模から見て、GBPは自社サイト以上に流入を左右する最重要資産です。
11. ホットペッパービューティー等ポータルへの掲載有無と月額費用、および自社サイト経由の予約を何割まで増やしたいかの目標を教えてください。目標次第で Phase 2 の設計が変わります。
12. 予約管理の現状：紙台帳ですか、既存の予約システムがありますか。外部予約システム（空き枠カレンダー型）を導入する場合、日々の枠管理を担当されるのはどなたですか。
13. LINE公式アカウント（@pnb6242x）のプラン・友だち数・現在の予約受付運用（LINEで日時まで確定しているか、問い合わせ止まりか）を教えてください。
14. サーバー（nginx、PHP 7.4.33、/home/louiserever/www）とドメインの管理権限は誰が持っていますか。TieredWorks 1.4.1.3 の保守契約・ライセンスは現在も有効ですか（無効なら Phase 0 の直接HTML編集が唯一の手段になります）。
15. 事業者情報：shopinfo/index.html:250-256 にある運営元（和歌山県海南市日方1271-99-2F／073-494-3227）と店舗の関係を教えてください。プライバシーポリシーおよび必要に応じた法定表記に記載する事業者名・代表者名の確定が必要です。
16. 素材の原本：写真のトリミング前データ（現在は下層6ページで1600x400のPC用画像をSPでも流用し高さ94pxの帯になっています）とロゴのベクターデータ（assets 104点は全てpng/jpg/gifでSVGなし）はお手元にありますか。Phase 1 でファーストビュー用の撮影が必要かどうかの判断材料になります。
17. お客様の声・施術実績・ビフォーアフターを掲載できる素材（許諾済みの写真・コメント）はありますか。現在サイト上に1件もなく、高単価メニューの説得力を支える要素が欠けています。
18. 予算と希望公開時期：Phase 0（応急処置）のみ先行して着手し、効果を見てから Phase 1（作り替え）を判断する進め方でよいですか。それとも一括でご検討されますか。