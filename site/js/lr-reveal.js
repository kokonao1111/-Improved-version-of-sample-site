/* 出現。線が引かれ、字が書かれ、面が満ちるだけ。translate / scale / rotate は使わない */
(function () {
	'use strict';

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

	var SEL_RULE = '.kome_line, .lr-book-h';

	var SEL_SHEET = '#SF-contents .thumbnailList > li, .lr-nav3-list > li, ' +
		'.lr-tiles > li, .lr-cal-wrap, #SF-contents li.SF-simpleImg, ' +

		'#SF-contents .lr-choice-img, #SF-contents .lr-choice-row > figure';

	var SEL_HEAD = '#SF-contents h2.headlineStyle';

	var SEL_NAME = '#SF-contents .newslistHeadlineStyle, #SF-contents .lr-choice-name';

	var SEL_ORN = '#B000000420, #B000000081, #B000000079, #B000000072, #B000000125, ' +
		'#B000000142, #B000000149, #B000000159, #B000000169, #B000000188';

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

		var names = list(SEL_NAME).filter(function (el) {
			return (el.textContent || '').replace(/\s/g, '') !== '';
		});
		var orns = list(SEL_ORN);

		if (!rules.length && !sheets.length && !heads.length &&
			!names.length && !orns.length) { return; }

		html.className += ' lr-anim';
		mark(rules, 'rule');

		if (!window.IntersectionObserver) { return; }
		if (!document.body) { return; }
		if (!usable(html)) { return; }

		var io = null;
		var targets = [];
		try {
			mark(sheets, 'sheet');
			mark(heads, 'head');
			mark(names, 'name');
			mark(orns, 'orn');
			targets = sheets.concat(heads, names, orns);

			io = new window.IntersectionObserver(seen, {
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

		var firstSweep = true;
		function sweep() {
			var h = window.innerHeight || document.documentElement.clientHeight || 0;
			if (!h) { return; }

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

		tick = window.setInterval(sweep, 500);
		sweep();
	}

	document.addEventListener('animationend', function (e) {
		if (!/^lr-(fill|write)$/.test(e.animationName)) { return; }
		var el = e.target;
		if (el && el.nodeType === 1 && el.hasAttribute && el.hasAttribute('data-lr')) {
			el.setAttribute('data-lr-done', '');
		}
	}, true);

	var PEN = 0.30, T_MIN = 1000, T_MAX = 1800;

	function mark(els, kind) {
		els.forEach(function (el) {
			el.setAttribute('data-lr', kind);
			if (SP) { return; }
			if (kind === 'sheet') {
				var n = 0;
				for (var s = el.previousElementSibling; s; s = s.previousElementSibling) { n++; }
				el.style.setProperty('--lr-d', (n < 5 ? n : 5) * 100 + 'ms');
				return;
			}
			if (kind === 'name') {
				var w = 0;
				try { w = el.getBoundingClientRect().width; } catch (e) { w = 0; }
				var d = Math.round(w / PEN / 100) * 100;
				if (d < T_MIN) { d = T_MIN; }
				if (d > T_MAX) { d = T_MAX; }
				el.style.setProperty('--lr-t-name', d + 'ms');
			}
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else { run(); }
}());
