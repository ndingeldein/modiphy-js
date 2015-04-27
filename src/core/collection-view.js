define(['lodash', 'backbone', 'core/view', 'core/item-view', 'backbone.babysitter', 'core/container-view', 'helpers/get-value', 'core/view-factory'], function(_, Backbone, View, ItemView, ChildViewContainer, ContainerView, getValue, ViewFactory){
	'use strict';

	var CollectionView = ContainerView.extend({

		constructor: function(options){

			options = getValue(options, this);

			var defaults = {
				factoryOptions: {},
				collection: new Backbone.Collection()
			};
			
			this.options = _.extend({}, _.result(this, 'options'), options);
			this.options = _.defaults(this.options, defaults);

			this.factory = new ViewFactory(this.options.factoryOptions);

			if(this.factory.viewType.prototype instanceof View === false){
				this.factory.viewType = ItemView;
			}
			
			ContainerView.call(this, this.options);

		},

		initialize: function(){

			this.listenTo(this.collection, 'add', this._onModelAdded, this);
			this.listenTo(this.collection, 'remove', this._onModelRemoved, this);
			this.listenTo(this.collection, 'reset', this._onCollectionReset, this);

		},

		_onModelAdded: function(model){

			if(this._hasBeenRendered){				
				var view = this._getChildView(model);
				view = this._addChildView(view, this.collection.indexOf(model));
				this.triggerMethod('add:view', view);
			}

		},

		_onModelRemoved: function(model){
			
			if(this._hasBeenRendered){				
				this._removeChildView(model);
			}

		},

		_onCollectionReset: function(){			
			if(this._hasBeenRendered){				
				this.render();
			}
		},

		_renderChildren: function(){

			var oldContainer = this.container;
			this.container = new ChildViewContainer();
			
			this.container.each(function(view){
				// only detach the views that are sticking around
				// so we don't lose any state information
				if(this.collection.get(view.model.cid)){
					view.$el.detach();
				}else{

					view.destroy();
					oldContainer.remove(view);
					
				}

			}, this);

			this.$el.empty();

			this.collection.each(function(model){

				var view = oldContainer.findByModelCid(model.cid);
				if(_.isUndefined(view)){
					view = this._getChildView(model);
				}

				this._addChildView(view);

			}, this);

		},

		_removeChildView: function(model){

			var view = this.container.findByModelCid(model.cid);
			this.container.remove(view);
			view.destroy();
			this.triggerMethod('remove:view', view);

		},

		_addChildView: function(view, index){

			this.container.add(view);
			//make sure if index is defined it is less than this.$el.children length

			if(!_.isUndefined(index) && index >= 0 && index < this.$el.children().length ){
				this.$el.children().eq(index).before(view.render().el);
				console.log(view.template);
			}else{
				this.$el.append(view.render().el);
			}
			return view;

		},

		_getChildView: function(model){

			var view = this.factory.getView(model);
			return view;
		}

	});

	return CollectionView;

});