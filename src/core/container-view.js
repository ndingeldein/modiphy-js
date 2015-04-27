define(['core/view', 'backbone.babysitter'], function(View, ChildViewContainer){
	'use strict';

	var ContainerView = View.extend({

		constructor: function(){

			this.container = new ChildViewContainer();

			View.prototype.constructor.apply(this, arguments);

		},

		render: function(){

			this._hasBeenRendered = true;

			this.triggerMethod('before:render');

			if(this.model && this.template){
				this.$el.html(this.template(this.model.toJSON()));
			}

			this.triggerMethod('before:render:children');

			this._renderChildren();

			this.triggerMethod('render:children');

			this.triggerMethod('render');

			return this;

		},

		_renderChildren: function(){

			this.container.each(function(view){

				view.render();
				if(!view.options.el){
					this.$el.append(view.el);
				}
				
			}, this);

		},

		remove: function(){

			View.prototype.remove.call(this);

			this.container.each(function(view){

				view.remove();

			});

		},

		_destroyItemView: function(view){

			view.destroy();
			this.container.remove(view);

		},

		destroy: function(){

			this.triggerMethod('before:destroy:container');

			this.container.each(this._destroyItemView, this);

			// called before stopListening() is called by prototype destroy
			this.triggerMethod('destroy:container');

			View.prototype.destroy.call(this);

		}

	});

	return ContainerView;
});