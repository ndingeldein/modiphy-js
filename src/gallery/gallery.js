define([
	'lodash',
	'modiphy',
	'gallery/gallery-item',
	'gallery/gallery-items',
	'gallery/gallery-category',
	'gallery/gallery-categories',
	'gallery/image-gallery',
	'gallery/image-galleries'
	], function(
		_,
		M,
		GalleryItem,
		GalleryItems,
		GalleryCategory,
		GalleryCategories,
		ImageGallery,
		ImageGalleries
	){
	'use strict';

	var gallery = {

		GalleryItem: GalleryItem,
		GalleryItems: GalleryItems,
		GalleryCategory: GalleryCategory,
		GalleryCategories: GalleryCategories,
		ImageGallery: ImageGallery,
		ImageGalleries: ImageGalleries		

	};
	
	_.extend(M, gallery);

	return M;
	
});