define(['lodash', 'jquery', 'backbone', 'modiphy', 'pageable/page'], function(_, $, Backbone, M, Page){
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