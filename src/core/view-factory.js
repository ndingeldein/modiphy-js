define(['lodash', 'core/view', 'core/item-view'], function(_, View, ItemView){
	'use strict';

	var ViewFactory = function(options){

		var defaults = {
			viewOptions : {},
			viewType: ItemView,
			viewPrototype: View,
			modelViewOptionsProperty: 'viewOptions',
			modelViewTypeProperty: 'viewType'
		};

		options = options ? options : {};
		_.extend(this, _.defaults(options, defaults));

	};

	_.extend(ViewFactory.prototype, {

		getView: function(model){

			var ViewType = this._getViewType(model);

			var viewOptions = _.extend(this._getViewOptions(model), { model: model });

			var view = new ViewType(viewOptions);

			return view;

		},

		_getViewType: function(model){

			var viewType = model.get(this.modelViewTypeProperty);

			if(_.isFunction(viewType) && viewType.prototype instanceof this.viewPrototype){
				return viewType;
			}else{
				return this.viewType;
			}

		},

		_getViewOptions: function(model){

			var viewOptions = model.get(this.modelViewOptionsProperty);
			return (viewOptions) ? viewOptions : this.viewOptions;			

		}

	});

	return ViewFactory;

});