/* =====================================================================
   CALDINA ― 携帯のメニュー
   ---------------------------------------------------------------------
   押しボタンは左下に固定（右下の PAGE TOP と対）。
   押すと項目だけの面が画面全体に出る。本文は押し下げない。

   ■ 壊れない作り
   ・畳むのは CSS が html[data-lr-nav="ready"] を見て決める。
     この印はこのファイルが「押す仕掛けを用意できた」時に自分で付ける。
     読み込まれなければ印が付かず、従来の一覧表示のまま残る ―
     押せないボタンだけが残る行き止まりを作らないため。
   ・状態は aria-expanded だけが持つ。CSSはそれを見て描く。
     状態を2箇所に持たせると必ず食い違う。

   ■ 面が出ている間にやること（どれも省くと操作が壊れる）
   ・後ろを動かさない。位置を覚えて戻す（overflow:hidden だけだと
     iOS で先頭に飛ぶことがある）
   ・Esc と、面の中のリンクを押したときに閉じる
   ・Tab が後ろの本文へ抜けないよう、面の中で回す
   ・閉じたらボタンへ焦点を戻す
   ===================================================================== */
(function () {
	'use strict';

	var MOBILE = 640;
	var OPENCLS = 'lr-navopen';

	function ready() {
		var btn = document.querySelector('.lr-navb');
		var list = document.getElementById('lr-navlist');
		if (!btn || !list) { return; }

		var root = document.documentElement;
		var keptY = 0;

		/* ここまで来て初めて「畳んでよい」と宣言する */
		root.setAttribute('data-lr-nav', 'ready');

		function isOpen() { return btn.getAttribute('aria-expanded') === 'true'; }

		function links() {
			return Array.prototype.filter.call(
				list.querySelectorAll('a[href]'),
				function (a) { return a.offsetParent !== null; });
		}

		function set(open) {
			if (open === isOpen()) { return; }
			btn.setAttribute('aria-expanded', open ? 'true' : 'false');
			if (open) {
				keptY = window.pageYOffset || root.scrollTop || 0;
				root.classList.add(OPENCLS);
				var first = links()[0];
				if (first) { first.focus(); }
			} else {
				root.classList.remove(OPENCLS);
				window.scrollTo(0, keptY);
				btn.focus();
			}
		}

		btn.addEventListener('click', function () { set(!isOpen()); });

		/* 面の中のリンクを押したら閉じる。
		   同じページ内の見出しへ飛ぶ場合、開いたままだと飛んだ先が隠れる。 */
		list.addEventListener('click', function (e) {
			var t = e.target;
			while (t && t !== list && t.tagName !== 'A') { t = t.parentNode; }
			if (t && t.tagName === 'A') { set(false); }
		});

		document.addEventListener('keydown', function (e) {
			if (!isOpen()) { return; }

			if (e.key === 'Escape' || e.keyCode === 27) {
				set(false);
				return;
			}

			/* Tab を面の中で回す。後ろの本文へ抜けると、
			   見えていない要素に焦点が移って行方が分からなくなる。 */
			if (e.key === 'Tab' || e.keyCode === 9) {
				var f = links();
				if (!f.length) { return; }
				f.push(btn);                       /* 閉じるボタンも輪に入れる */
				var i = f.indexOf(document.activeElement);
				var last = f.length - 1;
				if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[last].focus(); }
				else if (!e.shiftKey && i === last) { e.preventDefault(); f[0].focus(); }
			}
		});

		/* 画面を広げたときに「開いている」状態が残ると、
		   PCの横並びに戻ったのに白い面が居座る。 */
		var wide = window.matchMedia('(min-width: ' + (MOBILE + 1) + 'px)');
		var onWide = function (m) { if (m.matches) { set(false); } };
		if (wide.addEventListener) { wide.addEventListener('change', onWide); }
		else if (wide.addListener) { wide.addListener(onWide); }
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', ready);
	} else { ready(); }
}());
