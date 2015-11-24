define([	
	'gallery/gallery-item',
	'gallery/gallery-items',
	'gallery/gallery-category',
	'gallery/gallery-categories',
	'gallery/image-gallery',
	'gallery/image-galleries',
	'gallery/gallery-loader'
	], function(		
		GalleryItem,
		GalleryItems,
		GalleryCategory,
		GalleryCategories,
		ImageGallery,
		ImageGalleries,
		GalleryLoader
	){
	'use strict';

	var Gallery = {

		GalleryItem: GalleryItem,
		GalleryItems: GalleryItems,
		GalleryCategory: GalleryCategory,
		GalleryCategories: GalleryCategories,
		ImageGallery: ImageGallery,
		ImageGalleries: ImageGalleries,
		GalleryLoader: GalleryLoader	

	};
	
	return Gallery;
	
});