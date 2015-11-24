define(['lodash', 'core'], function(_, M){
	'use strict';

	describe('modiphy.js core', function(){

		it('M.View should be defined', function(){

			expect(_.isFunction(M.View)).toBe(true);

		});

		it('M.ItemView should be defined', function(){

			expect(_.isFunction(M.ItemView)).toBe(true);

		});

		it('M.ViewFactory should be defined', function(){

			expect(_.isFunction(M.ViewFactory)).toBe(true);

		});

		it('M.ContainerView should be defined', function(){

			expect(_.isFunction(M.ContainerView)).toBe(true);

		});

		it('M.CollectionView should be defined', function(){

			expect(_.isFunction(M.CollectionView)).toBe(true);

		});

		it('M.DomCollectionView should be defined', function(){

			expect(_.isObject(M.DomCollectionView)).toBe(true);

		});

		it('M.Viewer should be defined', function(){

			expect(_.isFunction(M.Viewer)).toBe(true);

		});

	});

});