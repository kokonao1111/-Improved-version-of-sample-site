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

     ・予約導線（.lr-book-row > a ＝ お電話／LINE／Web予約。15ページ×3＝45本）
       **改修前はここに面の出現が掛かっていた。外した。**
       予約は目的地であって演出の対象ではない。常に在るべきもの。
       実測：.lr-book に opacity:.3 を掛けると、CTAの文字のインク画素が
       370→0 / 399→0、見出しが 1851→0。読めない濃さになる。
     ・扉写真（.flexslider）… 幕が上がった直後に在るもの。ここで待たせない。
       加えて .slides > li は flexslider が inline の opacity で入れ替えるので、
       CSSアニメーションを重ねると **inline より上の origin** になって
       退場側が最後まで不透明のまま display:none に落ちる＝切り替えがぶつ切りになる
       （100ms刻みで実測）。3枚は同じ 1440x686 を占めるので間にも意味が無い。
     ・料金表・予約フォーム・「詳しく見る▼」の開閉（h2 > .csOpenClose）
       … 読むものと、状態を持つもの。伏せない
     ・扉写真の矢印（.flex-prev / .flex-next）… もともと CSS で伏せてある
     ・携帯の固定物（.lr-cta-fixed / .lr-navb）… 常に在る

   ■ 閉じ込めない作り ― 「出した」ではなく「読めた」で数える

     0. 伏せてよいかを**1個試してから**伏せる（usable()）。
        animation の一括指定は var() が1つでも解けないと計算値時に無効になり、
        animation-name が none に落ちる。そのとき素の指定
        （opacity:0 / clip-path: inset(0 100% 0 0)）だけが永久に残る。
        data-lr-in は正常に付くので、印を見る逃げ道は全部素通しする。
        だから印ではなく**計算値**を見て、効くと確かめてから伏せる。
     1. reduced-motion なら何もしない
     2. IntersectionObserver が無ければ何もしない（印が付かない＝伏せない）
     3. 印を付ける・observe する・html.lr-io を付ける を**同じ同期処理**で行い、
        途中で例外が出たら lr-io を外して帰る
     4. **幾何で見る掃き取りを、行事ではなく時計で回す。**
        scroll と resize に加えて 500ms ごとに矩形を測る。
        ─ 行事に頼れない場面が実測で3つある：
          (a) 畳んだ器（height:0 + overflow:hidden）の中は IO が見ない。
              how_to_choose の「詳しく見る▼」の中に印が24個あり、
              IO が返したのは12個だけ。残りは掃き取りだけが出している
          (b) ピンチ拡大して指で送っても window の scroll も IO も動かない
          (c) 一度もスクロールしない読み手（背面タブ・クローラ）
        ─ 矩形は読めばいつでも正しい。時計で回せば行事に依存しない。
     5. 出したあと **(遅れ＋長さ＋100ms) で読み返す。**
        まだ読めなければ data-lr を**外す**（外せば伏せる規則が当たらない）。
        ここだけが「読めたか」を見ている。上の4段はどれも
        「印が付いたか」しか見ていないので、P3 のような事故を素通しする。
     加えて CSS 側で、印刷のときは伏せない（@media print）。

   ■ 検証
   _tools/reveal.py が CDP で実際に送って測る。
   （枠＋--dump-dom＋--virtual-time-budget では測れない。仮想時間は
     タイマだけを早送りして**描画の機会を作らない**ので、IO も rAF も
     scroll イベントも動かない。以前「headless では IO が発火しない」と
     書いたのは誤りで、発火しないのは計り方のほうだった）
   ===================================================================== */
(function () {
	'use strict';

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

	/* ── 罫：既存のまま。@supports (animation-timeline: view()) が使える環境では
	   スクロール位置で進む。進行が位置から一意に決まるので途中で止まらない。 ── */
	var SEL_RULE = '.kome_line, .lr-book-h';

	/* ── 札：1枚の紙として満ちるもの ──
	   li.SF-simpleImg は shopinfo の店の写真6枚。棚卸しで
	   「どの印にも入っていない唯一の写真の並び」と分かったので足した。 */
	var SEL_SHEET = '#SF-contents .thumbnailList > li, .lr-nav3-list > li, ' +
		'.lr-tiles > li, .lr-cal-wrap, #SF-contents li.SF-simpleImg';

	/* ── 節の見出し：満ちるもの ──
	   .headlineStyle には「詳しく見る▼」の開閉（h2 > span.csOpenClose）も
	   同じクラスで含まれる（how_to_choose に4個）。あれは押すものなので外す。
	   節の見出しは札より上に在るので、順番は幾何が決める（先に画面へ入る）。 */
	var SEL_HEAD = '#SF-contents h2.headlineStyle';

	/* ── 札の名前：字が書かれるもの。左寄せ・下罫つきの題（h3/h4） ── */
	var SEL_NAME = '#SF-contents .newslistHeadlineStyle';

	/* ── 装飾：節の区切り。::before に絵を置いてある9ブロック ── */
	var SEL_ORN = '#B000000081, #B000000079, #B000000072, #B000000125, #B000000142, ' +
		'#B000000149, #B000000159, #B000000169, #B000000188';

	/* ★ 携帯かどうかを**版面の幅で判定してはいけない**。
	   cgiFolder/js/csLibrary.js:21-34 が viewport meta を
	   width=device-width, initial-scale=screen.width/1024 に書き換えるので、
	   実機の携帯では版面が **1024x2217** になる（実測。screen.width=390 のとき
	   initial-scale=0.38）。その結果 matchMedia('(max-width: 640px)') は
	   携帯で **false**（900px も false）。
	   指で触る画面かどうかで見る。こちらは版面幅に左右されない。 */
	var SP = !!(window.matchMedia && (
		window.matchMedia('(max-width: 640px)').matches ||
		window.matchMedia('(hover: none) and (pointer: coarse)').matches));

	function list(sel) {
		try { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
		catch (e) { return []; }
	}

	function ms(v) {
		var n = parseFloat(v);
		if (!n) { return 0; }
		return /ms/.test(v) ? n : n * 1000;
	}

	/* 伏せる権利を「効くことの証明」と引き換えにする。
	   使い捨ての1個を画面の外に置いて、伏せる規則と出す規則が
	   本当に計算値まで届いているかを読む。届いていなければ伏せない。 */
	function usable(html) {
		var ok = false;
		var p = document.createElement('div');
		p.setAttribute('data-lr', 'sheet');
		p.style.cssText = 'position:absolute;left:-9999px;top:0;width:1px;height:1px';
		try {
			html.className += ' lr-io';
			document.body.appendChild(p);
			var hid = window.getComputedStyle(p).opacity;
			p.setAttribute('data-lr-in', '');
			var c = window.getComputedStyle(p);
			ok = parseFloat(hid) < 0.5 &&
				/lr-fill/.test(c.animationName) &&
				ms(c.animationDuration) > 0;
		} catch (e) { ok = false; }
		if (p.parentNode) { p.parentNode.removeChild(p); }
		if (!ok) { html.className = html.className.replace(/\s*lr-io/g, ''); }
		return ok;
	}

	function readable(el) {
		var c = window.getComputedStyle(el);
		if (/100%/.test(c.clipPath || c.webkitClipPath || '')) { return false; }
		var op = 1;
		for (var p = el; p && p.nodeType === 1; p = p.parentNode) {
			var pc = window.getComputedStyle(p);
			/* 置き場所ごと隠れているなら、出現の話ではない。判定しない。 */
			if (pc.display === 'none' || pc.visibility === 'hidden') { return true; }
			op *= parseFloat(pc.opacity);
		}
		return op >= 0.5;
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

		if (!window.IntersectionObserver) { return; }
		if (!document.body) { return; }
		if (!usable(html)) { return; }   /* 効かないなら伏せない */

		var io = null;
		var targets = [];
		try {
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
			targets.forEach(function (el) { el.removeAttribute('data-lr'); });
			return;
		}

		var left = targets.slice();
		var tick = null;

		function seen(entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) { take(en.target); }
			});
		}

		function take(el) {
			if (el.hasAttribute('data-lr-in')) { return; }
			el.setAttribute('data-lr-in', '');
			try { io.unobserve(el); } catch (e) {}
			var i = left.indexOf(el);
			if (i >= 0) { left.splice(i, 1); }
			if (!left.length) { off(); }
			check(el);
		}

		/* ★ 読み返し。出したと言い張らず、読めたかを見る。
		   読めていなければ印を外す ＝ 伏せる規則が当たらなくなる。 */
		function check(el) {
			var c = window.getComputedStyle(el);
			var t = ms(c.animationDelay) + ms(c.animationDuration) + 100;
			window.setTimeout(function () {
				if (!readable(el)) {
					el.removeAttribute('data-lr');
					el.removeAttribute('data-lr-in');
				}
			}, t > 100 ? t : 1600);
		}

		/* ── 幾何で見る掃き取り ── */
		var firstSweep = true;
		function sweep() {
			var h = window.innerHeight || document.documentElement.clientHeight || 0;
			if (!h) { return; }
			/* 送っている間は下端から8%内側で出す（画面のふちで出ると
			   「出た瞬間」が見えてしまう）。
			   ただし**最初の1回だけは画面いっぱい**まで見る。
			   8%内側にすると、開いた時点で見えているのに伏せられたままの帯が
			   下端に残る（実測：campaign 3個・faq 3個・shopinfo 1個）。
			   一度も送らない読み手には、それが空白のまま見える。 */
			var line = firstSweep ? h : h * 0.92;
			firstSweep = false;
			left.slice().forEach(function (el) {
				var r = el.getBoundingClientRect();
				if (r.bottom > 0 && r.top < line) { take(el); }
			});
		}

		var pending = false;
		function onMove() {
			if (pending) { return; }
			pending = true;
			window.setTimeout(function () { pending = false; sweep(); }, 80);
		}
		function off() {
			window.removeEventListener('scroll', onMove);
			window.removeEventListener('resize', onMove);
			if (tick) { window.clearInterval(tick); tick = null; }
			try { io.disconnect(); } catch (e) {}
		}
		try {
			window.addEventListener('scroll', onMove, { passive: true });
		} catch (e) {
			window.addEventListener('scroll', onMove);
		}
		window.addEventListener('resize', onMove);
		/* 行事ではなく時計で回す。畳んだ器の中・ピンチ拡大・
		   一度も送らない読み手、どれも行事が来ない。 */
		tick = window.setInterval(sweep, 500);
		sweep();
	}

	/* 走り終えたら animation を外す。
	   opacity のアニメーションが載っている間、その要素は自分の層に描かれる。
	   終わった後も載せたままにすると **1pxの罫が薄くなる**。
	   実測（札の題の下罫）: 載せたまま (192,173,149) ／ 打ち消し (174,150,122)。
	   このサイトの罫は署名なので、薄くなるのは許容できない。 */
	document.addEventListener('animationend', function (e) {
		if (!/^lr-(fill|write)$/.test(e.animationName)) { return; }
		var el = e.target;
		if (el && el.nodeType === 1 && el.hasAttribute && el.hasAttribute('data-lr')) {
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
		els.forEach(function (el) {
			el.setAttribute('data-lr', kind);
			if (SP || kind !== 'sheet') { return; }
			var n = 0;
			for (var s = el.previousElementSibling; s; s = s.previousElementSibling) { n++; }
			el.style.setProperty('--lr-d', (n < 5 ? n : 5) * 100 + 'ms');
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else { run(); }
}());
