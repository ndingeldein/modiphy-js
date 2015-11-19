define(['lodash', 'helpers'], function(_, M){
	'use strict';

	describe('modiphy.js helpers', function(){

		it('M.triggerMethod should be defined', function(){

			expect(_.isFunction(M.triggerMethod)).toBe(true);

		});

		it('M.getValue should be defined', function(){

			expect(_.isFunction(M.getValue)).toBe(true);

		});

		it('M.deparam should be defined', function(){

			expect(_.isFunction(M.deparam)).toBe(true);

		});

	});

});