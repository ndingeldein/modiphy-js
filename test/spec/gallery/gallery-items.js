define(['backbone', 'lodash', 'gallery/gallery-item', 'gallery/gallery-items'], function(Backbone, _, GalleryItem, GalleryItems){
	'use strict';

	var items;

	describe('GalleryItems', function(){

		beforeEach(function(){

			items = new GalleryItems();

		});

		it('should extend Backbone.Collection', function(){

			expect(GalleryItems.prototype instanceof Backbone.Collection).toBe(true);

		});

		it('should of a default model type of GalleryItem', function(){

			expect(GalleryItems.prototype.model).toBe(GalleryItem);

		});

		it('should be a Backbone SelectOne collection', function(done){

			var model = {
				name: 'johnny'
			};
			
			items = new GalleryItems([model]);

			var item = items.at(0);

			expect(items.select).toBeDefined();
			expect(items.deselect).toBeDefined();

			//items.add(item);

			item.on('selected', function(model){

				expect(model).toBe(item);

			});

			items.on('select:one', function(model){

				expect(model).toBe(item);
				done();

			});

			item.select();

		});


	});
	
});