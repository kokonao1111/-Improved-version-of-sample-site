/* =====================================================================
   CALDINA ― 出現
   ---------------------------------------------------------------------
   規範：何も動かさない。**線が引かれ、字が書かれ、面が満ちる**だけ。

   「下からふわっと上がってくる」は現在のwebで最も配備された効果なので
   使わない。translate も scale も rotate も、文字にも写真にも当てない。
   この意匠は影も角丸も重なりも持たない＝奥行きを主張しない宣言なので、
   出現が奥行きを匂わせた時点で語彙が壊れる。
   （css/lr-common.css 全体で translate 0件・filter 0件。例外ゼロ）

   ■ 役割ごとに動きを変える ― 同じ動きを全部に配らない

     罫     … 引かれる（scaleX）    英字副題を挟む金のヘアライン。
                                  線が外へ伸びて「ここが節だ」と場を開く
     節の見出し… 満ちる（opacity）   場が開いたことを受けて、題が在る。
                                  ★字の掃き出しは**当てられなかった**。器が版面幅
                                   1000pxで字は中央の約200pxだけなので、
                                   中央から開くと30%で字が全部読めてしまう（実測）。
                                   左から拭うと、器が持つ金の罫まで
                                   字と同じ速さで左から拭われる（実測98個）。
                                   このサイトの掟「罫は見出しから外へ向かって引かれる」
                                   に逆らうので、字には当てない
     札の名前 … 書かれる（clip-path）札の題（h3/h4）。**左寄せ**で、器の幅が札の幅。
                                  左→右に開けば字が読む向きに現れ、
                                  題が持つ下罫も「題の始まりから外へ」引かれる。
                                  幾何が向きを決めている＝掟どおり
     札     … 満ちる（opacity）    **1枚の紙**として。写真と本文を
                                  ばらばらに出さない。紙は1枚で置かれる
     装飾   … 満ちる（opacity）    いちばん遅く、いちばん静かに。
                                  ::before なので本文には触らない
     予約導線 … **動かさない**     下記

   ■ 動かさないと決めたもの（ここが設計の本体）

     ・予約導線（.lr-book-row > a ＝ お電話／LINE／Web予約。9ページ×3＝27本）
       **改修前はここに面の出現が掛かっていた。外した。**
       予約は目的地であって演出の対象ではない。常に在るべきもの。
     ・扉写真（.flexslider）… 幕が上がった直後に在るもの。ここで待たせない。
       加えて .slides > li は display:none で切り替わるので、
       opacity を重ねると切り替えと喧嘩する（実測：3枚中2枚が display:none）
     ・料金表・予約フォーム・「詳しく見る▼」の開閉（h2 > .csOpenClose）
       … 読むものと、状態を持つもの。伏せない
     ・扉写真の矢印（.flex-prev / .flex-next）… もともと CSS で伏せてある。
       出現とは別の話なので触らない（_tools/reveal.py もこれを対象外と数える）
     ・携帯の固定物（.lr-cta-fixed / .lr-navb）… 常に在る

   ■ 閉じ込めない作り（5段）

     1. reduced-motion なら何もしない
     2. IntersectionObserver が無ければ何もしない（印が付かない＝伏せない）
     3. 印を付ける・observe する・html.lr-io を付ける を**同じ同期処理**で行い、
        途中で例外が出たら lr-io を外して帰る。伏せたまま観測していない、
        という状態を作らない
     4. ★ **幾何で見る掃き取りを併走させる。**
        スクロールと寸法変更のたびに、まだ出ていないものの矩形を測り、
        画面に入っていれば出す。IntersectionObserver に依存しない。
        ─ なぜ要るか：IO の通知は「描画の機会」に紐づいて配られる。
          headless で測ると**通知がほとんど届かなかった**
          （観測を張り直しても callback が0回。実測）。
          実機では届くが、届かない条件が在ることが分かった以上、
          中身が消えたままになる経路を1本残すことになる。
          矩形は読めばいつでも正しい。掃き取りが最後の担保。
        ─ 副産物：スクロールで進むので _tools/reveal.py で実測できる。
     5. 3秒たって1つも出ていなければ、全部出す（最後の砦）
     加えて CSS 側で、印刷のときは伏せない（@media print）。

   ■ 検証
   _tools/reveal.py が実際に枠を送って、
   「送ったあと透明のまま残るものが無いか」「送る前に伏せられているものが在るか」
   「版面の高さと位置が動かないか」を測る。
   （前任の私は「検証手段が headless に無い」と書いて面の出現を諦めていた。
     枠は scrollTo で送れる。誤りだった）
   ===================================================================== */
(function () {
	'use strict';

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

	/* ── 罫：既存のまま。@supports (animation-timeline: view()) が使える環境では
	   スクロール位置で進む。進行が位置から一意に決まるので途中で止まらない。 ── */
	var SEL_RULE = '.kome_line, .lr-book-h';

	/* ── 札：1枚の紙として満ちるもの ── */
	var SEL_SHEET = '#SF-contents .thumbnailList > li, .lr-nav3-list > li, ' +
		'.lr-tiles > li, .lr-cal-wrap';

	/* ── 節の見出し：満ちるもの ──
	   .headlineStyle には「詳しく見る▼」の開閉（h2 > span.csOpenClose）も
	   同じクラスで含まれる（how_to_choose に4個）。あれは押すものなので外す。
	   節の見出しは札より上に在るので、順番は幾何が決める（先に画面へ入る）。
	   遅れの数字は与えない。 */
	var SEL_HEAD = '#SF-contents h2.headlineStyle';

	/* ── 札の名前：字が書かれるもの。左寄せ・下罫つきの題（h3/h4） ── */
	var SEL_NAME = '#SF-contents .newslistHeadlineStyle';

	/* ── 装飾：節の区切り。::before に絵を置いてある9ブロック ── */
	var SEL_ORN = '#B000000081, #B000000079, #B000000072, #B000000125, #B000000142, ' +
		'#B000000149, #B000000159, #B000000169, #B000000188';

	var SP = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;

	function list(sel) {
		try { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
		catch (e) { return []; }
	}

	function run() {
		var html = document.documentElement;

		var rules = list(SEL_RULE);
		var sheets = list(SEL_SHEET);
		var heads = list(SEL_HEAD).filter(function (el) {
			return !el.querySelector('.csOpenClose');
		});
		var names = list(SEL_NAME);
		var orns = list(SEL_ORN);

		if (!rules.length && !sheets.length && !heads.length &&
			!names.length && !orns.length) { return; }

		/* 罫はこれまでどおり。読み込み時に印を付け、いつ出すかは CSS が持つ。 */
		html.className += ' lr-anim';
		mark(rules, 'rule');

		var io = null;
		if (!window.IntersectionObserver) { return; }

		var targets = [];
		try {
			/* 伏せる印を付けるのと、観測を始めるのを、同じ同期処理の中で終える。
			   分けると「伏せたが観測していない」瞬間が生まれる。 */
			html.className += ' lr-io';
			mark(sheets, 'sheet');
			mark(heads, 'head');
			mark(names, 'name');
			mark(orns, 'orn');
			targets = sheets.concat(heads, names, orns);

			io = new window.IntersectionObserver(seen, {
				/* 下端から少しだけ内側に入ってから出す。
				   画面のふちで出ると「出た瞬間」が見えてしまう。 */
				rootMargin: '0px 0px -8% 0px',
				threshold: 0
			});
			targets.forEach(function (el) { io.observe(el); });
		} catch (e) {
			html.className = html.className.replace(/\s*lr-io/g, '');
			targets.forEach(reveal);
			return;
		}

		/* まだ出ていないもの。掃き取りが減らしていく。 */
		var left = targets.slice();

		function take(el) {
			if (el.hasAttribute('data-lr-in')) { return; }
			reveal(el);
			try { io.unobserve(el); } catch (e) {}
			var i = left.indexOf(el);
			if (i >= 0) { left.splice(i, 1); }
			if (!left.length) { off(); }
		}

		/* ── 幾何で見る掃き取り ──
		   矩形を読むだけ。IO の通知が届かなくても、送れば必ず出る。
		   下端から 8% 内側に入ってから出す（IO の rootMargin と同じ息）。 */
		function sweep() {
			var h = window.innerHeight || document.documentElement.clientHeight || 0;
			if (!h) { return; }
			var line = h * 0.92;
			left.slice().forEach(function (el) {
				var r = el.getBoundingClientRect();
				if (r.bottom > 0 && r.top < line) { take(el); }
			});
		}

		/* 間引きは時間で行う。requestAnimationFrame は使わない ―
		   描画の機会が作られない環境では呼ばれないことがある（IO と同じ理由）。 */
		var pending = false;
		function onMove() {
			if (pending) { return; }
			pending = true;
			window.setTimeout(function () { pending = false; sweep(); }, 80);
		}
		function off() {
			window.removeEventListener('scroll', onMove);
			window.removeEventListener('resize', onMove);
			try { io.disconnect(); } catch (e) {}
		}
		try {
			window.addEventListener('scroll', onMove, { passive: true });
		} catch (e) {
			window.addEventListener('scroll', onMove);
		}
		window.addEventListener('resize', onMove);
		sweep();

		/* 最後の砦：3秒たって1つも出ていなければ、全部出す。 */
		window.setTimeout(function () {
			if (left.length === targets.length) { targets.forEach(reveal); off(); }
		}, 3000);

		function seen(entries) {
			entries.forEach(function (en) {
				if (!en.isIntersecting) { return; }
				take(en.target);
			});
		}
	}

	function reveal(el) { el.setAttribute('data-lr-in', ''); }

	/* ★ 走り終えたら animation を外す。
	   opacity のアニメーションが載っている間、その要素は自分の層に描かれる。
	   終わった後も載せたままにすると、**1pxの罫が薄くなる**。
	   実測（index の札の題の下罫。出現あり／打ち消しで画素を突き合わせ）:
	       出現あり  (192,173,149)
	       打ち消し  (174,150,122)
	   このサイトの罫は署名なので、薄くなるのは許容できない。
	   印を付けて、CSS 側で animation:none / opacity:1 / clip-path:none に戻す。
	   opacity:1 を明示しても層は作られない（1未満のときだけ作られる）。

	   ・animationend は ::before からも上がってくる（装飾がそれ）。
	     その場合 target は要素本体で、pseudoElement に '::before' が入る。
	   ・イベントが来ない環境では印が付かないだけ。見え方は出現後のままで、
	     中身が消えることはない。 */
	document.addEventListener('animationend', function (e) {
		if (!/^lr-(fill|write)$/.test(e.animationName)) { return; }
		var el = e.target;
		if (el && el.nodeType === 1 && el.hasAttribute('data-lr')) {
			el.setAttribute('data-lr-done', '');
		}
	}, true);

	/* 間は 100ms 刻み。操作への返事 200ms のちょうど半分で、
	   「返事の半分の間隔で次が続く」。新しい数を作らない。
	   6つ目で頭打ち。順に出るのが「演出」に見え始める境目。
	   数えるのは**同じ親の中での順番**。ページ通しの番号だと、
	   下のほうの札が常に頭打ちの 500ms になって、間が意味を失う。

	   携帯では間を作らない。画面に1〜2枚しか入らないので、
	   順番は「律動」ではなく「待たされ」になる。 */
	function mark(els, kind) {
		var seq = [];
		els.forEach(function (el) {
			el.setAttribute('data-lr', kind);
			if (SP) { return; }
			var p = el.parentNode;
			var i = seq.indexOf(p);
			if (i < 0) { seq.push(p); i = seq.length - 1; }
			var n = el.getAttribute('data-lr-n');
			n = n ? parseInt(n, 10) : indexIn(el);
			el.style.setProperty('--lr-d', Math.min(n, 5) * 100 + 'ms');
		});
	}

	function indexIn(el) {
		var n = 0;
		for (var s = el.previousElementSibling; s; s = s.previousElementSibling) { n++; }
		return n;
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else { run(); }
}());
