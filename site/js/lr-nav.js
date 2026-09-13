/* 携帯のメニュー。畳むかは html[data-lr-nav="ready"] を CSS が見て決める。状態は aria-expanded だけが持つ */
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

			if (e.key === 'Tab' || e.keyCode === 9) {
				var f = links();
				if (!f.length) { return; }
				f.push(btn);
				var i = f.indexOf(document.activeElement);
				var last = f.length - 1;
				if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[last].focus(); }
				else if (!e.shiftKey && i === last) { e.preventDefault(); f[0].focus(); }
			}
		});

		var wide = window.matchMedia('(min-width: ' + (MOBILE + 1) + 'px)');
		var onWide = function (m) { if (m.matches) { set(false); } };
		if (wide.addEventListener) { wide.addEventListener('change', onWide); }
		else if (wide.addListener) { wide.addListener(onWide); }
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', ready);
	} else { ready(); }
}());
