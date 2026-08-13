/* =====================================================================
   CALDINA ― 表示前の幕
   ---------------------------------------------------------------------
   回るアイコンは出さない。紋章を一度だけ見せて、静かに引く。

   ■ 絶対に閉じ込めない（3段構え）
   1. 幕が出るのは html.lr-js のときだけ。JSが読まれない環境では**出ない**
   2. head の中の1行が 2600ms で必ず lr-pre-done を付ける。
      このファイルが読めなくても幕は上がる（インラインなので読み込み失敗が無い）
   3. このファイルは読み込み完了で早めに上げるだけ。最短 1100ms は見せる
      （一瞬だけ光って消えるのが一番みっともない）

   ■ prefers-reduced-motion
   罫を引く動きは止める。幕は出したまま、すぐ消えるだけにする。
   ===================================================================== */
(function () {
	'use strict';

	/* 罫は 120ms 待って 500ms かけて引かれる（＝620msで引き終わる）。
	   最短をそれより短くすると、線が引き終わる前に幕が上がってしまう。
	   引き終わってからひと呼吸置く長さにする。 */
	var MIN = 1100;
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
