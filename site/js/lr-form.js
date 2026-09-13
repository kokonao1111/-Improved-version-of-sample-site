/* 予約フォーム：?menu=&note= の引き継ぎ、同意の門、希望日・電話・かなの整形、最初の誤りへ移動 */
(function () {
	'use strict';

	function param(name) {
		var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
		if (!m) { return null; }
		try { return decodeURIComponent(m[1].replace(/\+/g, ' ')); }
		catch (e) { return null; }
	}

	function hintDates() {
		var d = new Date();
		d.setDate(d.getDate() + 7);
		var s = d.getFullYear() + '/' +
			('0' + (d.getMonth() + 1)).slice(-2) + '/' +
			('0' + d.getDate()).slice(-2);

		Array.prototype.forEach.call(
			document.querySelectorAll('.lr-hint-date'),
			function (el) { el.textContent = '例）' + s; });
	}

	var DATE_IDS = ['value_text_18', 'value_text_30'];

	function parseDate(raw) {
		var s = String(raw)
			.replace(/[０-９]/g, function (c) {
				return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
			})
			.replace(/\s+/g, '')
			.replace(/[年月]/g, '/')
			.replace(/日$/, '')
			.replace(/[.\-]/g, '/');
		var y, mo, d, m;

		if ((m = /^(\d{4})\/(\d{1,2})\/(\d{1,2})\/?$/.exec(s))) {
			y = +m[1]; mo = +m[2]; d = +m[3];
		} else if ((m = /^(\d{4})(\d{2})(\d{2})$/.exec(s))) {
			y = +m[1]; mo = +m[2]; d = +m[3];
		} else if ((m = /^(\d{1,2})\/(\d{1,2})\/?$/.exec(s))) {
			mo = +m[1]; d = +m[2];
			var now = new Date();
			y = now.getFullYear();

			if (new Date(y, mo - 1, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
				y += 1;
			}
		} else {
			return null;
		}

		var dt = new Date(y, mo - 1, d);

		if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) {
			return null;
		}
		return dt;
	}

	function fmt(dt) {
		return dt.getFullYear() + '/' +
			('0' + (dt.getMonth() + 1)).slice(-2) + '/' +
			('0' + dt.getDate()).slice(-2);
	}

	function dateFields() {
		var form = document.getElementById('SF-contact');
		if (!form) { return; }

		DATE_IDS.forEach(function (id) {
			var el = document.getElementById(id);
			if (!el) { return; }
			var hint = el.closest ? el.closest('fieldset') : null;
			hint = hint ? hint.querySelector('.lr-hint-date') : null;
			var base = hint ? hint.textContent : '';

			function say(msg) {
				if (!hint) { return; }
				hint.textContent = msg || base;
				hint.setAttribute('data-lr-bad', msg ? '1' : '');
			}

			function check(quiet) {
				var v = el.value.replace(/^\s+|\s+$/g, '');
				if (!v) { say(''); return true; }
				var dt = parseDate(v);
				if (!dt) {
					if (!quiet) { say('日付として読み取れません。例）' + fmt(plusDays(7))); }
					return false;
				}
				var today = new Date();
				today.setHours(0, 0, 0, 0);
				if (dt < today) {
					if (!quiet) { say('過ぎた日付です。例）' + fmt(plusDays(7))); }
					return false;
				}
				el.value = fmt(dt);
				say('');
				return true;
			}

			el.addEventListener('blur', function () { check(false); });
			el.addEventListener('input', function () { if (hint) { say(''); } });
			el.setAttribute('data-lr-date', '1');
		});

		form.addEventListener('submit', function (e) {
			for (var i = 0; i < DATE_IDS.length; i++) {
				var el = document.getElementById(DATE_IDS[i]);
				if (!el || !el.getAttribute('data-lr-date')) { continue; }
				var v = el.value.replace(/^\s+|\s+$/g, '');
				if (!v) { continue; }
				var dt = parseDate(v);
				var today = new Date(); today.setHours(0, 0, 0, 0);
				if (!dt || dt < today) {
					e.preventDefault();
					e.stopImmediatePropagation();
					el.scrollIntoView({ block: 'center' });
					el.focus();
					el.dispatchEvent(new Event('blur'));
					return;
				}
				el.value = fmt(dt);
			}
		}, true);
	}

	function plusDays(n) {
		var d = new Date();
		d.setDate(d.getDate() + n);
		return d;
	}

	function run() {
		var form = document.getElementById('SF-contact');
		if (!form) { return; }

		hintDates();
		dateFields();

		var menu = param('menu');
		var note = param('note');
		if (!menu && !note) { return; }

		var picked = [];

		if (menu) {
			menu.split(',').forEach(function (id) {
				id = id.replace(/^\s+|\s+$/g, '');
				if (!id) { return; }
				var el = document.getElementById(id);
				if (!el || (el.type !== 'checkbox' && el.type !== 'radio')) { return; }
				el.checked = true;

				var lab = document.querySelector('label[for="' + id + '"]');
				var txt = lab ? lab.textContent : el.value;
				if (txt) { picked.push(txt.replace(/^\s+|\s+$/g, '')); }
			});
		}

		if (note) {
			var ta = document.getElementById('value_text_area_42');
			if (ta) {
				var cur = ta.value.replace(/^\s+|\s+$/g, '');
				ta.value = cur ? cur + '\n' + note : note;
				picked.push(note);
			}
		}

		if (!picked.length) { return; }

		var seen = {};
		var shown = [];
		picked.forEach(function (x) {
			if (x === '新規予約') { return; }
			var k = x.replace(/[\s　]+/g, '');
			if (!k || seen[k]) { return; }
			seen[k] = 1;
			shown.push(x);
		});
		if (!shown.length) { return; }

		var box = document.createElement('p');
		box.className = 'lr-from';
		box.setAttribute('role', 'status');
		box.innerHTML = '<span class="lr-from-t">お申し込み</span>' +
			'<span class="lr-from-v"></span>';
		box.querySelector('.lr-from-v').textContent = shown.join('／');
		form.insertBefore(box, form.firstChild);
	}

	function gate() {
		var box = document.getElementById('lr-agree-check');
		var btn = document.querySelector('.lr-submit');
		if (!box || !btn) { return; }

		function sync() { btn.disabled = !box.checked; }

		box.addEventListener('change', sync);

		var form = box.form || document.querySelector('form');
		if (form) {
			form.addEventListener('reset', function () { setTimeout(sync, 0); });
		}

		sync();
	}

	function scrollToFirstError() {
		var form = document.getElementById('SF-contact');
		if (!form) { return; }
		var btn = form.querySelector('.lr-submit');
		if (!btn) { return; }

		function look() {
			var bad = form.querySelectorAll(
				'[class*="RequiredState"],[class*="InvalidState"],' +
				'[class*="MinCharsState"],[class*="MaxCharsState"],' +
				'[class*="MinSelectionsState"],[class*="MaxSelectionsState"]');
			if (!bad.length) { return; }

			var top = null, ty = Infinity;
			Array.prototype.forEach.call(bad, function (e) {
				var r = e.getBoundingClientRect();
				if (!r.height) { return; }
				var y = r.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
				if (y < ty) { ty = y; top = e; }
			});
			if (!top) { return; }

			var y = Math.max(0, ty - 120);

			window.scrollTo(0, y);

			var input = top.querySelector('input,select,textarea');
			if (input && !input.disabled) { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }
		}

		btn.addEventListener('click', function () { setTimeout(look, 60); });
		form.addEventListener('submit', function () { setTimeout(look, 60); });
	}

	function zen2han(t) {
		return String(t).replace(/[！-～]/g, function (c) {
			return String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
		}).replace(/\u3000/g, ' ');
	}

	function normTel(raw) {
		var t = zen2han(raw).replace(/[−ー―‐]/g, '-').replace(/\s+/g, '');
		if (/^\+81/.test(t)) { t = '0' + t.slice(3).replace(/^-/, ''); }
		var d = t.replace(/[^0-9]/g, '');
		if (!/^0\d{9,10}$/.test(d)) { return null; }

		return /-/.test(t) ? t : d;
	}

	var HAN_KANA = {
		'ｱ':'ア','ｲ':'イ','ｳ':'ウ','ｴ':'エ','ｵ':'オ','ｶ':'カ','ｷ':'キ','ｸ':'ク','ｹ':'ケ','ｺ':'コ',
		'ｻ':'サ','ｼ':'シ','ｽ':'ス','ｾ':'セ','ｿ':'ソ','ﾀ':'タ','ﾁ':'チ','ﾂ':'ツ','ﾃ':'テ','ﾄ':'ト',
		'ﾅ':'ナ','ﾆ':'ニ','ﾇ':'ヌ','ﾈ':'ネ','ﾉ':'ノ','ﾊ':'ハ','ﾋ':'ヒ','ﾌ':'フ','ﾍ':'ヘ','ﾎ':'ホ',
		'ﾏ':'マ','ﾐ':'ミ','ﾑ':'ム','ﾒ':'メ','ﾓ':'モ','ﾔ':'ヤ','ﾕ':'ユ','ﾖ':'ヨ',
		'ﾗ':'ラ','ﾘ':'リ','ﾙ':'ル','ﾚ':'レ','ﾛ':'ロ','ﾜ':'ワ','ｦ':'ヲ','ﾝ':'ン',
		'ｧ':'ァ','ｨ':'ィ','ｩ':'ゥ','ｪ':'ェ','ｫ':'ォ','ｬ':'ャ','ｭ':'ュ','ｮ':'ョ','ｯ':'ッ','ｰ':'ー'
	};

	function han2zenKana(t) {
		return String(t).replace(/([\uFF61-\uFF9F])([ﾞﾟ]?)/g, function (m0, c, mark) {
			var base = HAN_KANA[c];
			if (!base) { return m0; }
			if (!mark) { return base; }
			var comp = base.charCodeAt(0) + (mark === 'ﾞ' ? 1 : 2);
			return String.fromCharCode(comp);
		});
	}

	function normKana(raw) {
		var t = han2zenKana(String(raw));
		t = zen2han(t).replace(/\s+/g, ' ').replace(/^ | $/g, '');

		t = t.replace(/[\u30A1-\u30F6]/g, function (c) {
			return String.fromCharCode(c.charCodeAt(0) - 0x60);
		});
		if (!t) { return ''; }
		if (!/^[\u3041-\u3096ー 　]+$/.test(t)) { return null; }
		return t;
	}

	function textFields() {
		var form = document.getElementById('SF-contact');
		if (!form) { return; }

		[{ id: 'value_tel_no_05', fn: normTel,
		   ng: '電話番号として読み取れません。市外局番から続けてご記入ください。' },
		 { id: 'value_text_04', fn: normKana,
		   ng: 'ひらがなでご記入ください。' }].forEach(function (spec) {
			var el = document.getElementById(spec.id);
			if (!el) { return; }
			var fs = el.closest ? el.closest('fieldset') : null;
			var hint = fs ? fs.querySelector('.control2') : null;
			var base = hint ? hint.textContent : '';

			function say(msg) {
				if (!hint) { return; }
				hint.textContent = msg || base;
				hint.setAttribute('data-lr-bad', msg ? '1' : '');
			}

			el.addEventListener('blur', function () {
				var v = el.value.replace(/^\s+|\s+$/g, '');
				if (!v) { say(''); return; }
				var out = spec.fn(v);
				if (out === null) { say(spec.ng); return; }
				el.value = out;
				say('');
			});
			el.addEventListener('input', function () { say(''); });
		});
	}

	function boot() { run(); gate(); scrollToFirstError(); textFields(); }

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else { boot(); }
}());
