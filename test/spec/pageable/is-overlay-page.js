define(['lodash', 'pageable/page', 'pageable/is-overlay-page'], function(_, Page, isOverlayPage){
	'use strict';

	describe('modiphy.pageable.js isOverlayPage helper', function(){

		it('should determine if page is overlay or not', function(){
			
			var normalPage = new Page({
				'linkUrl': 'main/about'
			});
			var overlayPage = new Page({
				linkUrl: '?overlay=photo_gallery'
			});

			expect(isOverlayPage(normalPage)).toBe(false);
			expect(isOverlayPage(overlayPage)).toBe(true);

		});


	});

});