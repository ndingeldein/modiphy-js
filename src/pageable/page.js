define(['lodash', 'backbone', 'modiphy', 'pageable/page-to-title'], function(_, Backbone, M, pageToTitle){
	'use strict';

	var Page = Backbone.Model.extend({

		defaults: function(){

			return {

				content: {},
				gallery_id: 0,
				name: 'page-name',
				layout: 'default',
				type: 'text'

			};

		},

		idAttribute: 'name',

		initialize: function(){

			this.set('navText', this.get('navText') || pageToTitle(this.get('name')));

			this.set('title', this.get('title') || this.get('navText'));

			if( this.isOverlayPage() && this.get('layout') === 'default' ){
				this.set('layout', 'default-overlay');
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