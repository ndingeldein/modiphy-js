(function (root, factory) {
   if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define('backbone.queryparams',["underscore","backbone"], function(_, Backbone) {
        // Use global variables if the locals are undefined.
        return factory(_ || root._, Backbone || root.Backbone);
      });
   } else if (typeof exports === 'object') {
     module.exports = factory(require("underscore"), require("backbone"));
   } else {
      // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
      factory(_, Backbone);
   }
}(this, function(_, Backbone) {

var queryStringParam = /^\?(.*)/,
    optionalParam = /\((.*?)\)/g,
    namedParam    = /(\(\?)?:\w+/g,
    splatParam    = /\*\w+/g,
    escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g,
    fragmentStrip = /^([^\?]*)/,
    namesPattern = /[\:\*]([^\:\?\/]+)/g,
    routeStripper = /^[#\/]|\s+$/g,
    trailingSlash = /\/$/;
Backbone.Router.arrayValueSplit = '|';

_.extend(Backbone.History.prototype, {
  getFragment: function(fragment, forcePushState) {
    /*jshint eqnull:true */
    if (fragment == null) {
      if (this._hasPushState || !this._wantsHashChange || forcePushState) {
        fragment = this.location.pathname;
        var root = this.root.replace(trailingSlash, '');
        var search = this.location.search;
        if (!fragment.indexOf(root)) {
          fragment = fragment.substr(root.length);
        }
        if (search && this._hasPushState) {
          fragment += search;
        }
      } else {
        fragment = this.getHash();
      }
    }
    return fragment.replace(routeStripper, '');
  },

  // this will not perform custom query param serialization specific to the router
  // but will return a map of key/value pairs (the value is a string or array)
  getQueryParameters: function(fragment, forcePushState) {
    fragment = this.getFragment(fragment, forcePushState);
    // if no query string exists, this will still be the original fragment
    var queryString = fragment.replace(fragmentStrip, '');
    var match = queryString.match(queryStringParam);
    if (match) {
      queryString = match[1];
      var rtn = {};
      iterateQueryString(queryString, function(name, value) {
        value = parseParams(value);

        if (!rtn[name]) {
          rtn[name] = value;
        } else if (_.isString(rtn[name])) {
          rtn[name] = [rtn[name], value];
        } else {
          rtn[name].push(value);
        }
      });
      return rtn;
    } else {
      // no values
      return {};
    }
  }
});

_.extend(Backbone.Router.prototype, {
  initialize: function(options) {
    this.encodedSplatParts = options && options.encodedSplatParts;
  },

  _routeToRegExp: function(route) {
    var splatMatch = (splatParam.exec(route) || {index: -1}),
        namedMatch = (namedParam.exec(route) || {index: -1}),
        paramNames = route.match(namesPattern) || [];

    route = route.replace(escapeRegExp, '\\$&')
                 .replace(optionalParam, '(?:$1)?')
                 .replace(namedParam, function(match, optional){
                   return optional ? match : '([^\\/\\?]+)';
                 })
                 // `[^??]` is hacking around a regular expression bug under iOS4.
                 // If only `[^?]` is used then paths like signin/photos will fail
                 // while paths with `?` anywhere, like `signin/photos?`, will succeed.
                 .replace(splatParam, '([^??]*?)');
    route += '(\\?.*)?';
    var rtn = new RegExp('^' + route + '$');

    // use the rtn value to hold some parameter data
    if (splatMatch.index >= 0) {
      // there is a splat
      if (namedMatch >= 0) {
        // negative value will indicate there is a splat match before any named matches
        rtn.splatMatch = splatMatch.index - namedMatch.index;
      } else {
        rtn.splatMatch = -1;
      }
    }
	// Map and remove any trailing ')' character that has been caught up in regex matching
    rtn.paramNames = _.map(paramNames, function(name) { return name.replace(/\)$/, '').substring(1); });
    rtn.namedParameters = this.namedParameters;

    return rtn;
  },

  /**
   * Given a route, and a URL fragment that it matches, return the array of
   * extracted parameters.
   */
  _extractParameters: function(route, fragment) {
    var params = route.exec(fragment).slice(1),
        namedParams = {};
    if (params.length > 0 && !params[params.length - 1]) {
      // remove potential invalid data from query params match
      params.splice(params.length - 1, 1);
    }

    // do we have an additional query string?
    var match = params.length && params[params.length-1] && params[params.length-1].match(queryStringParam);
    if (match) {
      var queryString = match[1];
      var data = {};
      if (queryString) {
        var self = this;
        iterateQueryString(queryString, function(name, value) {
          self._setParamValue(name, value, data);
        });
      }
      params[params.length-1] = data;
      _.extend(namedParams, data);
    }

    // decode params
    var length = params.length;
    if (route.splatMatch && this.encodedSplatParts) {
      if (route.splatMatch < 0) {
        // splat param is first
        return params;
      } else {
        length = length - 1;
      }
    }

    for (var i=0; i<length; i++) {
      if (_.isString(params[i])) {
        params[i] = parseParams(params[i]);
        if (route.paramNames && route.paramNames.length >= i-1) {
          namedParams[route.paramNames[i]] = params[i];
        }
      }
    }

    return (Backbone.Router.namedParameters || route.namedParameters) ? [namedParams] : params;
  },

  /**
   * Set the parameter value on the data hash
   */
  _setParamValue: function(key, value, data) {
    // use '.' to define hash separators
    key = key.replace('[]', '');
    key = key.replace('%5B%5D', '');
    var parts = key.split('.');
    var _data = data;
    for (var i=0; i<parts.length; i++) {
      var part = parts[i];
      if (i === parts.length-1) {
        // set the value
        _data[part] = this._decodeParamValue(value, _data[part]);
      } else {
        _data = _data[part] = _data[part] || {};
      }
    }
  },

  /**
   * Decode an individual parameter value (or list of values)
   * @param value the complete value
   * @param currentValue the currently known value (or list of values)
   */
  _decodeParamValue: function(value, currentValue) {
    // '|' will indicate an array.  Array with 1 value is a=|b - multiple values can be a=b|c
    var splitChar = Backbone.Router.arrayValueSplit;
    if (splitChar && value.indexOf(splitChar) >= 0) {
      var values = value.split(splitChar);
      // clean it up
      for (var i=values.length-1; i>=0; i--) {
        if (!values[i]) {
          values.splice(i, 1);
        } else {
          values[i] = parseParams(values[i]);
        }
      }
      return values;
    }

    value = parseParams(value);
    if (!currentValue) {
      return value;
    } else if (_.isArray(currentValue)) {
      currentValue.push(value);
      return currentValue;
    } else {
      return [currentValue, value];
    }
  },

  /**
   * Return the route fragment with queryParameters serialized to query parameter string
   */
  toFragment: function(route, queryParameters) {
    if (queryParameters) {
      if (!_.isString(queryParameters)) {
        queryParameters = toQueryString(queryParameters);
      }
      if(queryParameters) {
        route += '?' + queryParameters;
      }
    }
    return route;
  }
});


/**
 * Serialize the val hash to query parameters and return it.  Use the namePrefix to prefix all param names (for recursion)
 */
function toQueryString(val, namePrefix) {
  /*jshint eqnull:true */
  var splitChar = Backbone.Router.arrayValueSplit;
  function encodeSplit(val) { return String(val).replace(splitChar, encodeURIComponent(splitChar)); }

  if (!val) {
    return '';
  }

  namePrefix = namePrefix || '';
  var rtn = [];
  _.each(val, function(_val, name) {
    name = namePrefix + name;

    if (_.isString(_val) || _.isNumber(_val) || _.isBoolean(_val) || _.isDate(_val)) {
      // primitive type
      if (_val != null) {
        rtn.push(name + '=' + encodeSplit(encodeURIComponent(_val)));
      }
    } else if (_.isArray(_val)) {
      // arrays use Backbone.Router.arrayValueSplit separator
      var str = '';
      for (var i = 0; i < _val.length; i++) {
        var param = _val[i];
        if (param != null) {
          str += splitChar + encodeSplit(param);
        }
      }
      if (str) {
        rtn.push(name + '=' + str);
      }
    } else {
      // dig into hash
      var result = toQueryString(_val, name + '.');
      if (result) {
        rtn.push(result);
      }
    }
  });

  return rtn.join('&');
}

function parseParams(value) {
  // decodeURIComponent doesn't touch '+'
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } catch (err) {
    // Failover to whatever was passed if we get junk data
    return value;
  }
}

function iterateQueryString(queryString, callback) {
  var keyValues = queryString.split('&');
  _.each(keyValues, function(keyValue) {
    var arr = keyValue.split('=');
    callback(arr.shift(), arr.join('='));
  });
}

}));

define('siteable/site-router',['lodash', 'jquery', 'backbone', 'modiphy', 'backbone.queryparams'], function(_, $, Backbone, M){
	'use strict';

	var SiteRouter = Backbone.Router.extend({

		routes: {
			'': 'index',
			':page': 'selectPage',
			':page/': 'selectPage',
			':page/:subpage': 'selectSubPage',
			':page/:subpage/': 'selectSubPage',
			':page/:subpage/:subsubpage': 'selectSubSubPage',
			':page/:subpage/:subsubpage/': 'selectSubSubPage'
		},

		initialize: function( options ){

			this.site = options.site;
			this.pages = options.site.pages;

		},

		index: function(){
			
			if(this.site.pages.normal.length){
				this.site.pages.normal.at(0).select();
			}
			
		},

		updateNormalPage: function(hash){

			_.escape(hash);

			var i = hash.indexOf('#');
			if(i >= 0){
				hash = hash.substr(0, i);
			}

			var page = this.pages.normal.get(hash);
			if(!page){
				page = new M.Page( {name: hash} );
				this.pages.normal.add(page);
			}

			this.pages.normal.select(page);

		},

		updateOverlayPage: function(params){

			if(params && params.overlay){

				var page = this.pages.overlay.get( params.overlay );
				if(!page){
					page = new M.Page({name: params.overlay});
					this.pages.overlay.add(page);
				}

				this.pages.overlay.select(page);

			}else{
				this.pages.overlay.deselect();				
				this.site.overlayViewer.clearViews();
			}

		},

		updateParams: function(page, params){

			if(params && !params.overlay){

				var page = this.pages.normal.get(page);
				if(page == this.pages.normal.selected){
					this.pages.normal.deselect();
				}

			}else if(params && params.overlay){
				var page = this.pages.overlay.get(params.overlay);
				if(page == this.pages.overlay.selected){
					this.pages.overlay.deselect();
				}
			}

		},

		selectPage: function(page, params){

			_.escape( page );

			this.updateParams(page, params);		

			this.updateNormalPage(page);
			this.updateOverlayPage(params);			

		},

		selectSubPage: function(page, subpage, params){

			_.escape( subpage );

			this.updateParams(page, params);

			this.updateNormalPage(subpage);
			this.updateOverlayPage(params);			

		},

		selectSubSubPage: function(page, subpage, subsubpage, params){

			_.escape( subsubpage );

			this.updateParams(page, params);

			this.updateNormalPage(subsubpage);
			this.updateOverlayPage(params);
		}

	});

	return SiteRouter;

});
define('siteable/overlay-page-wrapper',['modiphy'], function(M){
	'use strict';

	var OverlayPageWrapper = M.ContainerView.extend({
		el: '.overlay-page-wrapper',

		events: {
			'click .close-button': 'closeOverlay'
		},

		closeOverlay: function(){

			var url;
			var i = Backbone.history.fragment.indexOf('?');
			if(i == -1){
				url = Backbone.history.fragment;
			}else{
				url = Backbone.history.fragment.substring(0, i);
			}

			var params = M.deparam.querystring(Backbone.history.fragment);
			var newParams = {
				overlay: 'none'
			};
			
			params = _.extend(params, newParams);
			delete params.overlay;
			var paramStr = $.param( params );
			
			url = url + '?' + paramStr;

			if(this.router){
				this.router.navigate(url, {trigger: true});
			}			

		},

		onShow: function(){

			this.$el.show();

		},

		onHidden: function(){

			this.$el.hide();

		}

	});

	return OverlayPageWrapper;

});
define('pageable/page-to-title',[],function(){
	'use strict';

	var pageToTitle = function(str){
		return str.split('_').join(' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	return pageToTitle;

});
define('pageable/page',['lodash', 'backbone', 'modiphy', 'pageable/page-to-title'], function(_, Backbone, M, pageToTitle){
	'use strict';

	var Page = Backbone.Model.extend({

		defaults: function(){

			return {

				content: {},
				gallery_id: 0,
				name: 'page_name',
				layout: 'default',
				type: 'text'

			};

		},

		idAttribute: 'name',

		initialize: function(){

			this.set('navText', this.get('navText') ||pageToTitle(this.get('name')));

			this.set('title', this.get('title') || this.get('navText'));

			if( this.isOverlayPage() && this.get('layout') === 'default' ){
				this.set('layout', 'default_overlay');
			}

			Backbone.Select.Me.applyTo(this);

		},

		isOverlayPage: function(){
			
			if( !_.isString( this.get('linkUrl') ) ){ return false; }

			return this.get('linkUrl').substr(0, 9) === '?overlay=';

		},

		isLoaded: function(){

			if(_.isUndefined(this.get('content').html) || _.isUndefined(this.get('content').json) ){
				return false;
			}else{
				return true;
			}

		}

	});

	return Page;

});
define('pageable/pages',['modiphy', 'pageable/page'], function(M, Page){
	'use strict';

	var Pages = M.SingleCollection.extend({

		model: Page

	});

	return Pages;

});
define('pageable/page-view',['modiphy'], function(M){
	'use strict';

	var PageView = M.ContainerView.extend({

		tagName: 'div',

		className: 'page',

		initialize: function(){

			this.$el.addClass( this.model.get('type') );
			this.$el.addClass( this.model.get('layout') );
			this.$el.addClass( this.model.get('name') );

		},

		onBeforeRender: function(){
			if( !this.template ){
				this.$el.html( this.model.get('content').html );
			}
		}

	});

	return PageView;

});
define('pageable/page-loader',['lodash', 'jquery', 'backbone', 'modiphy', 'pageable/page'], function(_, $, Backbone, M, Page){
	'use strict';

	var PageLoader = function(options){

		options = options || {};

		var defaults = {

			jsonPath: 'json/json.php',
			htmlPath: 'layout/page/page.php'

		};

		_.defaults(this, options, defaults);

	};

	_.extend(PageLoader.prototype, {

		load: function(page){

			this._stopLoading();

			this.deferreds = [];

			this.deferreds.push( this.loadHTML( page ) );
			this.deferreds.push( this.loadJSON( page ) );

			return $.when.apply( $, this.deferreds ).done(function(html, json){

				page.set('content', {
					html: html[1],
					json: json[0]
				});

				page.trigger('page:loaded', page);

			});

		},

		loadHTML: function( page ){

			var deferred = $.Deferred();

			if(page.get('content').html){
				return deferred.resolve([page, page.get('content').html]);
			}
			
			//get current query params as object
			//not sure how to test this
			var params;
			if(Backbone.history.fragment){
				params = M.deparam.querystring(Backbone.history.fragment);
			}else{
				params = {};
			}
		
			params.page = page.get('name');
			params.layout = page.get('layout');
			params.title = page.get('title');
			params.type = page.get('type');
			params.page_id = page.get('id');
			params.page_gallery_id = page.get('gallery_id');
			params.url = document.URL;

			$.get( this.htmlPath, params )
				.done(function( data ){					
					deferred.resolve(page, data);
				})
				.fail(deferred.reject);

			return deferred;

		},

		loadJSON: function(page){

			var deferred = $.Deferred();

			if(page.get('content').json){
				return deferred.resolve([page.get('content').json]);
			}

			//get current query params as object
			//not sure how to test this
			var params;
			if(Backbone.history.fragment){
				params = M.deparam.querystring(Backbone.history.fragment);
			}else{
				params = {};
			}
			
			params.page = page.get('name');
			params.layout = page.get('layout');
			params.title = page.get('title');
			params.type = page.get('type');
			params.page_id = page.get('id');
			params.page_gallery_id = page.get('gallery_id');
			params.url = document.URL;

			$.get( this.jsonPath, params,'json')
				.done(deferred.resolve)
				.fail(deferred.reject);

			return deferred;

		},

		_stopLoading: function(){
			if(this.deferreds){
				_.each(this.deferreds, function(deferred){
					deferred.reject();
				});
				this.deferreds.length = 0;
			}
		}

	});

	return PageLoader;

});
define('pageable/is-overlay-page',[],function(){
	'use strict';

	var isOverlayPage = function(page){
		return page.isOverlayPage();
	};

	return isOverlayPage;

});
define('pageable/pageable',[
	'lodash',
	'modiphy',
	'pageable/page',
	'pageable/pages',
	'pageable/page-view',
	'pageable/page-loader',
	'pageable/page-to-title',
	'pageable/is-overlay-page'
	], function(
		_,
		M,
		Page,
		Pages,
		PageView,
		PageLoader,
		pageToTitle,
		isOverlayPage
	){
	'use strict';

	var Pageable = {

		Page: Page,
		Pages: Pages,
		PageView: PageView,
		PageLoader: PageLoader,
		pageToTitle: pageToTitle,
		isOverlayPage: isOverlayPage

	};

	return Pageable;
	
});
define('modiphy.pageable',[
	'lodash',
	'modiphy',
	'pageable/pageable'
	], function(
		_,
		M,
		Pageable
	){
	'use strict';

	_.extend(M, Pageable);

	return M;
	
});
define('siteable/site',['lodash', 'jquery', 'modiphy', 'siteable/site-router', 'siteable/overlay-page-wrapper', 'modiphy.pageable'], function(_, $, M, SiteRouter, OverlayPageWrapper){
	'use strict';

	var DefaultPageView = M.PageView.extend();
	var $body = $('body');
	var $bodyHtml = $('body, html');

	var defaultModelMap = {

		field01: 'name',

		field02: 'navText',

		field03: 'title',

		field04: 'layout',

		field05: 'type',

		link01: 'linkUrl'

	};

	var Site = function(options){

		options = options ? options : {};
		var defaults = {
			isMobile: true,
			rootDirectory: '',
			directLink: ''
		}
		_.defaults(this, options, defaults);

		this.pages = {};
		this.pages.normal = new M.Pages();
		this.pages.overlay = new M.Pages();

		this.factory = new M.ViewFactory({
			viewPrototype: M.PageView,
			modelViewTypeProperty: 'type',
			defaultViewType: DefaultPageView
		});

		this.pageLoader = new M.PageLoader();
		this.overlayPageLoader = new M.PageLoader();

		this.viewer = new M.Viewer({
			el: '.page-container'
		});
		this.overlayViewer = new M.Viewer({
			el: '.overlay-page-container'
		});


		this.pages.normal.on( 'select:one', this._onPageSelected, this );
		this.pages.overlay.on( 'select:one', this._onOverlayPageSelected, this );
		this.overlayPageWrapper = new OverlayPageWrapper({
				router: this.router
		});
		this.overlayViewer.on('viewer:cleared', this._onOverlayViewerCleared, this);

	};

	_.extend(Site.prototype, {

		triggerMethod: M.triggerMethod,

		addPages: function(models, options){

			var defaults = {
				map: defaultModelMap,
				merge: false
			}

			options = options ? options : {};
			_.defaults(options, defaults);

			if(_.isArray(models)){
				var items = _.flatten( models );
				var all = _.map( items, function(value){

					var model = M.mapModel(value, options.map);

					return new M.Page(model);

				});

				all = _.uniq( all, function( page ){

					return page.get('name');

				});

				this.pages.normal.add( _.reject( all, M.isOverlayPage ), options );
				this.pages.overlay.add( _.filter( all, M.isOverlayPage ), options );

			}else{
				var page = new M.Page( M.mapModel(models, options.map) );
				if( page.isOverlayPage() ){
					this.pages.overlay.add(page);
				}else{
					this.pages.normal.add(page);
				}
			}			

		},

		startHistory: function(){

			this.router = new SiteRouter({
				site: this
			});

			this.overlayPageWrapper.router =  this.router;

			Backbone.history.start({ pushState: true, root: this.rootDirectory });			

			$(document).on('click', 'a', {that: this}, this._delegateClick);

		},

		_onPageSelected: function(page){

			$body.attr('class', '');
			$body.addClass(page.get('layout') + '-page');
			$bodyHtml.animate({'scrollTop': 0}, {'duration':600, 'easing':'swing'});

			page.once('page:loaded', this._onPageLoaded, this);
			this.pageLoader.load(page);

			this.triggerMethod('page:selected', page);

		},

		_onOverlayPageSelected: function(page){

			this.overlayPageWrapper.show();
		
			page.once('page:loaded', this._onOverlayPageLoaded, this);
			this.overlayPageLoader.load(page);

			this.triggerMethod('overlay:page:selected', page);

		},

		_onPageLoaded: function(page){
			var view = this.factory.getView(page);
			this.viewer.model.set('view', view);
		},

		_onOverlayPageLoaded: function(page){
			
			var view = this.factory.getView(page);
			this.overlayViewer.model.set('view', view);

		},

		_onOverlayViewerCleared: function(){
			this.overlayPageWrapper.hide();
		},

		_scrollTo: function(e, href){

			e.preventDefault();

            var dest = 0;
            href = href.substring(1);

            var $target = $('a[name="' + href + '"]');
            if($target.length){

            	var $dh = $(document).height();
            	var $wh = $(window).height();

            	if ($target.offset().top > $dh - $wh) {
	                dest = $dh - $wh;
	            } else {
	                dest = $target.offset().top;
	            }
	            //go to destination
	            $bodyHtml.animate({
	                scrollTop: dest
	            }, 600, 'swing');
            }          

		},

		_delegateClick: function(e){			

			var that = e.data.that;
			var url = '';			
			var href = this.getAttribute('href');

			if(href.slice(0, 1) == '#'){

				that._scrollTo(e, href);

				return;
			}

			if (href.slice(0, that.directLink.length) == that.directLink){

				e.preventDefault();

				if( href.indexOf('?overlay') !== -1 ){

					var i = Backbone.history.fragment.indexOf('?');
					if(i == -1){
						url = Backbone.history.fragment;
					}else{
						url = Backbone.history.fragment.substring(0, i);
					}

					var params = M.deparam.querystring(Backbone.history.fragment);
					var newParams = M.deparam.querystring(href);
					
					params = _.extend(params, newParams);
					var paramStr = $.param( params );
					url = url + '?' + paramStr;	


				}else{

					url = href.slice(that.directLink.length);					

				}

				that.router.navigate(url, {trigger: true});
				
			}else{
				return;
			}

		}



	})

	return Site;

});
define('siteable/siteable',[
	'lodash',
	'modiphy',
	'siteable/site',
	'siteable/site-router',
	'siteable/overlay-page-wrapper'
	], function(
		_,
		M,
		Site,
		SiteRouter,
		OverlayPageWrapper
	){
	'use strict';

	var Siteable = {

		Site: Site,
		SiteRouter: SiteRouter,
		OverlayPageWrapper: OverlayPageWrapper

	};

	return Siteable;
	
});
define('modiphy.siteable',[
	'lodash',
	'modiphy',
	'siteable/siteable',
	'backbone.queryparams'
	], function(
		_,
		M,
		Siteable
	){
	'use strict';

	_.extend(M, Siteable);

	return M;
	
});

define("siteable/modiphy.siteable", function(){});
