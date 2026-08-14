/* =====================================================================
   CALDINA ― 表示前の幕
   ---------------------------------------------------------------------
   回るアイコンは出さない。紋章と店の一句を一度だけ見せて、静かに引く。
   出るのは**そのセッションで最初の1ページだけ**。

   ■ 絶対に閉じ込めない（3段構え）
   1. 幕が出るのは html.lr-pre-on のときだけ。
      その印は head のインライン1行が sessionStorage を見て付ける。
      JSが読まれない環境では**出ない**（＝閉じ込めようがない）
   2. head の中の1行が 4200ms で必ず lr-pre-done を付ける。
      このファイルが読めなくても幕は上がる（インラインなので読み込み失敗が無い）
   3. このファイルは読み込み完了で早めに上げるだけ。最短 2600ms は見せる
      （一瞬だけ光って消えるのが一番みっともない）

   ■ prefers-reduced-motion
   CSS側は最終状態の静止画になる。静止画を2.6秒見せるのは長いので、
   こちらでも最短を 1100ms に落とす。
   ===================================================================== */
(function () {
	'use strict';

	/* 幕が出ていないときは何もしない。
	   幕は**セッションで最初の1ページだけ**出る（head の1行が
	   sessionStorage を見て lr-pre-on を付ける／付けない を決める）。
	   ここで確かめずに lr-pre-done を付けると、2ページ目以降でも
	   消える側の指定だけが走る。実害は無いが、状態の出どころが2つになる。 */
	if (!/(^|\s)lr-pre-on(\s|$)/.test(document.documentElement.className)) { return; }

	/* 幕の中の最後の動きは「句を挟む罫」で、1900ms に始まり 500ms かけて
	   引かれる（＝2400ms で引き終わる）。そこから 200ms（--lr-t）置く。
	   これより短くすると、罫が引き終わる前に幕が上がる。 */
	var MIN = 2600;

	/* 動きを嫌う人には、静止した完成形を2.6秒見せることになる。
	   それは長い。既にある短い方の数（1100ms）に落とす。
	   幕の中身は CSS 側で最初から最終状態なので、見えるものは変わらない。 */
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
