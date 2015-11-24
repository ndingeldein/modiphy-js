define(['modiphy', 'pageable/pages', 'pageable/page'], function(M, Pages, Page){
	'use strict';

	var pages;

	describe('Page', function(){

		beforeEach(function(){

			pages = new Pages();

		});

		it('should extend M.SingleCollection', function(){

			expect(pages instanceof M.SingleCollection).toBe(true);
			
		});

		it('default model should be a Page', function(){

			expect(pages.model).toBe(Page);

		});

		it('should be able to have pages', function(){

			var home = new Page({
				name: 'home'
			});

			var about = new Page({
				name: 'about'
			});

			pages.add(home);
			pages.add(about);

			expect(pages.length).toBe(2);

		});

	});
	
});