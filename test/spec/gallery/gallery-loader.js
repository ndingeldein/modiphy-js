define(['gallery/gallery-loader'], function(GalleryLoader){
	'use strict';

	var loader;

	
	
	describe('GalleryLoader', function(){

		beforeEach(function(){

			loader = new GalleryLoader();

		});	

		it('should extend Backbone.events', function(){
			
			expect(loader.on).toBeDefined();
			expect(loader.off).toBeDefined();
			expect(loader.once).toBeDefined();
			expect(loader.trigger).toBeDefined();

		});

		describe('options', function(){

			it('"jsonPath" property should default to gallery cache', function(){

				expect(loader.jsonPath).toBe('http://www.webgallerydisplay.com/lib/cached_gallery_jsonp.php');

			});

			it('they should be able to be overwritten in constructor', function(){

				loader = new GalleryLoader({
					jsonPath: 'foo/bar'
				});

				expect(loader.jsonPath).toBe('foo/bar');


			});

		});

		describe('load method', function(){

			it('should be able to load one gallery', function(done){

				var obj = {
					loaded: function(gallery){
						expect(gallery.get('id')).toBe(744);
						expect(gallery.get('categories').length).toBeGreaterThan(1);

						done();
					}
				};

				spyOn(obj, 'loaded').and.callThrough();

				loader.on('gallery:loaded', obj.loaded);
				loader.load(744);

			});

			it('should be able to load multiple galleries', function(done){

				var obj = {
					loaded: function(){
						
					},
					loadedAll: function(galleries){

						expect(galleries.length).toBe(3);
						expect(galleries.at(0).get('id')).toBe(744);
						expect(galleries.at(2).get('id')).toBe(746);
						expect(obj.loaded.calls.count()).toBe(3);
						done();
					}
				};

				spyOn(obj, 'loaded');				

				loader.on('gallery:loaded', obj.loaded);
				loader.once('galleries:loaded', obj.loadedAll);
				loader.load([744, 745, 746]);			


			});

		});

	});

});