/* 表示前の幕。セッション最初の1ページだけ。head の1行が 4200ms で必ず上げる */
(function () {
	'use strict';

	if (!/(^|\s)lr-pre-on(\s|$)/.test(document.documentElement.className)) { return; }

	var MIN = 2500;

	if (window.matchMedia &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		MIN = 1100;
	}
	var start = Date.now();

	function done() {
		document.documentElement.className += ' lr-pre-done';
	}

	function finish() {
		var wait = Math.max(0, MIN - (Date.now() - start));
		setTimeout(done, wait);
	}

	if (document.readyState === 'complete') { finish(); }
	else { window.addEventListener('load', finish); }
}());
