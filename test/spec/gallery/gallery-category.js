define(['backbone', 'lodash', 'gallery/gallery-item', 'gallery/gallery-items', 'gallery/gallery-category'], function(Backbone, _, GalleryItem, GalleryItems, GalleryCategory){
	'use strict';

	var category;

	describe('GalleryCategory', function(){

		beforeEach(function(){

			category = new GalleryCategory();

		});

		it('should extend Backbone.Model', function(){

			expect(GalleryCategory.prototype instanceof Backbone.Model).toBe(true);

		});

		it('should have some default properties', function(){

			expect(category.get('description')).toEqual('');
			expect(category.get('gallery_id')).toBe(0);
			expect(category.get('parent_id')).toBe(0);
			expect(category.get('order')).toBe(0);
			expect(category.get('image_id')).toBe(0);

		});

		describe('"items" property', function(){

			it('should by default have a property "items" of GalleryItems', function(){

				expect(category.get('items').length).toBe(0);

			});

			it('should be able to be specified in constructor', function(){

				var items = new GalleryItems();
				var item = new GalleryItem();
				items.add(item);

				category = new GalleryCategory({
					items: items
				});

				expect(category.get('items').at(0)).toBe(item);

			});

		});

		it('should be selectable', function(){

			expect(category.select).toBeDefined();
			expect(category.deselect).toBeDefined();
			expect(category.toggleSelected).toBeDefined();

		});


	});
	
});