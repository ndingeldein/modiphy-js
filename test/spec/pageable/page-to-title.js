define(['lodash', 'pageable/page-to-title'], function(_, pageToTitle){
	'use strict';

	var page_name = 'foo_bar_code';

	describe('modiphy.pageable.js pageToTitle helper', function(){

		it('should a string\'s underscores to spaces', function(){
			
			expect(pageToTitle(page_name).toLowerCase()).toBe('foo bar code');

		});

		it('should a initialize first letter of each word', function(){

			expect(pageToTitle(page_name)).toBe('Foo Bar Code');

		});

	});

});