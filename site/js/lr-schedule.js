/* =====================================================================
   CALDINA ― 営業日カレンダー
   ---------------------------------------------------------------------
   定休日はサロンが公表している規則（月曜日／第１・第３日曜日）から
   その場で算出する。原稿を書き換える運用が発生しないため、
   ここに置いた情報は古くならない。
   （差し替え前は 2021 年で更新の止まったブログ RSS が入っていた）

   ・依存ライブラリなし
   ・JS が動かない環境では HTML 側の <noscript> が定休日を文言で伝える
   ===================================================================== */
(function () {
	'use strict';

	var WEEK = ['日', '月', '火', '水', '木', '金', '土'];
	var MONTHS_SHOWN = 2;   // 今月と翌月

	/* 定休日：毎週月曜日 ＋ 第１・第３日曜日 */
	function isClosed(d) {
		var day = d.getDay();
		if (day === 1) { return true; }
		if (day === 0) {
			var nth = Math.floor((d.getDate() - 1) / 7) + 1;
			return nth === 1 || nth === 3;
		}
		return false;
	}

	function buildMonth(year, month, today) {
		var lastDate = new Date(year, month + 1, 0).getDate();
		var lead     = new Date(year, month, 1).getDay();
		var h = [];

		h.push('<table class="lr-cal">');
		h.push('<caption class="lr-cal-cap">');
		h.push('<span class="lr-cal-year">' + year + '</span>');
		h.push('<span class="lr-cal-month">' + (month + 1) + '<small>月</small></span>');
		h.push('</caption>');

		h.push('<thead><tr>');
		for (var w = 0; w < 7; w++) {
			h.push('<th scope="col">' + WEEK[w] + '</th>');
		}
		h.push('</tr></thead><tbody><tr>');

		for (var i = 0; i < lead; i++) { h.push('<td class="lr-cal-pad"></td>'); }

		for (var date = 1; date <= lastDate; date++) {
			var d = new Date(year, month, date);
			var cls = [], label = '';
			if (isClosed(d)) {
				cls.push('is-closed');
				label = '<span class="lr-sr">定休日</span>';
			}
			if (today && d.getTime() === today.getTime()) { cls.push('is-today'); }

			h.push('<td' + (cls.length ? ' class="' + cls.join(' ') + '"' : '') + '>');
			h.push('<span class="lr-cal-d">' + date + '</span>' + label + '</td>');

			if (d.getDay() === 6 && date < lastDate) { h.push('</tr><tr>'); }
		}

		var tail = (7 - ((lead + lastDate) % 7)) % 7;
		for (var j = 0; j < tail; j++) { h.push('<td class="lr-cal-pad"></td>'); }

		h.push('</tr></tbody></table>');
		return h.join('');
	}

	function render() {
		var roots = document.querySelectorAll('.lr-schedule');
		if (!roots.length) { return; }

		var now = new Date();
		var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		var out = '';
		for (var i = 0; i < MONTHS_SHOWN; i++) {
			var m = new Date(now.getFullYear(), now.getMonth() + i, 1);
			out += '<div class="lr-cal-wrap">' + buildMonth(m.getFullYear(), m.getMonth(), today) + '</div>';
		}

		for (var k = 0; k < roots.length; k++) {
			if (roots[k].getAttribute('data-rendered')) { continue; }
			roots[k].innerHTML = out;
			roots[k].setAttribute('data-rendered', '1');
		}
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', render);
	} else {
		render();
	}
	/* jQuery Mobile 経由で表示された場合にも描画する（SP版） */
	document.addEventListener('pageshow', render, false);
}());
