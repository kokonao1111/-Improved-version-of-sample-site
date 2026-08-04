// JavaScript Document
// CS library Ver181004



/**
 * ビューポート設定変更
 */
(function(){
  var timer = false;
    $(window).resize(function() {
        if (timer !== false) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
         chvpw();
        }, 200);
    });
  
  chvpw();
  
  function chvpw(){
    if($('body').attr('data-vpw') * 1 !== window.screen.width){
      var swidth = window.screen.width,
          rate = swidth / 1024,
          meta = document.getElementsByName('viewport')[0];
      if(rate > 1) rate = 1;
      if(!meta){
        meta = document.createElement('meta');
        meta.name = 'viewport';
        $('head').append(meta);
      }
      meta.content = 'width=device-width,initial-scale=' + rate;
    }
    $('body').attr('data-vpw',window.screen.width);
  }
})();



/**
 * IE 判別 170616
 */
var isMSIE, isIE8, isIE9, isIE10;
(function () {
  'use strict';
  var ua = navigator.userAgent.toLocaleLowerCase(),
    ver = navigator.appVersion.toLocaleLowerCase();
  isMSIE = (ua.indexOf('msie') > -1) && (ua.indexOf('opera') === -1);
  isIE8 = isMSIE && (ver.indexOf('msie 8.') > -1);
  isIE9 = isMSIE && (ver.indexOf('msie 9.') > -1);
  isIE10 = isMSIE && (ver.indexOf('msie 10.') > -1);
}());



/**
 * デバイスの判定
 */
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



/**
 * scrollbtnFollow 181003
 */
$(document).ready(function () {
  'use strict';
  // hide #back-top first
  $('#back-top').hide();
  // fade in #back-top
  (function () {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
        $('#back-top').fadeIn();
      } else {
        $('#back-top').stop().fadeOut();
      }
    });
    // scroll body to 0px on click
    $('body').on('click', function (event) {
      if ($(event.target).attr('id') === 'pageTop') {
        $('body,html').animate({
          scrollTop: 0
        }, 600);
      }
    });
  })();
});

//IE7,8 透明pngフェード不具合対策
$(document).ready(function () {
  'use strict';
  var ua = window.navigator.appVersion.toLowerCase();
  if (ua.indexOf('msie 7.') !== -1 || ua.indexOf('msie 8.') !== -1) {
    $('#back-top span').each(function () {
      var src = $(this).attr('src');
      $(this).css({
        'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + src + '", sizingMethod="scale");'
      });
    });
  }
});



/**
 * smooth scroll 180719
 */
$(document).ready(function () {
  $('a[href^=#]').on('click', function (event) {
    var speed = 600,
      href = $(event.currentTarget).attr("href"),
      target = $(href == "#" || href == "#top" || href == "" ? 'html' : href),
      position = target.offset().top;
    $('body,html').animate({
      scrollTop: position
    }, speed);
    return false;
  });
});



/**
 * 1x1スペーサ画像使用時非表示 171114
 */
$(document).ready(function () {
  'use strict';
  var w;
  $('.thumbnail').find('img').each(function () {
    w = $(this).css('width');
    if (w === '1px' || w === '-1px') {
      $(this).addClass('hideElement');
    }
  });
});




/**
 * リストモジュールにアンカー追加（β）
 */
function addAncer(pre, id) {
  'use strict';
  var target = id + ' ul.thumbnailList > li.SF-clearfix';
  $(document).ready(function () {
    var count = 1;
    $(target).each(function () {
      var o = document.createElement('li');
      o.className = 'addAncr';
      o.innerHTML = '<span id="' + pre + count + '" name="' + pre + count + '">&nbsp;</span>';
      $(this).before(o);
      count++;
    });
  });
}




/**
 * リストモジュールのテーブルを分割する 170608
 * @param {string} moduleID - 適用したいモジュールID（記法はjQueryに準ずる）
 */
function tableDevide(devideNum, moduleID) {
  'use strict';
  $(document).ready(function () {

    // データの取得
    var devNum = devideNum,
      elemId = moduleID,
      tableElem,
      tmpElem = document.createElement('table'),
      trPics,
      picsArry = [],
      remainder,
      thisElem,
      i = 0;

    $(elemId).each(function () {

      // データの取出し
      tableElem = $(this).find('table');
      $(tableElem).addClass('devidedTable');
      trPics = $(tableElem).find('tr:not(.SF-trheader)').length;

      // 行の取出し
      $(tmpElem).append($(tableElem).find('tr:not(.SF-trheader)'));

      // テーブルの複製
      for (i = 0; i < devNum - 1; i++) {
        $(tableElem).after($(tableElem).clone());
      }

      // 行の振り分け数設定
      picsArry = [];
      remainder = trPics % devNum;
      for (i = 0; i < devNum; i++) {
        picsArry[i] = Math.floor(trPics / devNum);
      }
      for (i = 0; i < remainder; i++) {
        picsArry[i] = picsArry[i] + 1;
      }

      // 行の振り分け
      $('#' + $(this).attr('id') + ' table').each(function (index) {
        thisElem = this;
        for (i = 0; i < picsArry[index]; i++) {
          $(thisElem).append($(tmpElem).find('tr:first-child'));
        }
      });
    });
  });
}





/**
 * リストモジュールType01の画像配置を左右交互にする（β）171228
 * ※記事が１つだけのモジュールは対象外です。
 * @param {string} moduleID - 適用したいモジュールID（記法はjQueryに準ずる）
 */
function articleEvenOdd(dir, moduleID) {
  'use strict';
  $(document).ready(function () {
    $(moduleID).each(function () {
      var elements = $(this).find('.thumbnail');
      if (elements.length >= 2) {
        if (dir === 'left') {
          for (var n = 0; n < elements.length; n++) {
            if (n % 2) {
              $(elements[n]).addClass('csArticleRight');
            } else {
              $(elements[n]).addClass('csArticleLeft');
            }
          }
        } else {
          for (var n = 0; n < elements.length; n++) {
            if (n % 2) {
              $(elements[n]).addClass('csArticleLeft');
            } else {
              $(elements[n]).addClass('csArticleRight');
            }
          }
        }
      }
    });
  });
}




/**
 * 他ページのモジュール等設置 β 171115
 * 他ページのモジュール等を取得して指定要素内に設置します。
 * @param {string} args.path - 設置したいモジュール等が存在するページへのパス
 * @param {bool} args.async - 非同期通信（デフォルト : true）
 * @param {string} args.parentid - 取得したい要素の親要素のID（デフォルト : 'SF-outer-container'）
 * @param {arry} args.info. - 下記情報をまとめたオブジェクトの配列
 * @param {string} args.info.dest - 設置先要素のID（#有り）
 * @param {string} args.info.get - 設置したいモジュール等のセレクタ（jQueryの記法に準ずる）
 * @param {function} args.info.success - ajax成功後に実行したい関数
 * @param {function} args.info.callback - モジュール等設置完了後に実行したい関数
 * 必要な情報セットをオブジェクトで作成し、配列で囲みます。
 *
 * 使用例）
 * <script>
 * moduleGetSet([
 *   {
 *     path: '../voice/index.html',
 *     info: [
 *       {
 *         dest: '#thumbnail',
 *         get: '#B000000231 li:nth-child(1) img',
 *         success: function () {
 *           $('#thumbnail').find('img').remove();
 *         }
 *     },
 *       {
 *         dest: '#comment',
 *         get: '#B000000231 li:nth-child(1) .newslistdata',
 *         success: function () {
 *           $('#comment').find('img').remove();
 *         }
 *     }
 *   ]
 *   }
 * ]);
 * </script>
 *
 * <div id="thumbnail">
 *   <img src="@[System:AssetPath]@loading.gif" />
 * </div>
 *
 * <div id="comment">
 *   <img src="@[System:AssetPath]@loading.gif" />
 * </div>
 *
 */
function moduleGetSet(args) {
  'use strict';
  if (!args) {
    return false;
  }
  var argsLength = args.length,
    isAsync = true,
    parentid = 'SF-outer-container';
  
  for (var i = 0; i < argsLength; i++) {
    
    // 同期・非同期の決定
    if (typeof args.async === 'undefined') {
      isAsync = true;
    } else if (args.async === false) {
      isAsync = false;
    }
    // 親IDの指定
    parentid = args.parentid || parentid;
    
    // ajax
    (function (i) {
      $.ajax({
        type: 'POST',
        cache: false,
        url: args[i].path,
        async: isAsync,
        timeout: 10000
      }).done(function (data) { //ajax の通信に成功した場合
        var ajaxDataArry = $.parseHTML(data),
          ajaxData;
        // 取得元の選択
        for (var n = 0; n < ajaxDataArry.length; n++) {
          if (ajaxDataArry[n].id === parentid) {
            ajaxData = $(ajaxDataArry[n]);
            break;
          }
        }
        // 要素の設置
        for (var c = 0; c < args[i].info.length; c++) {
          var dataArticles = ajaxData.find(args[i].info[c].get),
            parentBox = $(args[i].info[c].dest);
          if (typeof parentBox[0] === 'undefined') {
            throw new Error('設置先が有りません。');
            return false;
          }
          // ajax 成功後に実行する関数
          if (args[i].info[c].success) {
            dataArticles.ready(args[i].info[c].success());
          }
          // 要素の設置
          $(parentBox).append(dataArticles);
          // 要素の設置完了後に実行する関数
          if (args[i].info[c].callback) {
            dataArticles.ready(args[i].info[c].callback());
          }
        }
      }).fail(function (data) { //ajax の通信に失敗した場合
        $(parentBox).html('<span>通信エラー</span>');
      });
    })(i);

  }
}




/**
 * リストモジュール高さ合わせ（β2）171114
 */
function sameHeight(obj) {
  'use strict';
  jQuery.event.add(window, 'load', function () {
    var sameHeightObj = $(obj);
    sameHeightObj.each(function () {
      var parentObj = $(this).find('.thumbnailList'),
        childObj = $(parentObj).children('li'),
        parentWidth = $(parentObj).innerWidth(),
        childWidth = $(childObj).first().outerWidth(),
        divideNum = Math.floor(parentWidth / childWidth);
      $(childObj).tile(divideNum);
    });
  });
}




/**
 * 全リストモジュール高さ合わせ（β）171114
 * @param {string} option.titleTile - タイトルの高さ合わせ（デフォルト false）
 * @param {string} option.imgTile - 画像（の枠）の高さ合わせ（デフォルト false）
 * @param {string} option.textTile - 本文の高さ合わせ（デフォルト false）
 * モジュールの本文中にブロック要素タグを使用すると、P タグの外に出てしまうため表示に問題が発生する可能性が有ります。
 */
function allSameHeight(option) {
  'use strict';
  // 初期化
  option = option || {};
  option = {
    'titleTile': option.titleTile || false,
    'imgTile': option.imgTile || false,
    'textTile': option.textTile || false
  };
  jQuery.event.add(window, 'load', function () {
    $('#SF-contents').find('.SF-module-container').each(function () {
      var parentObj = $(this).find('.thumbnailList'),
        childObj = $(parentObj).children('li'),
        divideNum = 0;
      if ($(childObj).length >= 2) {
        divideNum = tileDivNum(parentObj, childObj);
        if (divideNum >= 2) {
          $(childObj).tile(divideNum);
          if (option.titleTile) {
            $(childObj).find('.newslistHeadlineStyle').tile(divideNum);
          }
          if (option.imgTile) {
            $(childObj).find('.thumbnail').tile(divideNum);
          }
          if (option.textTile) {
            $(childObj).find('p').tile(divideNum);
          }
        }
      }
    });
  });
}




/**
 * 子要素分割数計算 171102
 * @param {Object} parentJQObj - 親要素 jQuery オブジェクト
 * @param {Object} childJQObj - 子要素 jQuery オブジェクト
 * 返り値 ： tile() を使用する為の分割数
 */
function tileDivNum(parentJQObj, childJQObj) {
  return Math.floor($(parentJQObj).innerWidth() / $(childJQObj[0]).outerWidth(true));
}



/**
 * 見出しの次のモジュールを開閉 170511 custom 170630
 * 開閉したいモジュールの上に見出しモジュールを置き
 *    <span class="csOpenClose">見出し文字列</span>
 *    の様に見出し文字列にクラスを付けて下さい。
 *
 * 170516の改造で、可能な限り早く動作する様、
 *    ページ下部に関数を置いて動作させるようにしました。
 * csOpenClose クラスを内包するモジュールは、
 *    開閉の対象にはなりません。
 */
function csOpenClose() {
  'use strict';
  var opclsItem = $('.csOpenClose');
  //初期化
  jQuery.each(opclsItem, function () {
    var titleObj = $(this).parent().parent(),
      opclsObj = $(titleObj).next();
    $(titleObj).css('cursor', 'pointer');
    if (!$(opclsObj).find('.csOpenClose').get().length) {
      $(opclsObj).css({
        'min-height': 'inherit',
        'height': '0px',
        'transition': 'height 200ms cubic-bezier(.1,.45,.15,1) 0s'
      }).addClass('js-opcls-contents');
    }
  });
  //クリック処理
  jQuery.each(opclsItem, function () {
    var titleObj = $(this).parent().parent(),
      opclsObj = $(titleObj).next();
    $(titleObj).click(function () {
      if ($(opclsObj).height() <= 30) {
        $(titleObj).removeClass('js-opcls-close').addClass('js-opcls-open');
        $(opclsObj).css('height', $(opclsObj).find('.thumbnailList').css('height'));
      } else {
        $(titleObj).removeClass('js-opcls-open').addClass('js-opcls-close');
        $(opclsObj).css('height', '0px');
      }
    });
  });
}




/**
 * タイトルクリックでリストモジュールを開閉 171114
 * csOpenClose とは異なり、モジュール単体で動作します。
 * @param {string} modules - モジュールID（ jQueryの記法に準ずる ）
 * 対応モジュール
 * ・記事モジュール Type11,16
 * ・リストモジュール Type15,22
 * ・その他上記に類するもの（画像、テキストが縦に並ぶものを除く）。
 */
function csOpenClose2(modules) {
  'use strict';
  jQuery.event.add(window, "load", function () {
    if (!modules) {
      throw new Error('csOpenClose2 Error : この関数を使用するモジュールのIDを指定して下さい。');
      return false;
    }
    var opclsItem = $(modules);
    jQuery.each(opclsItem, function () {
      $(this).find('.thumbnailList').children('li').each(function () {
        //初期化
        var titleObj = $(this).find('.newslistHeadlineStyle'),
          opclsObj = document.createElement('div'),
          siblingObj = $(titleObj).next(),
          whileCount = 0;
        $(titleObj).css('cursor', 'pointer').addClass('js-opcls2-title js-opcls2-close');
        opclsObj.innerHTML = "<div class='pad clearfix' style='padding: 15px 0;'></div>";
        opclsObj.className = 'js-opcls2-contents';
        while (siblingObj.length && (whileCount < 1000)) {
          $(opclsObj).find('.pad').append(siblingObj);
          siblingObj = $(titleObj).next();
          whileCount++;
        }
        $(this).append(opclsObj);
        $(opclsObj).attr('data-js-origin-height', $(opclsObj).css('height')).css({
          'min-height': 'inherit',
          'height': '0px',
          'overflow': 'hidden',
          'transition': 'height 200ms cubic-bezier(.1,.45,.15,1) 0s'
        });

        // クリック処理
        $(titleObj).click(function () {
          if ($(opclsObj).height() <= 1) {
            $(titleObj).removeClass('js-opcls2-close').addClass('js-opcls2-open');
            $(opclsObj).css('height', $(opclsObj).attr('data-js-origin-height'));
          } else {
            $(titleObj).removeClass('js-opcls2-open').addClass('js-opcls2-close');
            $(opclsObj).css('height', '0px');
          }
        });
      });
    });
  });
}




/**
 * リストモジュールの本文を上下中央に配置する 170607
 * @param {string} moduleID - 適用したいモジュールID（記法はjQueryに準ずる）
 */
function cmntVMiddle(moduleID) {
  'use strict';
  jQuery.event.add(window, "load", function(){
    var imgMb, titleHeight, titleElem;
    $(moduleID).find('ul.thumbnailList li').each(function () {
      imgMb = parseInt($(this).find('.thumbnail>img').css('margin-bottom'));
      titleElem = $(this).find('.newslistHeadlineStyle').css('display', 'table-caption');
      titleHeight = $(titleElem).height() + parseInt($(titleElem).css('margin-bottom'));
      $(this).find('.newslistdata').css({
        'height': parseInt($(this).find('.newslistdata').parent().css('height')) - imgMb - titleHeight + 'px',
        'display': 'table'
      });
      $(this).find('.newslistdata>p').css({
        'vertical-align': 'middle',
        'margin': 'auto',
        'display': 'table-cell',
        'height': '100%',
      });
    });
  });
}





/**
 * リストモジュールのスライド化 β 171114
 * @param {string} args.moduleBoxId - リストモジュールのID（ # 有り表記 ）
 * @param {string} args.moduleBoxClass - リストモジュールのClass（ . 有り表記 ）
 * @param {boolean} args.moveInterval - 一定時間でスクロールさせるか（デフォルト true）
 * @param {number} args.scrollInterval - 切り替わり間隔（ミリ秒, デフォルト 3000）
 * @param {string} args.scrollDuration - アニメーション時間（デフォルト '0.5s'）
 * @param {string} args.defaultDirection - スライド方向（デフォルト 'left'）
 * @param {number} args.displayPics - 常に見えているスライドの数（デフォルト 3）
 * @param {number} args.movePics - 一度にスライドさせる数（デフォルト 1）
 * @param {boolean} args.isDisplayCtrlBtn - コントロールボタンを表示させるか（デフォルト true）
 *
 * 一度にスライドさせる数は、
 *    ・常に見えているスライドの数
 *    ・スライド子要素の数の半分
 * の少ない方に制限されます。
 */
function listmoduleSlide(args) {
  'use strict';
  // オプション設定
  args = args || {};
  args.moduleBoxId = args.moduleBoxId || 'N/A';
  args.moduleBoxClass = args.moduleBoxClass || 'N/A';
  args.scrollInterval = args.scrollInterval || 3000;
  args.scrollDuration = args.scrollDuration || '0.5s';
  args.defaultDirection = args.defaultDirection || 'left';
  args.displayPics = args.displayPics || 3;
  args.movePics = args.movePics || 1;
  if (args.moveInterval == null) {
    args.moveInterval = true;
  }
  if (args.isDisplayCtrlBtn == null) {
    args.isDisplayCtrlBtn = true;
  }

  // スクロールするモジュールの取得とメイン関数の実行
  jQuery.event.add(window, "load", function () {
    var moduleBoxElem;
    if (args.moduleBoxId !== 'N/A') {
      moduleBoxElem = $(args.moduleBoxId);
      main(moduleBoxElem);
    } else if (args.moduleBoxClass !== 'N/A') {
      $(args.moduleBoxClass).each(function (i, elem) {
        main(elem);
      });
    } else {
      return false;
    }
  });

  // メイン関数
  function main(module) {
    var parent = $(module).children('ul'),
      child = $(parent).children('li'),
      mask = document.createElement('div'),
      scrollBody = document.createElement('div'),
      parentWidth,
      childWidth,
      parentCloneMostBefore,
      parentCloneBefore,
      parentCloneAfter,
      scrollBodyMarginLeftDefault,
      scrollBodyMarginLeft,
      count,
      def,
      timerId,
      movePics;
    // 必要部品の整備
    mask.className = 'listmoduleSlideMask';
    scrollBody.className = 'listmoduleSlideScrollBody';
    $(module).append(mask).css('position', 'relative');
    $(mask).append(scrollBody);
    $(scrollBody).append(parent).css('width', 100000);
    $(parent).css({
      "display": "inline-block"
    });
    parentWidth = $(parent).innerWidth();
    childWidth = parentWidth / child.length;
    $(mask).css({
      "margin": "0 auto",
      "width": childWidth * args.displayPics,
      "overflow": "hidden",
      "padding-bottom": "1px" // 四捨五入による表示欠け対策
    });
    $(scrollBody).css('width', parentWidth * 4);
    parent[0].className = parent[0].className + ' scrollParent';
    parentCloneMostBefore = parent[0].cloneNode(true);
    parentCloneMostBefore.className = parentCloneMostBefore.className + ' scrollParentMostBefore';
    parentCloneBefore = parent[0].cloneNode(true);
    parentCloneBefore.className = parentCloneBefore.className + ' scrollParentBefore';
    parentCloneAfter = parent[0].cloneNode(true);
    parentCloneAfter.className = parentCloneAfter.className + ' scrollParentAfter';
    $(parent[0]).before(parentCloneMostBefore, parentCloneBefore);
    $(parent[0]).after(parentCloneAfter);
    // スクロール方向ボタン
    if (args.isDisplayCtrlBtn) {
      var displayCtrlBtn = document.createElement('a'),
        displayCtrlBtnPrev,
        displayCtrlBtnNext;
      $(displayCtrlBtn).css({
        'position': 'absolute',
        'display': 'block',
        'width': '50px',
        'height': '50px',
        'top': 0,
        'bottom': 0,
        'margin': 'auto',
        'background-repeat': 'no-repeat',
        'text-indent': '-9999px',
        'cursor': 'pointer'
      });
      displayCtrlBtnPrev = displayCtrlBtn.cloneNode();
      displayCtrlBtnNext = displayCtrlBtn.cloneNode();
      displayCtrlBtnPrev.innerText = '&lt;前';
      displayCtrlBtnNext.innerText = '次&gt;';
      $(displayCtrlBtnPrev).addClass('scrollCtrlBtnPrev scrollCtrlBtns');
      $(displayCtrlBtnNext).addClass('scrollCtrlBtnNext scrollCtrlBtns');
      $(displayCtrlBtnPrev).css('background-image', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAvCAYAAAAWymHTAAACNklEQVRYR8WXzUpCURSFO+qjNLr404WiBkG9QdCgmhdBFBlZTgI1oYlRaCAN6gVsENQTJDQoCrr+vI7aOnCOHG9Xz+8lQbgT9+faa5199iVzMX4ymcxaMpkkJC5GLpdbHY1G+UQi0YwFQgHD4fAJgK1Op/PuHMIU7BFCHimAdsopJKyAW+EMQk3Gvz/Ct8EVOIVQAApWkKTLIAjewmGyVsI8aCBJp71erx2VVitINptdRtFztKgebpEIM4Ys4IOY/qDYSrfb/Zx13owgzOQCzkEJHgSyA60NgYAl9P8BKvLTPLAynimoQ8E+BHzJFGhHmKWoCBU3qgq0ICxFz0jR9qwUTVMm9YQpOEGBa1mKjCDpdHoR/X8xVSBtFzO5jBQV+/3+t6rJyieeKahBRTVqFukC/3jCPGhBwYatgsh2qc4iYyVcAQpsmqZoZrr4LEKKaibnQKaM+L7vDQaDe5zkku5JlhUfe+J53nwqlXoF5CA2CKWxdu3isenaD1p/HGGWrA+VS0i1Tf8TYU5VWQyslPAf87kV21jhIFyz6xgth1HLmhMlYuvExVm3uHTUhzyaWKB1YdKbkRactkirwpQgHMRfanTvGGUIBdEwYM6V8VjRGUFaEGEE3SJ1edWJrQ0RWqe8wRhBKIjPOhxYX7YPG0OYR3Szr8q2SiuI4NEdQMexvASJsw5tu4CqqyiQtZLQUC1E7QnOIELqWnie2HicQoTUTbxHOoeIivgWGguEgtg+fYbFZOcX0VhL32A5nZsAAAAASUVORK5CYII=)');
      $(displayCtrlBtnNext).css('background-image', 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAvCAYAAAAWymHTAAACIElEQVRYR7WXSUoDQRiF7eQ6GVpQdCHoCRRc6AV0IRETDGYjRI24cMQIIoju1YXgDRRcKAp2huOkE98vVaESe6gx0KRX/eX97+Wv114+n5/PZrNeEASvE44+nu/7C/1+v+R5XrPVar274Hj00GKxOAfQUyaTWXEB+oNw0GAwWIOiO9ugIcSlohGIoKiM0V3bCsM/CIEoDGEY7uF2v9PpvJmGIRJCD6Vow58LXGVTj2IhwugquD9tt9ufuooSIfTQQqEwg68PeDQJjwIdUCqEeeTjf9RAxM91PJKCcI+gpgmP1iHoS0WRNIQpmoaiWyiqqChSggipq0LRiWzqlCFC6h5xvyyTOi2IkLodKLpMU6QNERXBp6Vut/sdFwYjCD00l8tNIXXHuA7jdp0xhO86qKnjqkUpsgIRFL3Ao9Vxj6xBknadVYiQumdRkXWIoKjGd50TiLAZGqhbG64hN71eb9EJhJ1BJYzrnhapdQg/5DCyWb7XrEKoJNIxMH5cW4MkFQ8rEAJQfaIr6jAzhrARJZZBI4hsUdeGMAVSBV0LIquAH2LKEJaiTZWXJiUITxH20YFK45eGMA+a+LNtq3QuGpkUhK0KqWYSVSZSIXhXoR78I+4ilYqaqoSZXEUTqes2+kQIA1zBgy1VD8aVRo6LAPj1uxjTkSkgUglL0fB8Vp1/qvEsRSNNwyok7sCxBmF9NrL9WYNgTA8w+SypmZvAfgGGT0ye8FYtQgAAAABJRU5ErkJggg==)');
      $(displayCtrlBtnPrev).css({
        'background-position': 'left center',
        'left': 0
      });
      $(displayCtrlBtnNext).css({
        'background-position': 'right center',
        'right': 0
      });
      $(module).append(displayCtrlBtnPrev, displayCtrlBtnNext);
    }

    // 移動
    // 初期値の設定と初期位置への移動
    movePics = Math.floor(child.length / 2) > args.movePics ? args.movePics : Math.floor(child.length / 2);
    movePics = args.displayPics > movePics ? movePics : args.displayPics;
    count = movePics;
    scrollBodyMarginLeftDefault = scrollBodyMarginLeft = -2 * parentWidth;
    $(scrollBody).css({
      'transform': 'translateX(' + scrollBodyMarginLeft + 'px)',
      // ※GPU ハック
      'backface-visibility': 'hidden'
    });
    // ※強制レンダリング
    scrollBody.offsetLeft;
    $(scrollBody).css('transition', args.scrollDuration);
    // 移動関数
    function move(direction) {
      // 左右限界域を超える場合に安全域に戻す処理
      if (((count <= -1 * child.length + movePics) && direction === 'right') || ((child.length <= count) && direction === 'left')) {
        $(scrollBody).css('transition', '0s');
        switch (direction) {
          case 'right':
            def = ((count - movePics) + child.length);
            count = def + movePics;
            scrollBodyMarginLeft = scrollBodyMarginLeftDefault - (childWidth * def);
            break;
          default:
            def = count - child.length;
            count = def;
            scrollBodyMarginLeft = scrollBodyMarginLeftDefault + (childWidth * movePics) - (childWidth * def);
        }
        $(scrollBody).css('transform', 'translateX(' + scrollBodyMarginLeft + 'px)');
        // ※強制レンダリング
        scrollBody.offsetLeft;
        $(scrollBody).css('transition', args.scrollDuration);
      }
      // 通常移動処理
      switch (direction) {
        case 'right':
          // 右
          count = count - movePics;
          scrollBodyMarginLeft = scrollBodyMarginLeft + (childWidth * movePics);
          break;
        default:
          // 左
          count = count + movePics;
          scrollBodyMarginLeft = scrollBodyMarginLeft - (childWidth * movePics);
      }
      $(scrollBody).css('transform', 'translateX(' + scrollBodyMarginLeft + 'px)');
    }
    // 定期移動関数
    function moveInterval(direction) {
      if (timerId) {
        clearInterval(timerId);
      } else {
        move(direction);
      }
      timerId = setInterval(function () {
        move(direction);
      }, args.scrollInterval);
    }
    // 定期移動を行う場合は移動開始
    if (args.moveInterval) {
      moveInterval(args.defaultDirection);
    }
    // 手動移動関数
    function moveManual(event) {
      event.preventDefault();
      var targetElem = event.target;
      if (args.moveInterval) {
        // ※インターバルリセット
        moveInterval(args.defaultDirection);
      }
      if ($(event.target).hasClass('scrollCtrlBtnPrev')) {
        move('right');
      } else {
        move('left');
      }
    }
    // 手動移動関数をスクロール方向ボタンにリスナー登録
    if (args.isDisplayCtrlBtn) {
      $([displayCtrlBtnPrev, displayCtrlBtnNext]).on('click', moveManual);
    }
  }
}




/**
 * リストモジュール画像ホバーエフェクト用要素追加 Type-01 171114
 * 下記マウスホバーエフェクト用の要素をモジュールに追加します。
 * ・半透明のカラーフィルター
 * ・ラインが成長するエフェクト
 * 画像にはリンクを設定して下さい。
 * エフェクト動作には別途 CSS による設定が必要です。
 * この関数は「ロールオーバーで半透明」関数よりも前に実行する必要が有ります。
 * @param {string} moduleIDs - モジュールID（ jQueryの記法に準ずる ）
 */
function addEffectElementsType01(moduleIDs) {
  'use strict';
  $(document).ready(function () {
    $(moduleIDs).each(function () {
      var effectBox = document.createElement('div');
      effectBox.className = 'effectPositionReference';
      effectBox.innerHTML = '<div class="effect_colorFilter"></div><div class="effect_lineGrowUp"><div class="effect_lineGrowUp_item top"></div><div class="effect_lineGrowUp_item right"></div><div class="effect_lineGrowUp_item bottom"></div><div class="effect_lineGrowUp_item left"></div></div>';
      $(this).find('.thumbnail').children('a').each(function () {
        $(this).addClass('effectParent').append(effectBox.cloneNode(true));
        $(this).find('img').addClass('antiAlpha');
      });
    });
  });
}




/**
 * 「リストモジュール画像ホバーエフェクト用要素追加」用縦幅適用関数 β 171114
 * 上記関数は画像が正方形に切り取られますが、この関数を使用すると全体を表示できます。
 * ※CSS のセレクタ effectParent:before を .effectBeforeElem に変更して下さい。
 * ※高さ揃え系の関数はこの関数の後で実行して下さい。
 */
function effectSetMaxHeight(modules) {
  'use strict';
  jQuery.event.add(window, "load", function () {
    $(modules).each(function () {
      var liJqObj = $(this).find('.thumbnailList').children('li'),
        divNum = tileDivNum($(this).find('.thumbnailList'), liJqObj),
        imgJqObj,
        effectpJqObjArry = [],
        count = 0,
        ratioArry = [],
        effectBeforeElem = document.createElement('div'),
        tmpElem,
        maxHeight;
      effectBeforeElem.className = 'effectBeforeElem';
      liJqObj.each(function (index) {
        imgJqObj = $(this).find('img');
        ratioArry.push(imgJqObj.height() / imgJqObj.width());
        effectpJqObjArry.push($(this).find('.effectParent'));
        count++;
        if (count >= divNum || index + 1 >= liJqObj.length) {
          maxHeight = Math.max.apply(null, ratioArry) * 100 + '%';
          effectpJqObjArry.forEach(function (jqObj) {
            tmpElem = effectBeforeElem.cloneNode(true);
            $(tmpElem).css('padding-top', maxHeight);
            jqObj.prepend(tmpElem);
          });
          // リセット
          count = 0;
          ratioArry = [];
          effectpJqObjArry = [];
        }
      });
    });
  });
}





/**
 * ホバーで_over画像に変更 180802
 * @param {string} moduleID - モジュールのID #を含んでください。
 * この関数は「ロールオーバーで半透明」関数よりも前に実行する必要が有ります。
 */
function changeHoverImage(moduleID, str) {
  'use strict';
  str = str || '_over';
  var src_norm,
    src_over;
  jQuery.event.add(window, 'load', function () {
    $(moduleID).find('a').find('img').addClass('antiAlpha').on({
      'mouseenter.changeHoverImage.on': function () {
        src_norm = $(this).attr('src');
        src_over = csAddPostStr(src_norm, str);
        try {
          $(this).attr('src', src_over);
        } catch (e) {
          // over画像が無い可能性
          try {
            // 元画像も無い可能性
            $(this).attr('src', src_norm);
          } catch (e2) {
            return false;
          }
        }
      },
      'mouseleave.changeHoverImage.off': function () {
        $(this).attr('src', src_norm);
      }
    });
  });
}
//末尾文字を追加 180802
function csAddPostStr(src, postStr) {
  'use strict';
  if (src.indexOf(postStr + ".") !== -1) {
    return src;
  }
  var srcLength = src.length,
    fLength = src.lastIndexOf('.'),
    kLength = srcLength - fLength,
    f = src.substr(0, fLength),
    k = src.substr(srcLength - kLength, kLength); //IE8対策有
  return f + postStr + k;
}




/**
 * ロールオーバーで半透明 170310
function opaCtrlRollover(whois) {
  'use strict';
  var who = whois || "a img:not(.antiAlpha)";
  $(who).hover(function () {
    $(this).stop().fadeTo("fast", 0.7);
  }, function () {
    $(this).stop().fadeTo("fast", 1.0);
  });
}
$(function () {
  'use strict';
  jQuery.event.add(window, "load", function () {
    opaCtrlRollover();
  });
});
 */




/**
 * ロールオーバーで半透明 171122
 */
function opaCtrlRollover(whois) {
  'use strict';
  var who = whois || "a img:not(.antiAlpha)";
  $(who).on({
    'mouseenter.opaCtrlRollover.on': function () {
      $(this).stop().fadeTo("fast", 0.7);
    },
    'mouseleave.opaCtrlRollover.off': function () {
      $(this).stop().fadeTo("fast", 1.0);
    }
  });
}
$(function () {
  'use strict';
  jQuery.event.add(window, "load", function () {
    opaCtrlRollover();
  });
});




/**
 * ナビゲーションホバー表現 180817
 * @param {string} catName - カテゴリ名（必須）
 * @param {string} ovrStr - オーバー画像の末尾付加文字（デフォルト'_over'）
 */
function csNaviHoverd(catName,ovrStr) {
  'use strict';
  if(catName == null){
    return false;
  }
  var twCategory = {},
    ovrStr = ovrStr || '_over';
  $(document).ready(function () {
    //カテゴリの取得
    $('#SF-navigation .twKindNavi > ul > li > a').each(function (n) {
      twCategory[$(this).attr('title')] = n;
    });
    //カテゴリ名不必要文字消去
    catName = catName.replace(/(?:^.+">)(.+$)/g,'$1');
    //hover処理
    var catNum = twCategory[catName];
    if (catNum == null || catNum == undefined) {
      //throw new Error("csNaviHoverd : " + catName + " というカテゴリー名が存在しません。");
      return;
    } else {
      $(document).ready(function () {
        var naviObj = $('#SF-navigation .twKindNavi > ul > li'),
          allPath = $(naviObj[catNum]).children('a').css('background-image'),
          allPathLength = allPath.length,
          fimeNameStart = allPath.lastIndexOf('/') + 1,
          dotStart = allPathLength - allPath.lastIndexOf('.'),
          fleName = allPath.substring(fimeNameStart, allPathLength - dotStart),
          replacedPath = allPath.replace(fleName, fleName + ovrStr);
        $(naviObj[catNum]).children('a').css('background-image', replacedPath);
      });
    }
  });
}




/**
 * リンクのターゲットを変更する 171130
 * @param {string} option.modules - 操作対象モジュールのセレクタ（ jQuery の記法に準ずる ）
 * @param {string} option.target - ターゲット（ デフォルト：'_top' ）
 * @param {boolean} option.ignoreBlank - _blank の場合は無視する（ デフォルト：true ）
 */
function targetChange(option) {
  'use strict';
  // オプション設定
  option = option || {};
  option.target = option.target || '_top';
  if (!option.ignoreBlank) {
    option.ignoreBlank = true;
  } else {
    option.ignoreBlank = false;
  }
  if (!option.modules) {
    option.modules = '#SN-outer-container';
  }
  var tmpAttr,
    targetAncrs;

  $(option.modules).each(function () {
    targetAncrs = $(this).find('a');
    targetAncrs.each(function () {
      if ($(this).attr('target') === "_blank") {
        if (!option.ignoreBlank) {
          $(this).attr('target', option.target);
        }
      } else {
        $(this).attr('target', option.target);
      }
    });
  });
}




/**
 * 紙浮き表現 180129
 */
function paperLike(moduleID) {
  'use strict';
  jQuery.event.add(window, "load", function(){
    $(moduleID).each(function () {
      $(this).find('.thumbnail img').wrap('<span class="shadowBox"><span class="shadow"></span></span>');
    });
  });
}




/**
 * カレンダー次月表示β 161019
 */
function csCalenderOpCl() {
  'use strict';
  var next = document.getElementById('NEXT'),
    current = document.getElementById('CURRENT');
  if (next.style.display === 'block') {
    next.style.display = 'none';
    current.style.display = 'block';
  } else {
    next.style.display = 'block';
    current.style.display = 'none';
  }
}




/**
 * 自動タイル並べβ 170112
 * 子要素を指定列数のタイル状に並べます。
 * 引数はオブジェクトの形で渡して下さい。
 * @param {number} args.divideNum - 分割数（4）
 * @param {number} args.itemIntarval - 横・下との間隔（15）
 */
function autoAlign(args) {
  'use strict';
  args = args || {};
  args = {
    divideNum: 4, // 分割数
    itemIntarval: 15 // 横・下との間隔
  };
  jQuery.event.add(window, 'load', function () {
    $('.thumbnailList').each(function () {

      // 親BOX
      var itemParent = $(this),
        //  子要素配列
        alignItems = [],
        // 列BOX配列
        clmBoxArr = [];

      // タイル状に並べる
      // divideNum : 列数
      // itemIntarval : 間隔
      function divide(divideNum, itemIntarval) {

        // 親の設定
        $(itemParent).css('position', 'relative').addClass('fbox1023_0' + divideNum);
        // 子の保持
        alignItems = $(itemParent).children();
        // 列BOX作成
        var clmBox = document.createElement('div');
        for (var i = 0; i < divideNum; i++) {
          clmBox.style.float = 'left';
          clmBox.className = 'floatItem clmBox_' + i;
          clmBoxArr.push(itemParent[0].appendChild(clmBox.cloneNode()));
        }

        // 並べる
        var alignItemsLength = alignItems.length,
          clmBoxArrLength = clmBoxArr.length,
          clmBoxHeights = [],
          minBoxNum;
        for (i = 0; i < alignItemsLength; i++) {
          // 列の高さを比べる
          for (var n = 0; n < clmBoxArrLength; n++) {
            clmBoxHeights.push($(clmBoxArr[n]).height());
          }
          // 低い列BOXへ子を分配する
          minBoxNum = clmBoxHeights.indexOf(Math.min.apply(null, clmBoxHeights));
          $(alignItems[i]).removeAttr('style').css('margin', '0 auto ' + itemIntarval + 'px');
          clmBoxArr[minBoxNum].appendChild(alignItems[i]);
          clmBoxHeights.length = 0;
        }
      }

      // 最初に実行
      divide(args.divideNum, args.itemIntarval);

    });
  });
}




/**
 * iframe 高さ合わせβ170202（colorbox用にjquery.autoheight.jsから借用）
 */
function setHeight(targetIframe) {
  'use strict';
  try {
    var myIframeHight = targetIframe.contentDocument.body.offsetHeight + 20;
    $(targetIframe).css("height", myIframeHight + "px");
  } catch (e) {}
}

$(document).bind('cbox_complete', function () {
  'use strict';
  if (!$('#cboxLoadedContent > .cboxIframe').length) {
    return;
  }
  $('#cboxLoadedContent > .cboxIframe')[0].onload = function () {
    if (this.contentDocument) {
      setHeight(this);
      try {
        if (this.contentDocument.body.offsetHeight) {
          $.colorbox.resize();
        }
      } catch (e) {}
    }
  };
});



/**
 * メニューリスト用リーダー横幅自動リサイズ TW-180913 β
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
        if (isIE8) {
          $(this).css({width:leaderWidth, maxWidth:leaderWidth});
          $(this).find('.plLeaderDiv').css({width:leaderWidth, maxWidth:leaderWidth});
        } else {
          $(this).css({width:leaderWidth, maxWidth:leaderWidth});
        }
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
 * サブナビゲーションモジュールプルダウン
 */
jQuery.event.add(window, "load", function(){
  $('#SF-contents').find('.SF-dropdown_trigger').hover(
    function(){
      $(this).addClass('hover');
    },
    function(){
      $(this).removeClass('hover');
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
});