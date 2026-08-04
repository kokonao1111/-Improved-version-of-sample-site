/* =====================================================================
   Louise Rever ― 出現
   ---------------------------------------------------------------------
   規範：何も動かさない。線が引かれ、面が満ちるだけ。

   「下からふわっと上がってくる」は現在のwebで最も配備された効果なので
   使わない。translate も scale も rotate も、文字にも写真にも当てない。
   この意匠は影も角丸も重なりも持たない＝奥行きを主張しない宣言なので、
   出現が奥行きを匂わせた時点で語彙が壊れる。

   ■ 仕組み
   状態を属性で切り替えず、CSS アニメーションを1度だけ走らせる。
   JS がやるのは <html> に .lr-anim を付けることと、
   要素ごとの --lr-d（開始までの間）を書くことだけ。

   ■ 内容が消えない設計
   animation-fill-mode: both なので、走り終えれば必ず不透明で止まる。
   途中で何が起きても「透明のまま残る」状態を作れない。
     ・JS が落ちる    → .lr-anim が付かない → 全部最初から見える
     ・reduced-motion → 同上
   （index.html の .slides > li{display:none} が no-js でヒーローを
     空白にしているのと同じ事故を繰り返さない）
   ===================================================================== */
(function () {
	'use strict';

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

	function run() {
		var rules = document.querySelectorAll('.kome_line, .lr-book-h');
		var fills = document.querySelectorAll(
			'#SF-contents .thumbnailList > li, .lr-nav3-list > li, .lr-book-row > a, ' +
			'#SF-startPage .SF-block-normal, .lr-cal-wrap, ' +
			'#SF-contents .newslistHeadlineStyle, #SF-contents .headlineStyle');

		if (!rules.length && !fills.length) { return; }

		document.documentElement.className += ' lr-anim';

		/* 間は 100ms 刻み。操作への返事 200ms のちょうど半分で、
		   「返事の半分の間隔で次が続く」。新しい数を作らない。
		   6つ目で頭打ちにする。順に出るのが「演出」に見え始める境目。 */
		function stagger(list) {
			Array.prototype.forEach.call(list, function (el, i) {
				el.style.setProperty('--lr-d', Math.min(i, 5) * 100 + 'ms');
			});
		}
		Array.prototype.forEach.call(rules, function (el) { el.setAttribute('data-lr', 'rule'); });
		Array.prototype.forEach.call(fills, function (el) { el.setAttribute('data-lr', 'fill'); });
		stagger(rules);
		stagger(fills);

		/* 安全網。アニメーションは最長でも 500ms の間 + 500ms なので、
		   3秒後には必ず終わっている。その時点で面の指定を外す。
		   外すと lr-fill が当たらなくなり、要素は本来の不透明度（＝1）に戻る。
		   何かの理由で走らなかったものがあっても、ここで必ず見える状態になる。
		   線（罫）は装飾なので触らず、そのまま残す。 */
		window.setTimeout(function () {
			Array.prototype.forEach.call(fills, function (el) {
				el.removeAttribute('data-lr');
			});
		}, 3000);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else { run(); }
}());
