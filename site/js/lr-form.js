/* =====================================================================
   Louise Rever ― 申込内容を引き継ぐ
   ---------------------------------------------------------------------
   トライアル6品とキャンペーン2件から、それぞれ
     reservation.html?menu=<要素id>,<要素id>&note=<文言>
   の形で来る。ここでその項目に印を入れ、フォームの頭に
   「◯◯のお申し込み」を出す。

   ■ なぜ必要か
   改修前、トライアルの6品（￥4,400〜￥12,650）を見た客は、
   ページ末尾まで送ってから「このトライアルを申し込む」を押し、
   フォームで品名をもう一度探して選び直す必要があった。
   キャンペーン2件には個別の申込リンクが1本も無く、
   フォーム側の選択肢も「キャンペーン」の1個だけで、
   どちらを見て来たのかサロン側にも分からなかった。

   ■ 壊れない作り
   ・URLに何も付いていなければ何もしない
   ・指定されたidの要素が無ければ、その1つを黙って飛ばす
   ・チェックとラジオ以外には触らない
   ・note は既に書かれている内容を消さず、後ろに足すだけ
   JSが動かなくてもフォームは元のまま使える。引き継ぎが省かれるだけ。
   ===================================================================== */
(function () {
	'use strict';

	function param(name) {
		var m = new RegExp('[?&]' + name + '=([^&]*)').exec(location.search);
		if (!m) { return null; }
		try { return decodeURIComponent(m[1].replace(/\+/g, ' ')); }
		catch (e) { return null; }
	}

	function run() {
		var form = document.getElementById('SF-contact');
		if (!form) { return; }

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
				/* Spry の検証が拾えるように、変更を通知しておく */
				if (typeof Event === 'function') {
					el.dispatchEvent(new Event('change', { bubbles: true }));
				}
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

		/* 何を申し込もうとしているかを、フォームの頭で見えるようにする。
		   予約種別（新規予約）はどの入口からでも同じなので読み上げから省く。 */
		var shown = picked.filter(function (x) { return x !== '新規予約'; });
		if (!shown.length) { return; }

		var box = document.createElement('p');
		box.className = 'lr-from';
		box.setAttribute('role', 'status');
		box.innerHTML = '<span class="lr-from-t">お申し込み</span>' +
			'<span class="lr-from-v"></span>';
		box.querySelector('.lr-from-v').textContent = shown.join('／');
		form.insertBefore(box, form.firstChild);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else { run(); }
}());
