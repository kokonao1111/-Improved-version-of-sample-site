/* =====================================================================
   CALDINA ― 携帯のメニュー（開閉）
   ---------------------------------------------------------------------
   携帯では8項目を2列×4段で常に開いていた。画面の3割を占めるうえ、
   下へ進むともう届かない。50pxの帯を1本だけ画面上端に残し、
   押したときに項目を出す形にした。

   ■ 壊れない作り
   ・畳むのは CSS が html.lr-js を見て決める。その印は <head> の最後で
     付けているので、開いた一覧が一瞬見える事故が起きない。
   ・このファイルが読み込まれなくても、印は付いているので畳まれたまま
     ボタンが効かない…のを避けるため、押す仕掛けが用意できたことを
     data-lr-nav="ready" で宣言し、CSS はそれを見て初めて畳む。
     つまり JS が落ちれば従来の一覧表示に戻るだけ。
   ・開閉の状態は aria-expanded だけが持つ。CSS はそれを見て描く。
     状態を2箇所に持たない。
   ===================================================================== */
(function () {
	'use strict';

	var MOBILE = 640;

	function ready() {
		var btn = document.querySelector('.lr-navb');
		var list = document.getElementById('lr-navlist');
		if (!btn || !list) { return; }

		/* ここまで来て初めて「畳んでよい」と宣言する */
		document.documentElement.setAttribute('data-lr-nav', 'ready');

		function set(open) {
			btn.setAttribute('aria-expanded', open ? 'true' : 'false');
		}
		function isOpen() {
			return btn.getAttribute('aria-expanded') === 'true';
		}

		btn.addEventListener('click', function () { set(!isOpen()); });

		/* Esc で閉じる。開けたまま戻れないのは操作として行き止まりになる */
		document.addEventListener('keydown', function (e) {
			if ((e.key === 'Escape' || e.keyCode === 27) && isOpen()) {
				set(false);
				btn.focus();
			}
		});

		/* 同じページ内の見出しへ飛ぶ場合は、開いたままだと飛んだ先が隠れる */
		list.addEventListener('click', function (e) {
			var a = e.target.closest ? e.target.closest('a') : null;
			if (a) { set(false); }
		});

		/* 画面を広げたときに「閉じている」状態が残ると、
		   PCの横並びに戻ったのに項目が消えたように見える */
		var wide = window.matchMedia('(min-width: ' + (MOBILE + 1) + 'px)');
		var onWide = function (m) { if (m.matches) { set(false); } };
		if (wide.addEventListener) { wide.addEventListener('change', onWide); }
		else if (wide.addListener) { wide.addListener(onWide); }
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', ready);
	} else { ready(); }
}());
