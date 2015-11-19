define(['lodash', 'jquery', 'backbone', 'modiphy', 'pageable/page'], function(_, $, Backbone, M, Page){
	'use strict';

	var PageLoader = function(options){

		options = options || {};

		var defaults = {

			jsonPath: 'json/json.php',
			htmlPath: 'page/page.php'

		};

		_.defaults(this, options, defaults);

	};

	_.extend(PageLoader.prototype, {

		load: function(page){

			this.deferreds = [];

			this.deferreds.push( this.loadHTML( page ) );
			this.deferreds.push( this.loadJSON( page ) );

			return $.when.apply( $, this.deferreds ).done(function(html, json){
				
				page.get('content').html = html[0];
				page.get('content').json = json[0];

			});

		},

		loadHTML: function( page ){
			
			//get current query params as object
			//not sure how to test this
			var params;
			if(Backbone.history.fragment){
				params = M.deparam(Backbone.history.fragment);
			}else{
				params = {};
			}
			console.log(Backbone.history.fragment);
			console.log(params);
			
			params.page = page.get('name');
			params.layout = page.get('layout');
			params.title = page.get('title');
			params.type = page.get('type');
			params.page_id = page.get('id');
			params.page_gallery_id = page.get('gallery_id');
			params.url = document.URL;
			return $.get( this.htmlPath, params );

		},

		loadJSON: function(page){

			//get current query params as object
			//not sure how to test this
			var params;
			if(Backbone.history.fragment){
				params = M.deparam(Backbone.history.fragment);
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
			
			return $.get( this.jsonPath, params,'json');

		}

	});

	return PageLoader;

});