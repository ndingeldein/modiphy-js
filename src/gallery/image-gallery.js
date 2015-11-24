define(['backbone', 'gallery/gallery-categories', 'backbone.select'], function(Backbone, GalleryCategories){
	'use strict';

	var ImageGallery = Backbone.Model.extend({

		defaults: {
			title: '',
			categories: new GalleryCategories()
		},

		initialize: function(){
			Backbone.Select.Me.applyTo(this);
		}

	});

	return ImageGallery;

});