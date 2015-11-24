define(['backbone', 'gallery/gallery-items', 'backbone.select'], function(Backbone, GalleryItems){
	'use strict';

	var GalleryCategory = Backbone.Model.extend({

		defaults:{

			description: '',

			gallery_id: 0,

			image_id: 0,

			order: 0,

			parent_id: 0,

			items: new GalleryItems()

		},

		initialize: function(){
			Backbone.Select.Me.applyTo(this);
		}

	});

	return GalleryCategory;

});