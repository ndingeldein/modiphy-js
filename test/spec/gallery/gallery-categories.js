define(['backbone', 'lodash', 'gallery/gallery-category', 'gallery/gallery-categories'], function(Backbone, _, GalleryCategory, GalleryCategories){
	'use strict';

	var categories;

	describe('GalleryCategories', function(){

		beforeEach(function(){

			categories = new GalleryCategories();

		});

		it('should extend Backbone.Collection', function(){

			expect(GalleryCategories.prototype instanceof Backbone.Collection).toBe(true);

		});

		it('should of a default model type of GalleryCategory', function(){

			expect(GalleryCategories.prototype.model).toBe(GalleryCategory);

		});

		it('should be a Backbone SelectOne collection', function(done){

			var model = {
				name: 'johnny'
			};
			
			categories = new GalleryCategories([model]);

			var category = categories.at(0);

			expect(categories.select).toBeDefined();
			expect(categories.deselect).toBeDefined();

			//categories.add(category);

			category.on('selected', function(model){

				expect(model).toBe(category);

			});

			categories.on('select:one', function(model){

				expect(model).toBe(category);
				done();

			});

			category.select();

		});


	});
	
});