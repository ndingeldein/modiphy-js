define(['lodash', 'helpers/map-model'], function(_, mapModel){
	'use strict';

	var obj = {
		field01: 'my_page',
		field02: 'My Page',
		field03: 'Welcome to My Page',
		field04: 'blank',
		field05: 'gallery',
		hotdog: 'oscar meier'
	};

	var map = {

		field01: 'name',

		field02: 'navText',

		field03: 'title',

		field04: 'layout',

		field05: 'type'

	};

	var newObj;

	beforeEach(function(){

		newObj = mapModel(obj, map);

	});

	describe('mapModel', function(){		
		
		it('should map the keys of a model using another obj into a new object', function(){

			expect(newObj).toEqual({
				name: 'my_page',
				navText: 'My Page',
				title: 'Welcome to My Page',
				layout: 'blank',
				type: 'gallery',
				hotdog: 'oscar meier'
			});

			expect(newObj).not.toBe(obj);

		});


	});

});