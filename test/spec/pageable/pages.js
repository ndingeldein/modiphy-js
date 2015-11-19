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

	});
	
});