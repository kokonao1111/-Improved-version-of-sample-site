/* 開閉する見出しを、キーボードでも開けるようにする
   ------------------------------------------------------------------
   cgiFolder/js/csLibrary.js の csOpenClose() は
     $(titleObj).click(function(){ … })
   だけで開閉している。titleObj は
     <span class="csOpenClose"> の .parent().parent()
   ＝ <div class="SF-module-container">。素の div なので、

     ・Tab で選べない（tabindex を持たない）
     ・Enter / Space で開かない（keydown を見ていない）
     ・読み上げに「押せるもの」と伝わらない（role が無い）
     ・開いているか閉じているかも伝わらない（aria-expanded が無い）

   how_to_choose の12枚は**全部が最初は閉じていて、中に別のリンクも
   無い**ので、キーボードだけで操作する人には、おすすめメニューと料金へ
   たどり着く経路が一つも無い状態だった（WCAG 2.1.1 レベルA）。

   ■ csLibrary は書き換えない
   生成物なので作り直すと戻る。**上から属性と鍵操作を足すだけ**にする。
   開閉そのものは向こうに任せ、こちらは element.click() を投げる。
   jQuery の click ハンドラは素の click イベントで発火するので、
   同じ動きがそのまま起きる。二重に開閉することはない。

   ■ 見た目は1pxも変えない
   足すのは属性だけ。CSS は触らない。
   ------------------------------------------------------------------ */
(function () {
	'use strict';

	/* 他を閉じている最中かどうか。呼び合いを止めるための歯止め */
	var closing = false;

	function init() {
		var marks = document.querySelectorAll('.csOpenClose');
		if (!marks.length) { return; }

		Array.prototype.forEach.call(marks, function (mark, i) {
			var title = mark.parentNode && mark.parentNode.parentNode;
			if (!title || title.nodeType !== 1) { return; }
			if (title.getAttribute('data-lr-opcls')) { return; }
			title.setAttribute('data-lr-opcls', '1');

			var body = title.nextElementSibling;

			title.setAttribute('role', 'button');
			title.setAttribute('tabindex', '0');
			title.setAttribute('aria-expanded', 'false');
			if (body) {
				if (!body.id) { body.id = 'lr-opcls-' + (i + 1); }
				title.setAttribute('aria-controls', body.id);
			}

			/* Enter と Space。Space は押した時点で頁が送られるので既定を止める。
			   キーを離した時ではなく押した時に開くのは、ボタンの作法に合わせるため。 */
			title.addEventListener('keydown', function (e) {
				var k = e.key || e.keyCode;
				if (k === 'Enter' || k === 13 || k === ' ' || k === 'Spacebar' || k === 32) {
					e.preventDefault();
					title.click();
				}
			});

			/* ★ 同じ段では1つだけ開く
			   開いた中身は版面いっぱい（1000px）に広げてある。2つ同時に
			   開くと、広がった面どうしが重なって字が読めなくなる。
			   押した札と同じ段の、他の開いているものを閉じる。

			   閉じる操作は csLibrary の click ハンドラに任せる
			   （こちらで class や高さを直接いじると、向こうの持っている
			     状態と食い違う）。開いているものの見出しを押すだけ。 */
			title.addEventListener('click', function () {
				/* ★ 歯止めが要る。
				   閉じるために他の見出しを click すると、**その見出しの
				   同じ処理が走って、こちらを閉じ返してくる**。実際に
				   互いを呼び合って、結局2つとも開いたままになった。
				   閉じている最中は、この処理を止める。 */
				if (closing) { return; }
				/* ★ closest('[id^="SF-row"]') では掴めない。
				   列の中に <div id="SF-row2 .SF-col1"> という、**空白を含む id**
				   の入れ物があり、そちらが先に一致してしまう（実測：段ではなく
				   列の中を探していたので、他の開いているものが1つも見つからず、
				   2つ開いたままになった）。id がちょうど SF-row+数字 のものまで登る。 */
				var row = title.parentNode;
				while (row && row.nodeType === 1 && !/^SF-row\d+$/.test(row.id || '')) {
					row = row.parentNode;
				}
				if (!row || row.nodeType !== 1) { return; }
				setTimeout(function () {
					if (title.className.indexOf('js-opcls-open') < 0) { return; }
					var others = row.querySelectorAll('.js-opcls-open');
					closing = true;
					try {
						Array.prototype.forEach.call(others, function (o) {
							if (o !== title) { o.click(); }
						});
					} finally { closing = false; }
				}, 0);
			});

			/* 開いたか閉じたかは csLibrary が付け外しする class でしか分からない。
			   class の変化を見て aria-expanded を合わせる。
			   MutationObserver が無い環境では click のあとに読み直す。 */
			function sync() {
				title.setAttribute('aria-expanded',
					title.className.indexOf('js-opcls-open') >= 0 ? 'true' : 'false');
			}
			if (window.MutationObserver) {
				new MutationObserver(sync).observe(title,
					{ attributes: true, attributeFilter: ['class'] });
			} else {
				title.addEventListener('click', function () { setTimeout(sync, 250); });
			}
			sync();
		});
	}

	/* csLibrary より後でも先でもよい。属性を足すだけで、
	   向こうの初期化と喧嘩しない。 */
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}());
