define(['lodash', 'backbone', 'selectable/single-collection', 'backbone.select'], function(_, Backbone, SingleCollection){
	'use strict';

	describe('SingleCollection', function(){

		it('should apply Backbone.Select.One mixin to the collection', function(){

			spyOn(Backbone.Select.One, 'applyTo');

			var collection = new SingleCollection([{},{}]);

			expect(Backbone.Select.One.applyTo).toHaveBeenCalledWith(collection, jasmine.any(Array));

		});

	});
	
});