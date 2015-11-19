define(['lodash', 'modiphy', 'pageable/page-to-title'], function(_, M){
	'use strict';

	var Page = M.SelectableModel.extend({

		defaults: function(){

			return {

				content: {},
				id: 0,
				gallery_id: 0,
				name: 'page_name',
				layout: 'default',
				type: 'text'

			};

		},

		initialize: function(options){

			this.set('navText', this.get('navText') || M.pageToTitle(this.get('name')));

			this.set('title', this.get('title') || this.get('navText'));

			if( this.isOverlayPage() && this.get('layout') === 'default' ){
				this.set('layout', 'default_overlay');
			}

			M.SelectableModel.prototype.initialize.call(this, options);

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