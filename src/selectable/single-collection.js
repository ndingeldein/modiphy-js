define(['backbone', 'backbone.select'], function(Backbone){
	'use strict';

	var SingleCollection = Backbone.Collection.extend({

		initialize: function(models){			
			Backbone.Select.One.applyTo(this, models);
		}

	});

	return SingleCollection;

});