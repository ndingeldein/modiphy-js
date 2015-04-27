define(['backbone', 'backbone.select'], function(Backbone){
	'use strict';

	var MultiCollection = Backbone.Collection.extend({

		initialize: function(models){			
			Backbone.Select.Many.applyTo(this, models);
		}

	});

	return MultiCollection;

});