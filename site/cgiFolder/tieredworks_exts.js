/*tieredworks_exts.js(min) ver1.1.1 2013.12.03*/
/*
* List Module Scroller 1.0.1
* Copyright (c) 2012 Sunfirst. All Rights Reserved.
*/
(function(b){b.prescroller=function(f,g){var d=b.extend({gn:"5",mid:"",alttxt:"none"},g),c=d.mid,a=d.gn,d="block"==d.alttxt?!0:!1,h=f.children(),e=['<div class="item">'];if(f.children().length){for(var i=-1;h[++i];){var j=b(h[i]);e.push('<img src="'+j.attr("src")+'" alt="'+j.attr("alt")+'"/>');0==(i+1)%a&&i!=h.length-1&&e.push('</div><div class="item">')}e.push("</div>");f[0].innerHTML=e.join("");1>=b(c+" .item").filter(":not(.cloned)").length&&1>=b(c+" .item").children().length&&(b(c+" .image_wrap img").attr("src",
b(c+" .items img").attr("src")),d&&b(c+" .image_wrap").children(".image_alttxt").text(b(c+" .items > div:not(.cloned) > img").attr("alt")),b(c+" .scrollable-wrap").remove())}else b(c+" .contents-wrap").remove()};b.clickviewer=function(f,g,d){var c=b.extend({duration:"slow",opacity:"0.5",alttxt:"none"},d);switch(c.alttxt){case "block":f.bind("click",function(){if(!b(this).hasClass("active")){var a=b(this).attr("src");"_t"==a.slice(-6,a.length-4)&&(a=a.substring(0,a.length-6)+a.substring(a.length-4,
a.length));var h=g.fadeTo(c.duration,c.opacity),e=new Image,d=b(this).attr("alt");e.onload=function(){h.fadeTo("fast",1);h.find("img").attr("src",a);g.children(".image_alttxt").text(d)};e.src=a;f.removeClass("active");b(this).addClass("active");g.children(".image_alttxt").text(d)}}).filter(":first").click();break;case "none":f.bind("click",function(){if(!b(this).hasClass("active")){var a=b(this).attr("src");"_t"==a.slice(-6,a.length-4)&&(a=a.substring(0,a.length-6)+a.substring(a.length-4,a.length));
var d=g.fadeTo(c.duration,c.opacity),e=new Image;e.onload=function(){d.fadeTo("fast",1);d.find("img").attr("src",a)};e.src=a;f.removeClass("active");b(this).addClass("active")}}).filter(":first").click()}}})(jQuery);

/*
* jQuery TwTabs Plugin 1.0.2
* Copyright (c) 2012 Sunfirst. All Rights Reserved.
*/
(function(a){a.fn.twtabs=function(d){var e=a.extend({},a.fn.twtabs.defaults,d).selected,c=a(this);return this.each(function(){c.find("ul > li").click(function(b){b.preventDefault();b=a(this).find("a").attr("href");c.find("div").not(b).css("display","none");a(b).css("display","block");a(this).addClass("activeTab");c.find("ul > li").not(a(this)).removeClass("activeTab")}).eq(e).click()})};a.fn.twtabs.defaults={selected:0}})(jQuery);

/*
* jQuery TwSubNavi Plugin 1.1.0
* for M010200001 and M010200002
* Copyright (c) 2013 Sunfirst. All Rights Reserved.
*/
(function(a){a.fn.twsubnavi=function(b){var b=a.extend({},a.fn.twsubnavi.defaults,b),i=a(this),j=b.targetid,e=b.catviewary,f=b.pageviewary,d=b.uid,g=b.cattype,k=b.pagetype;return this.each(function(){var b=a(j).children("div.twKindNavi").clone().attr("id",d+"Sub").removeAttr("style class");b.find("[id]").attr("id",function(b,h){var c=/\d+/.exec(h);switch(a(this)[0].nodeName.toLowerCase()){case "div":a(this).attr("id",h+"Sub");break;case "a":null!==c?(a(this).attr("id",g+"mmenu"+c[0]+d),e[c[0]]&&(f[c[0]]?
a(this).parent().css("display","none"):a(this).css("display","none"))):(a(this).attr("id",g+"home"+d),e[0]&&a(this).parent().css("display","none"));break;case "ul":a(this).attr("id","smenu"+c[0]+d),1!==e[c[0]]&&1===f[c[0]]&&a(this).css("display","none")}});b.find("ul li ul li a").attr("class",k);i.html(b)})};a.fn.twsubnavi.defaults={targetid:"#SF-navigation",catviewary:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],pageviewary:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],cattype:"catBgColor",pageType:"pageBgColor"}})(jQuery);
