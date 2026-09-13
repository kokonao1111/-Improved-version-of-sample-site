/* 開閉見出しをキーボードでも。開閉は csLibrary に任せ、属性と鍵操作だけ足す */
(function () {
	'use strict';

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

			title.addEventListener('keydown', function (e) {
				var k = e.key || e.keyCode;
				if (k === 'Enter' || k === 13 || k === ' ' || k === 'Spacebar' || k === 32) {
					e.preventDefault();
					title.click();
				}
			});

			title.addEventListener('click', function () {
				/* 他を閉じる click が自分を閉じ返すのを止める */
				if (closing) { return; }

				/* id に空白を含む入れ物があるので closest は使わず SF-row+数字 まで登る */
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

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
}());
