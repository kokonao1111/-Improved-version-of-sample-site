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

	/* 希望日を「打った形のまま受け取って、こちらで揃える」
	   ------------------------------------------------------------------
	   検証の型が "none"（空欄かどうかだけ）なので、`1222222222` でも
	   `あとで連絡します` でも通っていた。完全予約制の店で、日付が
	   読み取れないまま届くと、折り返して聞き直す手間が必ず出る。

	   ■ 書式を1つに決めさせない
	   「2026/08/22 と 20260822 のどちらで受けるか」を決めてもらう案も
	   あったが、**決めても人はその通りには打たない。** 案内に
	   「例）2026/08/22」と出ていても、8/22 と打つ人、8月22日と打つ人、
	   2026-8-22 と打つ人が必ず出る。書式を1つに絞ると、
	   正しい日付を打った人まではじくことになる。

	   受け取る側を広くして、出す側を1つにする。
	     2026/08/22  2026-8-22  2026.8.22  20260822
	     8/22  8月22日  2026年8月22日        → すべて 2026/08/22 に直す

	   ■ 年が無いときは「これから来る方」に寄せる
	   8/22 とだけ打たれたら、今日より後になる年を選ぶ。予約なので
	   過去の日付は意図されていない。

	   ■ 読み取れないものだけ止める
	   カレンダーに無い日（2026/02/30）と、過去の日付も止める。
	   知らせは欄の下の一行（.lr-hint-date）に出す。**新しい部品を
	   足さない**ので、Spry の検証表示と喧嘩しない。
	   ------------------------------------------------------------------ */
	var DATE_IDS = ['value_text_18', 'value_text_30'];

	function parseDate(raw) {
		var s = String(raw)
			.replace(/[０-９]/g, function (c) {          // 全角の数字
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
			/* 今日より前になるなら来年 */
			if (new Date(y, mo - 1, d) < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
				y += 1;
			}
		} else {
			return null;
		}

		var dt = new Date(y, mo - 1, d);
		/* 2026/02/30 のようにカレンダーに無い日は、繰り上がって別の日になる */
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
				el.value = fmt(dt);      // ここで1つの形に揃える
				say('');
				return true;
			}

			el.addEventListener('blur', function () { check(false); });
			el.addEventListener('input', function () { if (hint) { say(''); } });
			el.setAttribute('data-lr-date', '1');
		});

		/* 送るときにも見る。読み取れなければ、その欄まで画面を送って止める。 */
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

	/* 送信を押したのに、画面が動かない
	   ------------------------------------------------------------------
	   必須が空のまま「入力内容確認」を押すと、Spry は各欄の脇に
	   エラーを出すが、**画面は1pxも動かない**。実測すると、7つの必須欄は
	   すべて y=958 以下（押した時点の表示より下）にあり、押した人からは
	   「ボタンが壊れている」としか見えない。予約の直前で取りこぼす形。

	   ■ Spry は書き換えない
	   生成物なので作り直すと戻る。**印が付いた後に読む**だけにする。
	   Spry は無効な欄の器（fieldset）に ***RequiredState / ***InvalidState を
	   足す。押した直後にそれを探して、いちばん上のものへ送る。

	   ■ 送信自体は止めない
	   止めるのは Spry の仕事で、こちらは画面を動かすだけ。
	   万一 Spry が動かない環境でも、余計なことをしない。 */
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

			/* 画面上の位置ではなく、頁の中の位置で「いちばん上」を選ぶ */
			var top = null, ty = Infinity;
			Array.prototype.forEach.call(bad, function (e) {
				var r = e.getBoundingClientRect();
				if (!r.height) { return; }
				var y = r.top + (window.pageYOffset || document.documentElement.scrollTop || 0);
				if (y < ty) { ty = y; top = e; }
			});
			if (!top) { return; }

			/* 見出しや案内も一緒に見えるよう、少し上に余裕を取る */
			var y = Math.max(0, ty - 120);
			/* なめらかに動かさない。理由は2つある。
			   ① これは飾りではなく、間違いからの復帰。待たせずに着く方が親切。
			   ② **こちらで検証できない。** ヘッドレスの仮想時間では
			      なめらかスクロールが進まず、直ったかどうかを測れない。
			      測れないものを入れて「直りました」と言う失敗を、
			      この仕事で既に2度している。 */
			window.scrollTo(0, y);

			var input = top.querySelector('input,select,textarea');
			if (input && !input.disabled) { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }
		}

		/* Spry が印を付け終えてから読む。押した直後は、まだ付いていない。 */
		btn.addEventListener('click', function () { setTimeout(look, 60); });
		form.addEventListener('submit', function () { setTimeout(look, 60); });
	}

	/* 電話番号とふりがな ― 打った形を受けて整える
	   ------------------------------------------------------------------
	   どちらも検証の型が "none"（空欄かどうかだけ）。案内に
	   「例)000-000-0000」「例)やまだ はなこ」と出ていても、
	   `あとで連絡します` でも `山田花子` でも通っていた。
	   完全予約制の店で、折り返す手段が電話番号しか無いのに、
	   誤りが混ざると予約が成立しない。

	   ■ 日付と同じ考え方
	   受け取る側を広くして、出す側を1つにする。人は案内どおりには打たない。

	     電話　０９０−１２３４−５６７８ ／ 090 1234 5678 ／ +81 90-1234-5678
	           → いずれも受ける。**ハイフンの位置は勝手に変えない**
	             （市外局番は2〜5桁で一定でなく、機械が付けると間違える）
	     かな　ヤマダ ハナコ（カタカナ）→ やまだ はなこ に直す
	           全角の空白 → 半角ひとつに

	   ■ 止めるもの
	     電話　数字が10桁または11桁でない／0で始まらない
	     かな　ひらがな以外が混ざっている（漢字・英字）

	   知らせは、日付と同じく欄の下の案内行を書き換えて出す。
	   新しい部品を足さないので、Spry の表示と場所が重ならない。
	   ------------------------------------------------------------------ */
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
		/* ハイフンは打たれたものを残す。無ければ数字のまま。
		   市外局番の桁は地域で違うので、こちらで区切らない。 */
		return /-/.test(t) ? t : d;
	}

	/* 半角カタカナ（ﾔﾏﾀﾞ）も受ける。iPhone でも打てる文字なので、
	   弾くと正しく名乗った人をはじくことになる。濁点・半濁点は
	   後ろに独立して来るので、先に一文字へ合成してから直す。 */
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
		/* カタカナで打たれたら、ひらがなに直す */
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
