/* =====================================================================
   Louise Rever ― 出現
   ---------------------------------------------------------------------
   規範：何も動かさない。線が引かれ、面が満ちるだけ。

   「下からふわっと上がってくる」は現在のwebで最も配備された効果なので
   使わない。translate も scale も rotate も、文字にも写真にも当てない。
   この意匠は影も角丸も重なりも持たない＝奥行きを主張しない宣言なので、
   出現が奥行きを匂わせた時点で語彙が壊れる。

   ■ 役割
   JS がするのは「どれを出現の対象にするか」を印で示すことだけ。
   いつ出すかは CSS が持つ（animation-timeline: view()）。
   進行はスクロール位置から一意に決まるので、途中で止まりようがない。

   ■ 内容が消えない設計
     ・JS が落ちる      → .lr-anim が付かない → 何も伏せられない
     ・reduced-motion  → 同上
     ・view() 非対応    → @supports の外なので伏せる指定自体が届かない
   どの経路でも「透明のまま残る」状態を作れない。
   ===================================================================== */
(function () {
	'use strict';

	if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { return; }

	var SEL_RULE = '.kome_line, .lr-book-h';
	var SEL_FILL = '#SF-contents .thumbnailList > li, .lr-nav3-list > li, .lr-book-row > a, ' +
		'#SF-startPage .SF-block-normal, .lr-cal-wrap, .lr-tiles > li, ' +
		'#SF-contents .newslistHeadlineStyle, #SF-contents .headlineStyle';

	function run() {
		var rules = document.querySelectorAll(SEL_RULE);
		var fills = document.querySelectorAll(SEL_FILL);
		if (!rules.length && !fills.length) { return; }

		document.documentElement.className += ' lr-anim';

		/* 間は 100ms 刻み。操作への返事 200ms のちょうど半分で、
		   「返事の半分の間隔で次が続く」。新しい数を作らない。
		   6つ目で頭打ちにする。順に出るのが「演出」に見え始める境目。 */
		function mark(list, kind) {
			Array.prototype.forEach.call(list, function (el, i) {
				el.setAttribute('data-lr', kind);
				el.style.setProperty('--lr-d', Math.min(i, 5) * 100 + 'ms');
			});
		}
		mark(rules, 'rule');
		mark(fills, 'fill');

		/* ここで JS の仕事は終わり。いつ出すかは CSS が持つ。
		   画面に入った時に出す仕掛けは animation-timeline: view() で書いてあり、
		   進行はスクロール位置から一意に決まる。時間で進める作りにすると
		   「途中で止まって透明のまま残る」状態を作れてしまうので採らない。 */
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else { run(); }
}());
