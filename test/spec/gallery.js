define(['lodash', 'modiphy', 'modiphy.gallery'], function(_, M){
	'use strict';

	describe('modiphy.gallery.js', function(){

		it('M.GalleryItem should be defined', function(){

			expect(_.isFunction(M.GalleryItem)).toBe(true);

		});

		it('M.GalleryItems should be defined', function(){

			expect(_.isFunction(M.GalleryItems)).toBe(true);

		});

		it('M.GalleryCategory should be defined', function(){

			expect(_.isFunction(M.GalleryCategory)).toBe(true);

		});

		it('M.GalleryCategories should be defined', function(){

			expect(_.isFunction(M.GalleryCategories)).toBe(true);

		});

		it('M.ImageGallery should be defined', function(){

			expect(_.isFunction(M.ImageGallery)).toBe(true);

		});

		it('M.ImageGalleries should be defined', function(){

			expect(_.isFunction(M.ImageGalleries)).toBe(true);

		});

		it('M.GalleryLoader should be defined', function(){

			expect(_.isFunction(M.GalleryLoader)).toBe(true);

		});

	});

});