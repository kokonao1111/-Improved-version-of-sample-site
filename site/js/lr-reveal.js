/* =====================================================================
   Louise Rever ― 線を引く
   ---------------------------------------------------------------------
   規範：何も動かさない。線が引かれるだけ。

   「下からふわっと上がってくる」は現在のwebで最も配備された効果なので
   使わない。translate も scale も rotate も、文字にも写真にも当てない。
   この店の意匠は影も角丸も重なりも持たない＝奥行きを主張しない宣言なので、
   出現が奥行きを匂わせた時点で語彙が壊れる。

   動くのは1つだけ。見出しを挟む金のヘアラインが、外へ向かって引かれる。
   これはこの店の署名そのもの（.kome_line の :before/:after は
   left:0 / right:0 に固定された幅40%の罫で、幾何が既に向きを持っている）。
   与えるのは、その向きに時間だけ。

   ■ 安全のための設計
   ・動かすのは ::before / ::after の装飾罫だけ。本文・写真・価格の
     不透明度には一切触れない。内容が消える経路が構造的に存在しない。
   ・スクロール検出をしない。IntersectionObserver も rAF も使わない。
     検出の失敗が「永久に見えない」に化ける経路を持たない。
   ・.lr-anim は JS だけが付ける。JS が落ちれば罫は最初から引かれた状態。
   （index.html の .slides > li{display:none} が no-js でヒーローを
     空白にしているのと同じ事故を繰り返さない）
   ===================================================================== */
(function () {
	'use strict';

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	function run() {
		var rules = document.querySelectorAll('.kome_line, .lr-book-h');
		if (!rules.length) { return; }

		document.documentElement.className += ' lr-anim';

		/* 上から順に引く。間隔は 100ms ―― 操作への返事 200ms のちょうど半分で、
		   「返事の半分の間隔で次が続く」。新しい数を作らない。
		   6本目で頭打ちにする。順に引かれるのが「演出」に見え始める境目。 */
		Array.prototype.forEach.call(rules, function (el, i) {
			el.setAttribute('data-lr', 'rule');
			el.style.setProperty('--lr-d', Math.min(i, 5) * 100 + 'ms');
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else {
		run();
	}
}());
