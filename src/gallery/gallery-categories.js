define(['backbone', 'gallery/gallery-category', 'backbone.select'], function(Backbone, GalleryCategory){
	'use strict';

	var GalleryCategories = Backbone.Collection.extend({

		model: GalleryCategory,

		initialize: function(models){
			 Backbone.Select.One.applyTo( this, models );
		}

	});

	return GalleryCategories;

});