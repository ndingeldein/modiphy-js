define(['jquery', 'backbone', 'modiphy', 'siteable/overlay-page-wrapper', 'jasmine-jquery'], function($, Backbone, M, OverlayPageWrapper){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../../test/fixtures';
	loadFixtures('overlay.html');

	var router = new Backbone.Router();
	var opw = new OverlayPageWrapper({
		router: router
	});
	Backbone.history.start({ pushState: true, root: '/modiphy-js/test/site_runner/' });

	describe('Overlay Page Wrapper', function(){

		it('should have class of "overlay-page-wrapper"', function(){

			expect(opw.$el.hasClass('overlay-page-wrapper')).toBe(true);

		});

		describe('closeOverlay', function(){

			it('should remove overlay query parameter', function(){

				router.navigate('hotdog?foo=jarjar&overlay=youtube', {trigger: true});
				opw.closeOverlay();

				var obj = M.deparam.querystring(Backbone.history.fragment);

				expect(obj.overlay).toBeUndefined();

			});

		})

	});

});