define(['backbone', 'gallery/gallery-item', 'backbone.select'], function(Backbone, GalleryItem){
	'use strict';

	var GalleryItems = Backbone.Collection.extend({

		model: GalleryItem,

		initialize: function(models){
			 Backbone.Select.One.applyTo( this, models );
		}

	});

	return GalleryItems;

});