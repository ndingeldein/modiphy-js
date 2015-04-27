define(['lodash', 'backbone', 'selectable/multi-collection', 'backbone.select'], function(_, Backbone, MultiCollection){
	'use strict';

	describe('MultiCollection', function(){

		it('should apply Backbone.Select.Many mixin to the collection', function(){

			spyOn(Backbone.Select.Many, 'applyTo');

			var collection = new MultiCollection([{},{}]);

			expect(Backbone.Select.Many.applyTo).toHaveBeenCalledWith(collection, jasmine.any(Array));

		});

	});
	
});