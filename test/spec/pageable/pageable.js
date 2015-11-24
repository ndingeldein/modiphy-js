define(['lodash', 'modiphy', 'pageable/pageable'], function(_, M){
	'use strict';

	describe('modiphy.pageable.js', function(){

		it('M.Page should be defined', function(){

			expect(_.isFunction(M.Page)).toBe(true);

		});

		it('M.Pages should be defined', function(){

			expect(_.isFunction(M.Pages)).toBe(true);

		});

		it('M.PageLoader should be defined', function(){

			expect(_.isFunction(M.PageLoader)).toBe(true);

		});

		it('M.pageToTitle should be defined', function(){

			expect(_.isFunction(M.pageToTitle)).toBe(true);

		});

	});

});