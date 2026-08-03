/*--tieredworks_modules.js ver1.1.0 2010/06/30------------------------------*/
/*--BrowserCheck-----------------------------------------------------------*/
function TW_browserCheck() {
	var browser;
	var agt= window.navigator.userAgent;
	if (agt.indexOf('IE') != -1) {
		browser = 0;
	} else if (agt.indexOf('Firefox') != -1) {
		browser = 1
	} else {
		browser = 2
	}
	return browser;
}
/*--BrowserCheck-----------------------------------------------------------*/
/*--Calender----------------------------------------------------------------*/
function TW_calender(UID,year,month,kind) {
	var now = new Date(year,month-1,1);
	var Y = now.getFullYear();
	var M = now.getMonth()+1;
	var startDay = now.getDay();
	var calData = eval(UID + 'calData');
	var cID = UID + 'c';
	var rID = UID + 'r';

	var monthdays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

	var n = 1;
	var md = monthdays[month-1];
	if (M == 2 && ((Y%4 == 0 && Y%100 != 0) || Y%400 == 0)) md = 29;
	switch(kind) {
		case 'tit1':
			for (var i = 1 ; i <= 42 ; i++) {
				if (i - 1 < startDay) {
					document.getElementById(cID + i).innerHTML = '&nbsp;';
				} else if (i > md + startDay  && i <= 42){
					document.getElementById(cID + i).innerHTML = '&nbsp;';
				} else {
					if (calData[n][0] != '' && calData[n][1] != '') {
						document.getElementById(cID + i).innerHTML = n + '<br /><a href="' + calData[n][1] + '">'+ calData[n][0] + '</a>';
					} else if(calData[n][0] != '' && calData[n][1] == '' ){
						document.getElementById(cID + i).innerHTML = n + '<br />'+ calData[n][0];
					} else {
						document.getElementById(cID + i).innerHTML = n ;
					}
					n++;
				}
			};break;
		case 'tit2' :
			for(var i = 1; n <= 31; i++) {
				var tcell = document.createElement('td');
				var dcell = document.getElementById(cID + i);
				var rcell = document.getElementById(rID + i);
				if (TW_browserCheck() == 0) dcell.className = 'TWcalDate'; else dcell.setAttribute('class','TWcalDate');
				var cellDate = new Date(year,month-1,i);
				var cellDay = cellDate.getDay();
				switch (cellDay) {
					case 0: insCellDay = '(日)';if (TW_browserCheck() == 0) dcell.className = 'TWcalSun'; else dcell.setAttribute('class','TWcalSun');break;
					case 1: insCellDay = '(月)';break;
					case 2: insCellDay = '(火)';break;
					case 3: insCellDay = '(水)';break;
					case 4: insCellDay = '(木)';break;
					case 5: insCellDay = '(金)';break;
					case 6: insCellDay = '(土)';if (TW_browserCheck() == 0) dcell.className = 'TWcalSat'; else dcell.setAttribute('class','TWcalSat');break;
				}
				if ( n <= md) {
					if (calData[n][0] != '' && calData[n][1] != '') {
						dcell.innerHTML = n + insCellDay;
						tcell.innerHTML = '<a href="' + calData[n][1] + '">' + calData[n][0] + '</a>';
						dcell.parentNode.appendChild(tcell);
					} else if (calData[n][0] != '' && calData[n][1] == '') {
						document.getElementById(cID + i).innerHTML = n + insCellDay;
						tcell.innerHTML = calData[n][0];
						dcell.parentNode.appendChild(tcell);
					} else {
						document.getElementById(cID + i).innerHTML = n + insCellDay;
						tcell.innerHTML = '&nbsp;';
						dcell.parentNode.appendChild(tcell);
					}
					n++;
				} else if ( n > md ){
					rcell.parentNode.removeChild(rcell);
					dcell.parentNode.removeChild(dcell);
					n++;
				}
			};
			break;
		default :
			for (var i = 1 ; i <= 42 ; i++) {
				if (i - 1< startDay) {
					document.getElementById(cID + i).innerHTML = '&nbsp;';
				} else if (i > md + startDay  && i <= 42){
					document.getElementById(cID + i).innerHTML = '&nbsp;';
				} else {
					if (calData[n][0] != '' && calData[n][1] != '') {
						document.getElementById(cID + i).innerHTML = '<a href="' + calData[n][1] + '" title="' + calData[n][0] + '">' + n + '</a>';
					} else {
						document.getElementById(cID + i).innerHTML = n;
					}
					n++;
				}


			};
	}
}
/*--/Calender----------------------------------------------------------------*/
/*--Flash---------------------------------------------------------------*/
function TW_insSWF(){
  var ret = 
    AC_GetArgs
    (  arguments, "", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}
//AC_Runcontent////////////////////////////////////////////////////////////
//v1.7
// Flash Player Version Detection
// Detect Client Browser type
// Copyright 2005-2007 Adobe Systems Incorporated.  All rights reserved.
var isIE  = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

function ControlVersion()
{
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry

	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {
	}

	if (!version)
	{
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
			
			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful. 
			
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)		
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {
		}
	}

	if (!version)
	{
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}
	
	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information
function GetSwfVer(){
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;
	
	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");			
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if ( isIE && isWin && !isOpera ) {
		flashVer = ControlVersion();
	}	
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available
function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision)
{
	versionStr = GetSwfVer();
	if (versionStr == -1 ) {
		return false;
	} else if (versionStr != 0) {
		if(isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray         = versionStr.split(" "); 	// ["WIN", "2,0,0,11"]
			tempString        = tempArray[1];			// "2,0,0,11"
			versionArray      = tempString.split(",");	// ['2', '0', '0', '11']
		} else {
			versionArray      = versionStr.split(".");
		}
		var versionMajor      = versionArray[0];
		var versionMinor      = versionArray[1];
		var versionRevision   = versionArray[2];

        	// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer))
				return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision))
					return true;
			}
		}
		return false;
	}
}

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{ 
  var str = '';
  if (isIE && isWin && !isOpera)
  {
    str += '<object ';
    for (var i in objAttrs)
    {
      str += i + '="' + objAttrs[i] + '" ';
    }
    str += '>';
    for (var i in params)
    {
      str += '<param name="' + i + '" value="' + params[i] + '" /> ';
    }
    str += '</object>';
  }
  else
  {
    str += '<embed ';
    for (var i in embedAttrs)
    {
      str += i + '="' + embedAttrs[i] + '" ';
    }
    str += '> </embed>';
  }

  document.write(str);
}

function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_SW_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){	
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie":	
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
      case "id":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}
/*--/Flash---------------------------------------------------------------*/
/*--ModuleEdit---------------------------------------------------------------*/
function DBG_getModuleSizes(row, col)
{
	var res = "";
	var obj = document.getElementById(row + " ." + col);
	if(obj == null)
		return "";
	var modules_ary = [];
	var temp_ary = [];
	temp_ary = obj.childNodes;
	for(var i=0; i < temp_ary.length; i++)
	{
	 if(temp_ary[i].nodeType == 1) modules_ary.push(temp_ary[i]);
	}

	var str = "";
	for(var i=0; i < modules_ary.length; i++)
	{
	 res += DBG_getTotalWidth(modules_ary[i]) + "," + DBG_getTotalHeight(modules_ary[i]) + "," + modules_ary[i].offsetLeft + "," + modules_ary[i].offsetTop + ",";
	}
	return res;
}
function DBG_getNaviModuleSizes(id)
{
	var res = "";
	var obj = document.getElementById(id);
	if(obj == null)
		return "";
	var modules_ary = [];
	var temp_ary = [];
	temp_ary = obj.childNodes;
	for(var i=0; i < temp_ary.length; i++)
	{
	 if(temp_ary[i].nodeType == 1) modules_ary.push(temp_ary[i]);
	}

	var str = "";
	for(var i=0; i < modules_ary.length; i++)
	{
	 res += DBG_getTotalWidth(modules_ary[i]) + "," + DBG_getTotalHeight(modules_ary[i]) + "," + modules_ary[i].offsetLeft + "," + modules_ary[i].offsetTop + ",";
	}
	return res;
}

function DBG_getTotalWidth(obj)
{
 return obj.offsetWidth + DBG_getStyleWidthValues(obj);
}
function DBG_getTotalHeight(obj)
{
 return obj.offsetHeight + DBG_getStyleHeightValues(obj);
}
function DBG_getStyleWidthValues(obj)
{
 return DBG_getStyleValue(obj, "padding-left") + DBG_getStyleValue(obj, "padding-right") + DBG_getStyleValue(obj, "margin-left") + DBG_getStyleValue(obj, "margin-right") + DBG_getStyleValue(obj, "border-left-width") + DBG_getStyleValue(obj, "border-right-width");
}

function DBG_getStyleHeightValues(obj)
{
 return DBG_getStyleValue(obj, "padding-top") + DBG_getStyleValue(obj, "padding-bottom") + DBG_getStyleValue( obj, "margin-top") + DBG_getStyleValue( obj,"margin-bottom") + DBG_getStyleValue( obj, "border-top-width") + DBG_getStyleValue( obj,"border-bottom-width");
}

function DBG_getVerticalMarigns(row, col)
{
	var res = "";
	var obj = document.getElementById(row + " ." + col);
	if(obj == null)
		return "";
	var modules_ary = [];
	var temp_ary = [];
	temp_ary = obj.childNodes;
	for(var i=0; i < temp_ary.length; i++)
	{
	 if(temp_ary[i].nodeType == 1) modules_ary.push(temp_ary[i]);
	}

	var str = "";
	for(var i=0; i < modules_ary.length; i++)
	{
	 res += DBG_getStyleValue(modules_ary[i], "margin-top") + "," + DBG_getStyleValue(modules_ary[i], "margin-bottom") + ",";
	}
	return res;
}

function DBG_getNaviVerticalMargins(id)
{
	var res = "";
	var obj = document.getElementById(id);
	if(obj == null)
		return "";
	var modules_ary = [];
	var temp_ary = [];
	temp_ary = obj.childNodes;
	for(var i=0; i < temp_ary.length; i++)
	{
	 if(temp_ary[i].nodeType == 1) modules_ary.push(temp_ary[i]);
	}

	var str = "";
	for(var i=0; i < modules_ary.length; i++)
	{
	 res += DBG_getStyleValue(modules_ary[i], "margin-top") + "," + DBG_getStyleValue(modules_ary[i], "margin-bottom") + ",";
	}
	return res;
}

function DBG_getStyleValue(obj, styleProperty)
{
 return parseFloat( document.defaultView.getComputedStyle(obj, '').getPropertyValue(styleProperty) );
}
/*--/ModuleEdit---------------------------------------------------------------*/