define(['gallery/gallery-loader'], function(GalleryLoader){
	'use strict';

	var loader = new GalleryLoader();
	
	describe('GalleryLoader', function(){

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

		

	});

});