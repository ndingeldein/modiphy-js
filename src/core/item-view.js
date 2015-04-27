define(['core/view'], function(View){
	'use strict';

	var ItemView = View.extend({

		render: function(){

			this.triggerMethod('before:render');

			if(this.model && this.template){
				
				this.$el.html(this.template(this.model.toJSON()));
			}

			this.triggerMethod('render');

			return this;

		}

	});

	return ItemView;

});