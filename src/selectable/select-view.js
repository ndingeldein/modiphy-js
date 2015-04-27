define(['lodash', 'core/view'], function(_, View){
	'use strict';

	var Mixins = {

		SelectMe: {

			_onSelectModel: function(model){
				this.triggerMethod('select:view', this, model);
			},

			_onDeselectModel: function(model){
				this.triggerMethod('deselect:view', this, model);
			},

			_onReselectModel: function(model){
				this.triggerMethod('reselect:view', this, model);
			}
		},

		SelectOne: {

			_onSelectOneModel: function(model, collection){

				this.triggerMethod('select:one:view', this, model, collection);

			},

			_onDeselectOneModel: function(model, collection){

				this.triggerMethod('deselect:one:view', this, model, collection);

			},

			_onReselectOneModel: function(model, collection){

				this.triggerMethod('reselect:one:view', this, model, collection);

			}

		},

		SelectMany: {

			_onSelectAllModels: function(selected, collection){

				// selected is a diff "hash" of which models are selected or deselected
				// {selected: [...], deselected: [...]}
				this.triggerMethod('select:all:view', this, selected, collection);

			},

			_onSelectNoneModels: function(selected, collection){

				// selected is a diff "hash" of which models are selected or deselected
				// {selected: [...], deselected: [...]}
				this.triggerMethod('select:none:view', this, selected, collection);

			},

			_onSelectSomeModels: function(selected, collection){

				// selected is a diff "hash" of which models are selected or deselected
				// {selected: [...], deselected: [...]}
				this.triggerMethod('select:some:view', this, selected, collection);

			},

			_onReselectAnyModels: function(selected, collection){

				// selected is an array of selected models
				this.triggerMethod('reselect:any:view', this, selected, collection);

			},

		}

	},

	SelectableView = {

		Me: {

			applyTo: function(view){

				if(_.isUndefined(view.model) || view instanceof View === false){		
					throw new Error( 'The view is not an instance of M.View or view.model is undefined' );
				}

				_.extend(view, Mixins.SelectMe);
				view.listenTo(view.model, 'selected', view._onSelectModel,view);
				view.listenTo(view.model, 'deselected', view._onDeselectModel,view);
				view.listenTo(view.model, 'reselected', view._onReselectModel,view);
			}

		},

		One: {

			applyTo: function(view){

				if(_.isUndefined(view.collection) || view instanceof View === false){		
					throw new Error( 'The view is not an instance of M.View or view.collection is undefined' );
				}

				_.extend(view, Mixins.SelectOne);
				view.listenTo(view.collection, 'select:one', view._onSelectOneModel);
				view.listenTo(view.collection, 'deselect:one', view._onDeselectOneModel);
				view.listenTo(view.collection, 'reselect:one', view._onReselectOneModel);

			}

		},

		Many: {

			applyTo: function(view){

				_.extend(view, Mixins.SelectMany);
				view.listenTo(view.collection, 'select:all', view._onSelectAllModels);
				view.listenTo(view.collection, 'select:none', view._onSelectNoneModels);
				view.listenTo(view.collection, 'select:some', view._onSelectSomeModels);
				view.listenTo(view.collection, 'reselect:any', view._onReselectAnyModels);

			}

		}

	};

	return SelectableView;

});