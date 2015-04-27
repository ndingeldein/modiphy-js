define(['lodash', 'backbone', 'selectable/selectable-model', 'backbone.select'], function(_, Backbone, SelectableModel){
	'use strict';

	describe('SelectableModel', function(){

		it('should apply Backbone.Select.Me mixin to the model', function(){

			spyOn(Backbone.Select.Me, 'applyTo');

			var model = new SelectableModel();

			expect(Backbone.Select.Me.applyTo).toHaveBeenCalledWith(model);

		});

	});
	
});