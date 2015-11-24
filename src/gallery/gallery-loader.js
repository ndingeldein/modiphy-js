define(['lodash', 'gallery/image-gallery', 'gallery/image-galleries'], function(_, ImageGallery, ImageGalleries){
	'use strict';

	var GalleryLoader = function(options){		

		options = options || {};

		var defaults = {

			jsonPath: 'http://www.webgallerydisplay.com/lib/cached_gallery_jsonp.php'

		};

		_.defaults(this, options, defaults);
	};

	return GalleryLoader;

});