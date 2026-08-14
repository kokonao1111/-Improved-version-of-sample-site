/* =====================================================================
   CALDINA ― 申込内容を引き継ぐ
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


	/* 日付欄の例を「今日から1週間後」で入れる。
	   もとは「例） 2019/05/20」と固定で書かれていて、7年前の日付が
	   案内として出ていた。ここで入れれば古くならない。 */
	function hintDates() {
		var d = new Date();
		d.setDate(d.getDate() + 7);
		var s = d.getFullYear() + '/' +
			('0' + (d.getMonth() + 1)).slice(-2) + '/' +
			('0' + d.getDate()).slice(-2);
		/* 欄の中には何も入れない。
		   入れると「例）」の案内と同じ日付が2箇所に出るうえ、
		   薄い字でも入力済みに見えてしまう（実際にそう見えたという指摘を受けた）。
		   案内は欄の下の一行だけにする。 */
		Array.prototype.forEach.call(
			document.querySelectorAll('.lr-hint-date'),
			function (el) { el.textContent = '例）' + s; });
	}

	function run() {
		var form = document.getElementById('SF-contact');
		if (!form) { return; }

		hintDates();

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
				/* ここで change を発火させてはいけない。
				   Spry の検証ウィジェットは validateOn:["change"] でフォームに
				   ぶら下がっているので、1つ発火させると全項目が検証され、
				   開いた瞬間に全部が「検証OK（緑地＋チェック）」になってしまう。
				   印を入れるだけで送信内容は正しく入るので、通知は不要。 */
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
		   予約種別（新規予約）はどの入口からでも同じなので読み上げから省く。

		   同じ品名が menu= の選択肢ラベルと note= の両方から入るので、
		   そのまま並べると「シミ・美白 ケア／シミ・美白 ケア」と二重に出る。
		   全角と半角のスペースが混ざるため、空白を無視して重複を落とす。 */
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

	/* 同意を通さないと送信できないようにする。
	   ------------------------------------------------------------------
	   ■ ここで止める理由
	   HTML の required は使えない。このフォームの送信は
	   javascript:TW_confirm(...) で横取りされていて、
	   ブラウザの検証が走らないまま確認画面へ進む。

	   ■ 壊れない作り
	   ・印か送信ボタンのどちらかが見つからなければ、何もせずに帰る
	   ・JSが読まれなければボタンは押せるまま。送れなくなる方が害が大きい
	   ・状態は checkbox の checked だけが持つ。二重に持たない
	   ・ページを戻ってきたときのために、読み込み時にも今の状態を反映する
	     （Firefox などは checked を復元するので、押せない見た目のまま
	       印だけ入っている食い違いが起きる） */
	function gate() {
		var box = document.getElementById('lr-agree-check');
		var btn = document.querySelector('.lr-submit');
		if (!box || !btn) { return; }

		function sync() { btn.disabled = !box.checked; }

		box.addEventListener('change', sync);

		/* ★ 「入力内容をすべて消去」で穴が開いていた
		   隣にある <input type="reset"> を押すと、同意の印は外れるのに
		   **change イベントは起きない**（reset は既定値へ戻すだけで、
		   利用者が触った扱いにならない）。change しか見ていなかったので
		   送信ボタンは有効なまま残り、画面は「未同意」なのに先へ進めた。
		   同意を取る関門が、隣のボタン1つで無効になっていた。

		   reset は「戻す前」に発火するので、戻り終えてから読み直す。 */
		var form = box.form || document.querySelector('form');
		if (form) {
			form.addEventListener('reset', function () { setTimeout(sync, 0); });
		}

		sync();
	}

	function boot() { run(); gate(); }

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', boot);
	} else { boot(); }
}());
