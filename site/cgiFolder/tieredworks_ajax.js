/*--tieredworks_ajax.js ver1.1.4 2011/01/04------------------------------*/
/*--Ajax---------------------------------------------------------------------*/
function TW_createHttpRequest(){
	 if (window.XMLHttpRequest){
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		try {
			return new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				return new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				return null;
			}
		}
	} else {
		return null;
	}
}

function TW_requestFile( data , method , fileName , async , callback, dir) {
	try {
		var httpoj = TW_createHttpRequest();
		if (dir == 1) { fileName = './index/' + fileName};
		httpoj.open( method , fileName , async );
		if(arguments[6] == 1) {
			httpoj.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		}
		httpoj.onreadystatechange = function() {
			if (httpoj.readyState==4) {
				callback(httpoj, dir);
			}
		}
		httpoj.send( data );
	} catch(e) {
		pageOj = null;
		return;
	}
}
/*--/Ajax---------------------------------------------------------------------*/
/*--Index Search------------------------------------------------------*/
/*--   アイテム毎オブジェクト化 --*/
function pOj(p,t,u,i,dir) {
	this.tagLength = t.length;
	this.parent = p;
	this.tags = t;
	if (dir == 1) {
		this.url = '.' + u.firstChild.nodeValue;
	} else {
		this.url = '..' + u.firstChild.nodeValue;
	}
	this.name = p.getAttribute('name');
	this.matchFlag = 0;
}
function TW_setItemList(httpoj, dir) {
	pageOj = [];
	var resXML = httpoj.responseXML;
	var pages = resXML.getElementsByTagName('page');
	for (i = 0; i < pages.length; i++) {
		tags = pages[i].getElementsByTagName('tag');
		url = pages[i].getElementsByTagName('url')[0];
		pageOj[i] = new pOj(pages[i],tags,url,i,dir);
	}
}
function TW_returnItems() {
	document.getElementById('SF-index_container').style.display = 'block';
	document.getElementById('SF-searchResult').innerHTML = '';
}
function textCheck(txt) {
	txt = txt.replace(/</g,'&lt;');
	txt = txt.replace(/>/g,'&gt;');
	return txt;
}
/*--   /アイテム毎オブジェクト化 --*/
function TW_ItemSearch() {
	var indexListArea = document.getElementById('SF-index_container');
	var searchResultArea = document.getElementById('SF-searchResult');
	if(pageOj) {
		var n=0;
		var keys = [];
	
		function resultOj(u,n) {
			this.url = u;
			this.name = n;
		}
	
		//検索結果格納用配列の初期化
		var forResult = [] ;
		forResult.length = 0;
	
		//マッチフラグの初期化
		for (var i in pageOj) {
				pageOj[i].matchFlag = 0;
		}

		//検索キーワードの受け取りと配列化
		var key = document.SF_sfrm.SF_kw.value;
		var selectKey = document.SF_sfrm.SF_tag.value;
		if (key != '') {
		var prekeys = key.split(/\s+and\s+/i);
		for (var i in prekeys) {
			keys = keys.concat(prekeys[i].split(/\s+|[　]+/));
		}}
		if (selectKey != '') {
			keys.push(selectKey);
		}
		
/*--	フォームから受け取った内容をアイテムのタグとマッチング --*/
		var roopCounter = 0;
		if (keys.length != 0) {
			for (var i in keys) {
				for (var j in pageOj) {
					if (pageOj[j].matchFlag == roopCounter) {
						for (var k = 0; k < pageOj[j].tagLength; k++) {
							if (pageOj[j].tags[k].firstChild) {
								if (pageOj[j].tags[k].firstChild.nodeValue.indexOf(keys[i]) != -1) {
									pageOj[j].matchFlag = 1; break;
								} else {
									pageOj[j].matchFlag = 0;
								}
							}
						}
					}
				}
				roopCounter = 1;
			}
			for (var i in pageOj) {
				if (pageOj[i].matchFlag == 1) {
					forResult[n]  = new resultOj(pageOj[i].url,pageOj[i].name);
					n++;
				}
			}
/*--	/フォームから受け取った内容をアイテムのタグとマッチング --*/
/*--    result output    --*/
			if(forResult[0]) {
				indexListArea.style.display = 'none';
				insTxt = '<span style="display:block;margin-top:45px;" class="srls">' + forResult.length + '件ヒットしました。&nbsp;&nbsp;ヒットしたアイテムを表示します。</span><br />';
				for (var i in forResult) {
						insTxt += '<a href="' + forResult[i].url + '" target="_self" class="srls">' + textCheck(forResult[i].name) + '</a><br  />';
				}
				searchResultArea.innerHTML = insTxt + '<br /><a href="javascript:TW_returnItems()" class="srls">戻る</a>';
			} else if (key !='') {
				indexListArea.style.display = 'none';
				searchResultArea.innerHTML = '<span style="display:block;margin-top:45px;" class="srls">' + '"' + textCheck(selectKey) + '&nbsp;' + textCheck(key) + '"ではヒットしませんでした。</span><br /><br /><a href="javascript:TW_returnItems()" class="srls">戻る</a>';
			}
		} else {
			indexListArea.style.display = 'none';
			searchResultArea.innerHTML = '<span style="display:block;margin-top:45px;" class="srls">' + 'キーワードが入力されていません。</span><br /><br /><a href="javascript:TW_returnItems()" class="srls">戻る</a>';
		}
	}
}
/*--    /result output    --*/
/*--/Index Search------------------------------------------------------*/
/*--Inquire--------------------------------------------------------------------*/
//送信用パラメータ文字列の生成
function getForm() {
	if(document.forms['SF-contact']) {
		formItems = document.forms['SF-contact'].elements;
		TWform = document.forms['SF-contact'];
	} else {
		TWform = document.getElementsByTagName('form')[0];
		formID = TWform.getAttribute('id');
		formItems = document.forms[formID].elements;
	}
}

function TW_setParams() {
	var chkIndex,orderFieldName;
	var param = '';
	var arrayText = [];
	var orderField = 'order_field=';
	var outputArray = [];
	var chkParam = '';

	getForm();

	function textEnc(txt) {
		var txt = encodeURI(txt);
		txt = txt.replace(/&/g,'%26');
		txt = txt.replace(/\?/g,'%3F');
		txt = txt.replace(/=/g,'%3D');
		return txt;
	}

	for (var i = 0; i < formItems.length; i++) {
		if(formItems[i].name) {
			var fn = formItems[i].name;
			//フォームアイテムのラベルと値
			if (formItems[i].type != 'radio' && formItems[i].type != 'checkbox') {
				if (fn == 'site_name' || fn == 'form_title' || fn == 'admin_email' || fn == 'admin_reply_email' || fn == 'admin_mail_subject' || fn == 'auto_reply_mail_subject' || fn == 'auto_reply_mail_header' || fn == 'auto_reply_mail_footer') {
					param += formItems[i].name + '=' + textEnc(base64.decode(formItems[i].value,1)) + '&';
				} else {
					param += formItems[i].name + '=' + textEnc(formItems[i].value) + '&';
				}
			} else if (formItems[i].type == 'radio' && formItems[i].checked) {
				param += formItems[i].name + '=' + textEnc(formItems[i].value) + '&';
			} else if(formItems[i].type == 'checkbox' && formItems[i].checked) {
				//chkIndex = parseInt(formItems[i].name.slice(-2))-1;

			//IDが2桁を超えた場合に正しく送信されない問題に対応2010/11/08
			var arraySplit = formItems[i].name.split('_');
			var numDigit = arraySplit[4].length;//配列[4]はチェックボックスのみ対応

				chkIndex = truncate0(formItems[i].name.slice('-' + numDigit))-1;
				arrayText[chkIndex] += formItems[i].value + ','
			}
			//order_field文字列
			if (formItems[i].name.indexOf('label') != -1) orderField += formItems[i].name + ',';
		}
	}
	orderField = orderField.slice(0,orderField.length-1);
	
	for (var i=0; i < arrayText.length; i++) {
		n = i+1;
		if (i < 9) n = '0' + n;
		if (arrayText[i]) {
			arrayText[i] = arrayText[i].replace('undefined','');
			arrayText[i] = arrayText[i].slice(0,arrayText[i].length-1);
			outputArray[i] = 'value_select_check_box_' + n + '=' + textEnc(arrayText[i]);
		}
	}
	for (var i = 0; i < outputArray.length; i++) {
		if (outputArray[i]) {
			chkParam += outputArray[i]+'&';
		}
	}

	param += chkParam;
	param += orderField;

	return param;
}

function truncate0(value)
{
	var res = value;
	// if first charactor is "0"
	if(res.substr(0,1)=='0')
	{
		// search NOT "0" charactor index
		//var not0ind = res.search([1-9]);
		// truncate unneeded "0" charactors
		res = res.substr(1); //not0ind);
	}
	return parseInt(res);
}


//入力内容確認画面表示
function TW_confirm(path) {
	var chk = [];
	var tmpTxt = '<p>【入力内容確認】</p>';
	var n = 0;
	var inputedData;
	TW_cgiPath = path;

	getForm();

	//入力内容一覧表示ブロック生成
	TWconfirmArea = document.createElement('div');
	TWconfirmArea.setAttribute('id','SF-confirmarea');
	TWconfirmArea.style.display = 'none';
	TWform.parentNode.insertBefore(TWconfirmArea,TWform.nextSibling);

	function inputedTextCheck(txt) {
		var txt = txt.replace(/\</g,'&lt;');
		txt = txt.replace(/\>/g,'&gt;');
		return txt;
	}

	for (var i = 0;i<formItems.length; i++) {
		if(formItems[i].name && formItems[i].name.match(/label/)) {
			chk[n] = formItems[i].value;
			valueName = formItems[i].name.replace(/label/,'value') ;
			valueElm = document.getElementsByName(valueName);
			if(valueElm.length != 0) {
				if (valueElm[0].type != 'radio' && valueElm[0].type != 'checkbox') {
					if (valueElm[0].type == 'textarea') {
						inputedData = '<pre style="border:solid 1px silver;width: 90%;overflow:auto;padding:1em;margin-top:2px;margin-bottom:4px;">' + inputedTextCheck(valueElm[0].value) + '</pre>';
					} else {
						inputedData = inputedTextCheck(valueElm[0].value);
						if(inputedData.length == 0) inputedData = '<span style="color:#ff0000;">未入力</span>';
					}
					chk[n] += ':&nbsp;' + inputedData+'<br />';
					inputedData = '';
				} else if(valueElm[0].type == 'radio') {
					for (k = 0;k < valueElm.length; k++) {
						if (valueElm[k].checked) {
							inputedData = valueElm[k].value;
						}
					}
					chk[n] += ':&nbsp;' + inputedData + '<br />';
					inputedData = '';
				} else if(valueElm[0].type == 'checkbox') {
					var tempcheckedValue = '';
					for (l = 0;l < valueElm.length; l++) {
						if (valueElm[l].checked) {
							tempcheckedValue += valueElm[l].value + ', ';
						}
					}
					inputedData = tempcheckedValue.slice(0,tempcheckedValue.length-2);
					chk[n] += ':&nbsp;' + inputedData + '<br />';
					inputedData = '';
					tempcheckedValue = '';
				}
			} else {
				chk[n] = '&lt;' + formItems[i].value + '&gt;<br />'
			}
			n++;
		}
	}
	for (var i in chk) {
		tmpTxt += chk[i];
	}
	sendBtn = document.createElement('input');
	sendBtn.setAttribute('type','button');
	sendBtn.setAttribute('value','この内容で送信');
	editBtn = document.createElement('input');
	editBtn.setAttribute('type','button');
	editBtn.setAttribute('value','修正する')
	if(sendBtn.addEventListener) sendBtn.addEventListener('click',TW_send,true); else sendBtn.attachEvent('onclick',TW_send);
	if(editBtn.addEventListener) editBtn.addEventListener('click',TW_edit,true); else editBtn.attachEvent('onclick',TW_edit);

	//入力内容一覧画面への要素配置
	TWconfirmArea.innerHTML = tmpTxt;
	TWconfirmArea.appendChild(sendBtn);
	TWconfirmArea.appendChild(editBtn);

	TWform.style.display = 'none';	//フォーム画面を隠す
	TWconfirmArea.style.display = 'block';	//入力内容一覧画面を表示
	
	function TW_edit() {
		sendBtn.parentNode.removeChild(sendBtn);
		editBtn.parentNode.removeChild(editBtn);
		TWform.style.display = 'block';
		TWform.parentNode.removeChild(TWconfirmArea);
	}
}

//データ送信処理
function TW_send() {
	var data = TW_setParams();
	TW_requestFile(data, 'POST',TW_cgiPath, true, TW_compMail, '', 1);
	TWconfirmArea.innerHTML ="入力情報を送信しています。";
}

//データ送信後のページ切り替え
function TW_compMail(httpoj){
	var res = httpoj.responseText;
	//レスポンスのテキストの内容を見て、表示内容を切り替え。
	//メール送信成功の場合
	if (res.indexOf('success admin_send mail') != -1) {
		TWconfirmArea.innerHTML ='送信が完了しました。<br />ご利用ありがとうございました。';
	}
	//メール送信失敗の場合
	if (res.indexOf('error admin_send mail') != -1) {
		TWconfirmArea.innerHTML ='送信に失敗しました。<br />お手数ですがはじめから再度やり直して下さい。';
	}
}
/*--/Inquire--------------------------------------------------------------------*/
//*--Rss Reader--------------------------------------------------------------------*/
/*--対応>>RSS2、ATOM----------------------------------------------------------*/
//httpオブジェクト受信処理
function TW_requestXML(method,url,async,callback,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout){
try {
  var httpoj = TW_createHttpRequest();
  var timer = setInterval('timeout()',5000);
  httpoj.open(method,url,async);
  httpoj.onreadystatechange = function(){
    if(httpoj.readyState == 4){
      clearInterval(timer);
      callback(httpoj,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout);
    }
  }
  httpoj.send(null);
} catch(e) {
	pageOj = null;
	return;
}

//読み込み時のタイムアウト処理
function timeout(){
  clearInterval(timer);
  httpoj.abort();
  alert('ERROR : Timeout.');
}

}

//XML情報読み込み
function TW_getXML(url,originalURL,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout) {;
	switch(reqflag){
		case 'OnlineMode':
		TW_requestXML('GET',url,true,TW_parserXML,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout);
		break;
		case 'ViewMode':
		TW_requestXML('GET',originalURL,true,TW_parserXML,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout);
		break;
		case 'DesignMode':
		TW_viewXML('',listNum,'',divId,'','','',reqflag,layout);
		break;
	default:
	break;
	}
}

//XML解析処理
function TW_parserXML(httpoj,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout){
var parseType = ['RSS2','ATOM']
var data = httpoj.responseXML;
var itemnodes;
var listArr = [];//リスト全体を返す配列
var itemArr = [];//item個別のパラメータを返す配列
var rssElement = ['title','link','pubDate','description'];
var atomElement = ['title','link','updated','summary'];

//responseXMLから必要な要素を配列に格納
switch(parseType[feedType]){
	case 'RSS2':
	itemnodes = data.getElementsByTagName('item');
	if(itemnodes.length <= listNum){
		for (var i=0; i<itemnodes.length; i++){
			itemArr = [];//配列を初期化
			for (var n=0; n<rssElement.length ; n++){
				var nodeList = itemnodes[i].getElementsByTagName(rssElement[n]);
				//要素長を評価（存在する1、存在しない0）
				if(nodeList.length > 0 && nodeList[0].hasChildNodes()) {
					itemArr.push(nodeList[0].firstChild.nodeValue);
				}else{
					itemArr.push('');
				}
			}
			listArr[i] = itemArr;
		}
	}else{
		for (var i=0; i< listNum; i++){
			itemArr = [];//配列を初期化
			for (var n=0; n<rssElement.length ; n++){
				var nodeList = itemnodes[i].getElementsByTagName(rssElement[n]);
				//要素長を評価（存在する1、存在しない0）
				if(nodeList.length > 0 && nodeList[0].hasChildNodes()) {
					itemArr.push(nodeList[0].firstChild.nodeValue);
				}else{
					itemArr.push('');
				}
			}
			listArr[i] = itemArr;
		}
	}
	break;
	case 'ATOM':
	itemnodes = data.getElementsByTagName('entry');
	if(itemnodes.length <= listNum){
		for (var i=0; i<itemnodes.length; i++){
			itemArr = [];//配列を初期化
			for (var n=0; n<atomElement.length ; n++){
				var nodeList = itemnodes[i].getElementsByTagName(atomElement[n]);
				if(n == 1){
					if(nodeList.length > 0){
					itemArr.push(nodeList[0].getAttribute('href'));
					}else{
					itemArr.push('');
					}
				}else{
					if(nodeList.length > 0 && nodeList[0].hasChildNodes()) {
					itemArr.push(nodeList[0].firstChild.nodeValue);
					}else{
					itemArr.push('');
					}
				}
			}
			listArr[i] = itemArr;
		}
	}else{
		for (var i=0; i< listNum; i++){
			itemArr = [];//配列を初期化
			for (var n=0; n<atomElement.length ; n++){
				var nodeList = itemnodes[i].getElementsByTagName(atomElement[n]);
				if(n == 1){
					if(nodeList.length > 0){
					itemArr.push(nodeList[0].getAttribute('href'));
					}else{
					itemArr.push('');
					}
				}else{
					if(nodeList.length > 0 && nodeList[0].hasChildNodes()) {
					itemArr.push(nodeList[0].firstChild.nodeValue);
					}else{
					itemArr.push('');
					}
				}
			}
			listArr[i] = itemArr;
		}
	}
	break;
	default:
	break;
}
	var map = listArr;
	TW_viewXML(map,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout);
}

//画面表示処理
function TW_viewXML(map,listNum,cutDescription,divId,newslistHeadlineTag,newslistLinkTarget,feedType,reqflag,layout){
	var moduleArea = document.getElementById(divId);
	var listHash = map;
	var lists = '';
	var linkTarget = newslistLinkTarget;
	var cutstr = cutDescription;
	var dateformat = feedType;

	switch(layout){
	case 'type1':
		if(reqflag == 'OnlineMode' || reqflag == 'ViewMode'){
		if(listHash.length >0){
			lists = '<ul class="thumbnailList">';
			for (i=0; i<listHash.length; i++){
				lists += '<li class="SF-clearfix">';
				lists += '<div class="newslistdata">';
				lists += '<h3 class="newslistHeadlineStyle">' + '<a href="' + listHash[i][1] + '" target="' + linkTarget + '">' + listHash[i][0] + '</a></h3>';
				lists += '<span class="pubDateTxt">' + TW_parsePubDateString(listHash[i][2],dateformat) + '</span>';
			if(listHash[i][3].toString().length > cutstr){
				lists += '<p>' + listHash[i][3].substr(0,cutstr) + '&nbsp;&nbsp;<a href="' + listHash[i][1] + '" target="' + linkTarget + '">' + '続きを読む....' + '</a></p>';
			}else{
				lists += '<p>' + listHash[i][3] + '</p>';
			}
				lists += '</div>';
				lists += '</li>';
			}
			lists += '</ul>';
			moduleArea.innerHTML = lists;
		}else{
			moduleArea.innerHTML = 'リストが取得できませんでした。';
		}
		}else{
		//デザイン確認用オフライン表示
			lists = '<ul class="thumbnailList">';
			for (i=0; i<listNum; i++){
				lists += '<li class="SF-clearfix">';
				lists += '<div class="newslistdata">';
				lists += '<h3 class="newslistHeadlineStyle">' + '<a href="#">'+ '記事見出しが入ります' + '</a></h3>';
				lists += '<span class="pubDateTxt">' + '2010年00月00日' + '</span>';
				lists += '<p>' + 'さんぷるてきすとさんぷるてきすとさんぷるてきすと。' + '&nbsp;&nbsp;<a href="#">' + '続きを読む....' + '</a></p>';
				lists += '</div>';
				lists += '</li>';
			}
			lists += '</ul>';
			moduleArea.innerHTML = lists;
		}
	break;
	case 'type2':
		if(reqflag == 'OnlineMode' || reqflag == 'ViewMode'){
		if(listHash.length >0){
			lists = '<ul class="thumbnailList">';
			for (i=0; i<listHash.length; i++){
				lists += '<li class="SF-clearfix">';
				lists += '<div class="newslistdata">';
				lists += '<span class="pubDateTxt">' + TW_parsePubDateString(listHash[i][2],dateformat) + '</span>';
				lists += '<h3 class="newslistHeadlineStyle">' + '<a href="' + listHash[i][1] + '" target="' + linkTarget + '">' + listHash[i][0] + '</a></h3>';
			if(listHash[i][3].toString().length > cutstr){
				lists += '<p>' + listHash[i][3].substr(0,cutstr) + '&nbsp;&nbsp;<a href="' + listHash[i][1] + '" target="' + linkTarget + '">' + '続きを読む....' + '</a></p>';
			}else{
				lists += '<p>' + listHash[i][3] + '</p>';
			}
				lists += '</div>';
				lists += '</li>';
			}
			lists += '</ul>';
			moduleArea.innerHTML = lists;
		}else{
			moduleArea.innerHTML = 'リストが取得できませんでした。';
		}
		}else{
		//デザイン確認用オフライン表示
			lists = '<ul class="thumbnailList">';
			for (i=0; i<listNum; i++){
				lists += '<li class="SF-clearfix">';
				lists += '<div class="newslistdata">';
				lists += '<span class="pubDateTxt">' + '2010年00月00日' + '</span>';
				lists += '<h3 class="newslistHeadlineStyle">' + '<a href="#">'+ '記事見出しが入ります' + '</a></h3>';
				lists += '<p>' + 'さんぷるてきすとさんぷるてきすとさんぷるてきすと。' + '&nbsp;&nbsp;<a href="#">' + '続きを読む....' + '</a></p>';
				lists += '</div>';
				lists += '</li>';
			}
			lists += '</ul>';
			moduleArea.innerHTML = lists;
		}
	break;
	default:
	break;
	}
	//日付フォーマット変換処理
	function TW_parsePubDateString(date,dateformat){
		var NewPubDate ='';
		if(date != ''){
		switch(dateformat){
		//RFC822に従う形式を表示形式に変換
		case '0':
			var manthEn = new Array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
			var manthJp = new Array('1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月');
			var PubDate = date;
			var pattern = /([a-zA-Z]*,)+\s([0-9]*)\s([a-zA-Z]*)\s([0-9]*)\s([0-9:\+\s]*)+/gi;
			var results = PubDate.match(pattern);
			var year = RegExp.$4;
			var month = RegExp.$3;
			var day = RegExp.$2;
			var time = RegExp.$5;
			var newRegObj = new RegExp(month);	
			for(var i=0; i< manthEn.length; i++){
				if(newRegObj.test(manthEn[i])){
				month = manthJp[i];
				break;
				}
			}
			NewPubDate = year + '年' + month + day + '日';
			return NewPubDate;
			break;
		//ISO8601形式を表示形式に変換
		case '1':
			NewPubDate  = date.replace(/^(\d{4})-(\d{2})-(\d{2})T([0-9:]*)(.)(.*)$/,'$1年$2月$3日');
			return NewPubDate;
			break;
		default:
			break;
		}
		}else{
			NewPubDate = '';
			return NewPubDate;
		}
	}
}
/*--/Rss Reader--------------------------------------------------------------------*/