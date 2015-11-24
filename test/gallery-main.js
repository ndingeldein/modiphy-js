define(function(){
	'use strict';

	var specs = [		
		'spec/gallery/gallery-item',
		'spec/gallery/gallery-items',
		'spec/gallery/gallery-category',
		'spec/gallery/gallery-categories',
		'spec/gallery/image-gallery',
		'spec/gallery/image-galleries',
		'spec/gallery/gallery-loader',
		'spec/gallery'
	];

	require(['boot'], function(){
		require(specs, function(){
			window.onload();
		});
	});
});