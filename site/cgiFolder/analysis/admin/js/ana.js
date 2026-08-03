//最終更新　2012/07/17
var ana = new Object({
 	
		qs:'',
		reqMethod:'POST',
		_n:navigator,
		_d:document,
		
		createQueryString:function(site, siteId, page, pageId, sub, subId, uid, attr){
			this.qs += 'site=' + encodeURIComponent(site);
			this.qs += '&siteId=' + siteId;
			this.qs += '&page=' + encodeURIComponent(page);
			this.qs += '&pageId=' + pageId;
			this.qs += '&sub=' + encodeURIComponent(sub);
			this.qs += '&subId=' + subId;
			this.qs += '&uid=' + uid;
			this.qs += '&attr=' + encodeURIComponent(attr);
			
			this.qs += '&ac_ua=' + encodeURIComponent(this._n.userAgent);
			this.qs += '&ac_os=' + this._n.platform;
			this.qs += '&ac_lang=';
			if(this._d.all){
							this.qs += this._n.browserLanguage;
			}else{
							this.qs += this._n.language;
			}
			this.qs += '&ac_referer=' + encodeURIComponent(this._d.referrer);
			this.qs += '&ac_url=' + encodeURIComponent(this._d.location);

		},

		exec:function(absUri, site, siteId, page, pageId, sub, subId, uid, attr){
			this.createQueryString(site, siteId, page, pageId, sub, subId, uid, attr);
				return absUri + '?' + this.qs;
		}
		
	});
	
