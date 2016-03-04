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

define("pageable/modiphy.pageable", function(){});
