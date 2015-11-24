define(['backbone', 'lodash', 'gallery/gallery-category', 'gallery/gallery-categories', 'gallery/image-gallery', 'gallery/image-galleries'], function(Backbone, _, GalleryCategory, GalleryCategories, ImageGallery, ImageGalleries){
	'use strict';

	var galleries;

	describe('ImageGalleries', function(){

		beforeEach(function(){

			galleries = new ImageGalleries();

		});

		it('should extend Backbone.Collection', function(){

			expect(ImageGalleries.prototype instanceof Backbone.Collection).toBe(true);

		});

		it('should have a default model type of ImageGallery', function(){

			expect(ImageGalleries.prototype.model).toBe(ImageGallery);

		});

		it('should be a Backbone SelectOne collection', function(done){

			var model = {
				name: 'johnny'
			};
			
			galleries = new ImageGalleries([model]);

			var gallery = galleries.at(0);

			expect(galleries.select).toBeDefined();
			expect(galleries.deselect).toBeDefined();

			//galleries.add(gallery);

			gallery.on('selected', function(model){

				expect(model).toBe(gallery);

			});

			galleries.on('select:one', function(model){

				expect(model).toBe(gallery);
				done();

			});

			gallery.select();

		});


	});
	
});