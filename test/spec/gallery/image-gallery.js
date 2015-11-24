define(['backbone', 'lodash', 'gallery/gallery-item', 'gallery/gallery-items', 'gallery/gallery-category', 'gallery/gallery-categories', 'gallery/image-gallery'], function(Backbone, _, GalleryItem, GalleryItems, GalleryCategory, GalleryCategories, ImageGallery){
	'use strict';

	var gallery;

	describe('GalleryCategory', function(){

		beforeEach(function(){

			gallery = new ImageGallery();

		});

		it('should extend Backbone.Model', function(){

			expect(ImageGallery.prototype instanceof Backbone.Model).toBe(true);

		});

		it('should have some default title', function(){
			
			expect(gallery.get('title')).toBe('');

		});

		describe('"categories" property', function(){

			it('should by default have a property "categories" of GalleryCategories', function(){

				expect(gallery.get('categories').length).toBe(0);

			});

			it('should be able to be specified in constructor', function(){

				var categories = new GalleryCategories();
				var category = new GalleryCategory();
				categories.add(category);

				gallery = new ImageGallery({
					categories: categories
				});

				expect(gallery.get('categories').at(0)).toBe(category);

			});

		});

		it('should be selectable', function(){

			expect(gallery.select).toBeDefined();
			expect(gallery.deselect).toBeDefined();
			expect(gallery.toggleSelected).toBeDefined();

		});


	});
	
});