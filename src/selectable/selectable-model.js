define(['backbone', 'backbone.select'], function(Backbone){
	'use strict';

	var SelectableModel = Backbone.Model.extend({

		initialize: function(){
			Backbone.Select.Me.applyTo(this);
		}

	});

	return SelectableModel;

});