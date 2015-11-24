define(['backbone', 'gallery/image-gallery', 'backbone.select'], function(Backbone, ImageGallery){
	'use strict';

	var ImageGalleries = Backbone.Collection.extend({

		model: ImageGallery,

		initialize: function(models){
			 Backbone.Select.One.applyTo( this, models );
		}

	});

	return ImageGalleries;

});