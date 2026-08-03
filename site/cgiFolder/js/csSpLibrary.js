// JavaScript Document
// CS library Ver3 181004



/**
 * 1x1スペーサ画像使用時非表示 170706
 */
$(document).ready(function () {
  'use strict';
  var w;
  $('#SF-startPage img').each(function () {
    w = $(this).attr('src');
    if (w.indexOf('1x1.') !== -1) {
      $(this).addClass('hideElement');
    }
  });
});



/**
 * リストモジュール高さ合わせ（β2） 170706
 */
function sameHeight(obj) {
  'use strict';
  jQuery.event.add(window, 'load', function () {
    var timer = false;
    sameHeightGo(obj);
    $(window).resize(function () {
      if (timer !== false) {
        clearTimeout(timer);
      }
      timer = setTimeout(function () {
        sameHeightGo(obj);
      }, 200);
    });
  });
}
function sameHeightGo(obj) {
  $(obj).each(function () {
    var parentObj = $(this),
      childObj = $(parentObj).find('> div'),
      parentWidth = $(parentObj).innerWidth(),
      childWidth = $(childObj).find(':first-child').outerWidth(),
      divideNum = Math.floor(parentWidth / childWidth);
    $(childObj).tile(divideNum);
  });
}



/**
 * リストモジュールにアンカー追加（β）
 */
function addAncer(pre, id) {
  var target = id + ' > div';
    var count = 1;
    $(target).each(function (i) {
      var o = document.createElement('div');
      o.className = 'addAncr'
      o.innerHTML = '<span id="' + pre + count + '" name="' + pre + count + '">&nbsp;</span>'
      $(this).before(o);
      count++;
    });
}



/**
 * アンカースクロール 171220
 */

// ページ読み込み完了後スクロール
$(document).on('pagechange', function () {
  'use strict';
  var currentUrl = document.URL,
    index = currentUrl.lastIndexOf('#'),
    id;
  if (index !== -1) {
    id = currentUrl.substr(index);
    jQuery.event.add(window, "load", function () {
      setTimeout(function () {
        goScroll(id);
      }, 300);
    });
  }
});

// アンカータグ押下後スクロール
$(document).ready(function () {
  'use strict';
  $('a[href^="#"]').not('header a,footer a,#SF-grovalnaviPage a,#back-top a').on('click', function (event) {
    var id = $(this).attr('href');
    if (id.length >= 2) {
      //event.preventDefault;
      goScroll(id);
      //return false;
    }
  });
});

// 指定IDへスクロール
function goScroll(id) {
  'use strict';
  var offsetY;
  if (id.toLocaleLowerCase() === '#top') {
    // Topへ戻る
    offsetY = 0;
  } else {
    // 指定IDへ
    offsetY = $(id).offset().top - $('header').height();
  }
  $('html,body').animate({
    scrollTop: offsetY
  }, {
    queue: false
  });
}




/**
 * メニューリスト用リーダー横幅自動リサイズ TW-180913 β SP用カスタム
 * 商品名と金額を結ぶリーダーの幅を親要素の幅にあわせて自動で拡縮します。
 * @param {string} option.targetSelector - セレクタ（デフォルト'.thumbnailList li p, .contentTextStyle'）
 * @param {string} option.leaderStr - リーダーに使用している文字（デフォルト'･'）
 * @param {number} option.repeatTimes - リーダー文字最低繰り返し回数（デフォルト3）
 */
function autoLeaderWidthResize(option) {
  'use strict';
  $(document).ready(function () {
    // 初期化
    option = option || {};
    option = {
      'targetSelector': option.targetSelector || '.thumbnailList li p, .contentTextStyle', // ターゲット
      'leaderStr': option.leaderStr || '･', // リーダー文字
      'repeatTimes': option.repeatTimes || 3 // リーダー文字最低繰り返し回数
    };
    var nameWidth, priceWidth, parentWidth, leaderWidth, originLeaderWidth;
    // 各部分を要素化
    $(option.targetSelector).each(function () {
      var box = this,
        txt = box.innerHTML,
        repeatLStr = "";
      for (var i = 0; i < option.repeatTimes; i++) {
        repeatLStr = repeatLStr + option.leaderStr;
      }
      // plName ⇒ (^|(<BR>))((?!<BR>).*?(?=･･･)) : 行頭か<BR>から始まり･･･の前に有る<BR>でない文字列（最短・無い場合もある）
      // plLeader ⇒ ･+ : リーダー文字列
      // plPrice ⇒ (.*?)((.(?=<BR>))|(.(?=(\n)))|(.$)) : 何らかの文字列（最短・無い場合もある）に続く<BR>か改行か行末の前に有る１文字
      var reg = new RegExp('(^|(<BR>))((?!<BR>).*?(?=' + repeatLStr + '))(' + option.leaderStr + '+)(.*?)((.(?=<BR>))|(.(?=(\n)))|(.$))', 'gim');
      txt = txt.replace(reg, '$2<span class=\'plParent\'><span class=\'plName\'>$3</span><span class=\'plLeader\'><span class=\'plLeaderDiv\'>$4</span></span><span class=\'plPrice\'>$5$6</span></span>');
      box.innerHTML = txt;
    });

    // リーダー幅リサイズ
    function leaderResize() {
      $('.plLeader').each(function () {
        // 各要素と横幅の取得
        var nameElem = $(this).prev()[0];
        nameWidth = nameElem.clientWidth; // offsetWidthはIE8で不可
        priceWidth = $(this).next()[0].clientWidth;
        parentWidth = $($(this).parent()).innerWidth();
        // 必要なリーダー幅の計算
        leaderWidth = parentWidth - nameWidth - priceWidth;
        // 商品名の本来の長さを dataset として記録
        if (!$(nameElem).attr('data-origin_width')) {
          $(nameElem).attr('data-origin_width', nameWidth);
        }
        // 商品名を横幅100％（display: block）にするか判断
        if (0 <= leaderWidth && leaderWidth <= 30) {
          // リーダーが短くなり過ぎる場合
          if (nameElem.innerHTML) {
            // かつ商品名が存在する場合は商品名部分をBLOCKにする
            $(nameElem).addClass('plBlock');
            leaderWidth = parentWidth - priceWidth;
          }
        } else if (leaderWidth < 0) {
          // leaderWidthがマイナスになる場合、商品名要素の元の幅を使用して判断
          // ・親要素と商品名要素が同じ幅（商品名要素がBLOCK）の場合
          // ・元からleaderWidthがマイナスになる場合
          // が考えられる
          originLeaderWidth = parentWidth - $(nameElem).attr('data-origin_width') - priceWidth;
          if (30 < originLeaderWidth) {
            // 30より大きくなるならBLOCK指定を外す。
            $(nameElem).removeClass('plBlock');
            leaderWidth = originLeaderWidth;
          } else {
            // まだ狭い
            if (nameElem.innerHTML) {
              // かつ商品名が存在する場合はBLOCKで有り続ける
              $(nameElem).addClass('plBlock');
              leaderWidth = parentWidth - priceWidth;
            }
          }
        }
        $(this).css({width:leaderWidth, maxWidth:leaderWidth});
      });
    }

    // 最初とウインドウリサイズ時に実行
    jQuery.event.add(window, 'load', function () {
      var timer = false;
      leaderResize();
      $(window).resize(function () {
        if (timer !== false) {
          clearTimeout(timer);
        }
        timer = setTimeout(function () {
          leaderResize();
        }, 200);
      });
    });
  });
}





/**
 * リストモジュール列数自動分割 171228
 * リストモジュール記事の列数分割を自動で行います。
 * 記事の背景をノーマルに設定する事をお勧めします。
 * 不必要なマージンは auto ではなく、0px に設定して下さい。
 * @param {string} selector - モジュールを指定するクラス・ID（jQuery記法に準ずる）
 * @param {number} option.refChildWidth - 記事の基準幅（列数を計算する際の基準値, デフォルト : 140）
 * @param {number} option.maxChildWidth - 記事の最大幅（デフォルト : 200）
 * @param {number} option.tile - 高さ揃えを行うか（jquery.tile.js 必須, デフォルト : false）
 */
function articleColumnDivide(selector,option) {
  'use strict';
  if(!selector){
    return false;
  }

  function goDivide(){
    // 初期化
    option = option || {};
    option = {
      'refChildWidth': option.refChildWidth || 140,
      'maxChildWidth': option.maxChildWidth || 200,
      'tile': option.tile || false
    };
    jQuery(selector).each(function() {
      var refChildWidth = option.refChildWidth,
        maxChildWidth = option.maxChildWidth,
        parentWidth = jQuery(this).addClass('clearfix').innerWidth(),
        childObj = jQuery(this).find('> div, .SF-simpleImg img'),
        fullsetChildWidth = jQuery(childObj.get(0)).outerWidth(true),
        childMBPWidth = fullsetChildWidth - childObj.width(),
        minFullsetChildWidth = childMBPWidth + refChildWidth,
        maxDivideNum = Math.floor(parentWidth / minFullsetChildWidth);
      if (((parentWidth - childMBPWidth * maxDivideNum) / maxDivideNum) > maxChildWidth) {
        maxDivideNum++;
      }
      childObj.css('width', 'calc((100% - ' + childMBPWidth + 'px * ' + maxDivideNum + ') / ' + maxDivideNum + ')').css('float','left');
      if(option.tile){
        childObj.tile(maxDivideNum);
      }
    });
  }

  jQuery.event.add(window, "load", function() {
    'use strict';
    var timer = false;
    goDivide();
    jQuery(window).resize(function() {
      if (timer !== false) {
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        goDivide();
      }, 200);
    });
  });

}




/**
 * 他ページのモジュール等設置 β 171109
 * 他ページのモジュール等を取得して指定要素内に設置します。
 * @param {string} dest - 設置先要素のID（#有り）
 * @param {string} path - 設置したいモジュール等が存在するページへのパス
 * @param {string} get - 設置したいモジュール等のセレクタ（jQueryの記法に準ずる）
 * 必要な情報セットをオブジェクトで作成し、配列で囲みます。
 * ローディング画像を使用する場合は loadingImg クラスを付加して下さい。
 *
 * 使用例）
 * <script>
 * moduleGetSet([
 *   {
 *     'dest': '#SF-grovalnaviPage',
 *     'path': 'navigation.html',
 *     'get': '#SF-grovalnaviPage > div'
 *   }
 * ]);
 * </script>
 * <div id="SF-grovalnaviPage">
 *   <p class="loadingImg" style="text-align: center;"><img src="@[System:AssetPath]@loading.gif" /><p>
 * </div>
 */
function moduleGetSet(args) {
  'use strict';
  if (!args) {
    return false;
  }

  // デバイスの判定
  var getDevice = (function () {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
      return 'sp';
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      return 'tab';
    } else {
      return 'other';
    }
  })();
  if (getDevice === 'sp') {
    $(document).on('pagechange', function(){main(args)});
  } else {
    jQuery.event.add(window, "load", function(){main(args)});
  }

  // メイン関数
  function main(args) {
    var argsLength = args.length;
    for (var i = 0; i < argsLength; i++) {
      (function (i) {
        $.ajax({
          type: 'POST',
          cache: false,
          url: args[i].path,
          async: false,
          timeout: 10000
        }).done(function (data) { //ajaxの通信に成功した場合
          var dataArticles = $(data).find(args[i].get),
            parentBox = $(args[i].dest);
          if (typeof parentBox[0] === 'undefined') {
            throw new Error('設置先が有りません。');
            return false;
          }
          $(parentBox).find('.loadingImg').remove();
          $(parentBox).append(dataArticles[0]);
        }).fail(function (data) { //ajaxの通信に失敗した場合
          $(parentBox).html('<span>通信エラー</span>');
        });
      })(i);
    }
  }
}



/**
 * 不必要なPタグを非表示にする 180720
 */
jQuery.event.add(window, "load", function(){
  $('.contentTextStyle').each(function(){
    if($(this).get(0).innerHTML === ""){
      $(this).css('display','none');
    }
  });
});






/* 表示切替スイッチアイコン化 181004
 */
$(document).ready(function () {
  var switchBody = document.getElementById('SF-switch-link');
  if(switchBody == null){
    return false;
  }
  switchBody.innerHTML = switchBody.innerHTML.replace(/表示/g,"Switch").replace(/モバイル/g,"<span class=\'icon sp\'>SP<\/span>").replace(/パソコン/g,"<span class=\'icon pc\'>PC<\/span>");
  
  (function($){
  var uatype;
  var ua = navigator.userAgent;
  if ((ua.indexOf('iPhone') > 0 && ua.indexOf('iPad') == -1) || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
  var eventType = 'touchstart';
  uatype = true;
  }else{
  var eventType = 'click';
  uatype = false;
  }
  $(document).ready(function(){
  if(!uatype){
  $("div#SF-switch-link").toggleClass("SF-hidden");
  }
  if(document.cookie.indexOf("tw_redirect=false") > -1){
  document.cookie = "tw_redirect=; path=/";
  }
  });
  $("a#SF-switch-btn").bind(eventType, function(){
  document.cookie = "tw_redirect=false; path=/";
  window.location = $("a#SF-switch-btn").attr("href");
  return false;
  });
  })(jQuery);
});