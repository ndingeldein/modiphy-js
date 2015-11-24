define([
	'lodash',
	'modiphy',
	'gallery/gallery-item',
	'gallery/gallery-items',
	'gallery/gallery-category',
	'gallery/gallery-categories',
	'gallery/image-gallery',
	'gallery/image-galleries',
	'gallery/gallery-loader'
	], function(
		_,
		M,
		GalleryItem,
		GalleryItems,
		GalleryCategory,
		GalleryCategories,
		ImageGallery,
		ImageGalleries,
		GalleryLoader
	){
	'use strict';

	var gallery = {

		GalleryItem: GalleryItem,
		GalleryItems: GalleryItems,
		GalleryCategory: GalleryCategory,
		GalleryCategories: GalleryCategories,
		ImageGallery: ImageGallery,
		ImageGalleries: ImageGalleries,
		GalleryLoader: GalleryLoader	

	};
	
	_.extend(M, gallery);

	return M;
	
});