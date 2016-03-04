define(['lodash', 'core/view', 'core/item-view'], function(_, View, ItemView){
	'use strict';

	var ViewFactory = function(options){

		var defaults = {
			viewOptions : {},
			defaultViewType: ItemView,
			viewPrototype: View,
			modelViewOptionsProperty: 'viewOptions',
			modelViewTypeProperty: 'viewType'
		};

		this._viewTypes = {};

		options = options ? options : {};
		_.extend(this, _.defaults(options, defaults));

		this.registerViewType('default', this.defaultViewType);		

	};

	_.extend(ViewFactory.prototype, {

		registerViewType: function(name, viewType){

			if(_.isFunction(viewType) && viewType.prototype instanceof this.viewPrototype){
				this._viewTypes[name] = viewType;
				if(name == 'default'){
					this.defaultViewType = viewType;
				}
			}

		},

		getView: function(model){

			var ViewType = this._getViewType(model);

			var viewOptions = _.extend(this._getViewOptions(model), { model: model });

			var view = new ViewType(viewOptions);

			return view;

		},

		_getViewType: function(model){

			var viewType = model.get(this.modelViewTypeProperty);

			return ( this._viewTypes[viewType] ) ? this._viewTypes[viewType] : this._viewTypes['default'];

		},

		_getViewOptions: function(model){

			var viewOptions = model.get(this.modelViewOptionsProperty);
			return (viewOptions) ? viewOptions : this.viewOptions;			

		}

	});

	return ViewFactory;

});