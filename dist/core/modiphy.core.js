// Trigger Method
// --------------
// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v2.4.1
//
// Copyright (c)2015 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.

define('helpers/trigger-method',['lodash'], function(_) {
    'use strict';

    var _triggerMethod = (function() {
        // split the event name on the ":"
        var splitter = /(^|:)(\w)/gi;

        // take the event section ("section1:section2:section3")
        // and turn it in to uppercase name
        function getEventName(match, prefix, eventName) {
            return eventName.toUpperCase();
        }

        return function(context, event, args) {
            var noEventArg = arguments.length < 3;
            if (noEventArg) {
                args = event;
                event = args[0];
            }

            // get the method name from the event name
            var methodName = 'on' + event.replace(splitter, getEventName);
            var method = context[methodName];
            var result;

            // call the onMethodName if it exists
            if (_.isFunction(method)) {
                // pass all args, except the event name
                result = method.apply(context, noEventArg ? _.rest(args) : args);
            }

            // trigger the event, if a trigger method exists
            if (_.isFunction(context.trigger)) {
                if (noEventArg + args.length > 1) {
                    context.trigger.apply(context, noEventArg ? args : [event].concat(_.drop(args, 0)));
                } else {
                    context.trigger(event);
                }
            }

            return result;
        };

    })();

    // Trigger an event and/or a corresponding method name. Examples:
    //
    // `this.triggerMethod("foo")` will trigger the "foo" event and
    // call the "onFoo" method.
    //
    // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
    // call the "onFooBar" method.
    var triggerMethod = function(event) {
        return _triggerMethod(this, arguments);
    };

    return triggerMethod;

});

// Trigger Method
// --------------
// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v2.4.1
//
// Copyright (c)2015 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com

// Similar to `_.result`, this is a simple helper
// If a function is provided we call it with context
// otherwise just return the value. If the value is
// undefined return a default value

define('helpers/get-value',['lodash'], function(_){
	'use strict';

	var getValue = function(value, context, params) {
		if (_.isFunction(value)) {
			value = params ? value.apply(context, params) : value.call(context);
		}
		return value;
	};

	return getValue;

});
define('helpers/map-model',['lodash'], function(_){
    'use strict';

    var mapModel = function(obj, map) {
        return _.mapKeys(obj, function(value, key){
        	return ( map[key] ) ? map[key] : key;
        });
    };

    return mapModel;

});

 /**
 *  
 * https://github.com/AceMetrix/jquery-deparam
 * Duncan Wong <baduncaduncan@gmail.com>
 * LICENSE: MIT
 *
 **/ 

 define('helpers/deparam',['jquery'], function($){
    'use strict';

    var fragment = function( params, coerce ) {
          
        var obj = {},
            coerce_types = { 'true': !0, 'false': !1, 'null': null };

        // Iterate over all name=value pairs.
        $.each( params.replace( /\+/g, ' ' ).split( '&' ), function(j,v){
            var param = v.split( '=' ),
            key = decodeURIComponent( param[0] ),
            val,
            cur = obj,
            i = 0,

            // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
            // into its component parts.
            keys = key.split( '][' ),
            keys_last = keys.length - 1;

            // If the first keys part contains [ and the last ends with ], then []
            // are correctly balanced.
            if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
                // Remove the trailing ] from the last keys part.
                keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );

                // Split first keys part into two parts on the [ and add them back onto
                // the beginning of the keys array.
                keys = keys.shift().split('[').concat( keys );

                keys_last = keys.length - 1;
            } else {
                // Basic 'foo' style key.
                keys_last = 0;
            }

            // Are we dealing with a name=value pair, or just a name?
            if ( param.length === 2 ) {
                val = decodeURIComponent( param[1] );

                // Coerce values.
                if ( coerce ) {
                    val = val && !isNaN(val)            ? +val              // number
                    : val === 'undefined'             ? undefined         // undefined
                    : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
                    : val;                                                // string
                }

                if ( keys_last ) {
                    // Complex key, build deep object structure based on a few rules:
                    // * The 'cur' pointer starts at the object top-level.
                    // * [] = array push (n is set to array length), [n] = array if n is 
                    //   numeric, otherwise object.
                    // * If at the last keys part, set the value.
                    // * For each keys part, if the current level is undefined create an
                    //   object or array based on the type of the next keys part.
                    // * Move the 'cur' pointer to the next level.
                    // * Rinse & repeat.
                    for ( ; i <= keys_last; i++ ) {
                        key = keys[i] === '' ? cur.length : keys[i];
                        cur = cur[key] = i < keys_last ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
                        : val;
                    }

                } else {
                    // Simple key, even simpler rules, since only scalars and shallow
                    // arrays are allowed.

                    if ( $.isArray( obj[key] ) ) {
                        // val is already an array, so push on the next value.
                        obj[key].push( val );

                    } else if ( obj[key] !== undefined ) {
                        // val isn't an array, but since a second value has been specified,
                        // convert val into an array.
                        obj[key] = [ obj[key], val ];

                    } else {
                        // val is a scalar.
                        obj[key] = val;
                    }
                }

            } else if ( key ) {
                // No value was defined, so set something meaningful.
                obj[key] = coerce ? undefined
                : '';
            }
        });

        return obj;
    };

    // remove leading text up to and including '?'
    var querystring = function(params, coerce){

        var i = params.indexOf('?');
        params = ( i === -1) ? '' : params.slice(i + 1);
       
        return fragment(params, coerce);

    };

    var deparam = {

       fragment: fragment,
       querystring: querystring

    };
 
    return deparam;

});
define('helpers',[
	'helpers/trigger-method',
	'helpers/get-value',
	'helpers/map-model',
	'helpers/deparam'
	], function(
		triggerMethod,
		getValue,
		mapModel,
		deparam
	){
	'use strict';

	var M = {

		triggerMethod: triggerMethod,
		getValue: getValue,
		mapModel: mapModel,
		deparam: deparam

	};

	return M;
});
define('core/view',['lodash', 'jquery', 'backbone', 'helpers/get-value', 'helpers/trigger-method'], function(_, $, Backbone, getValue, triggerMethod){
	'use strict';

	var View = Backbone.View.extend({

		constructor: function(options){

			_.bindAll(this, 'render');
			_.bindAll( this, 'show' );
			_.bindAll( this, 'hide' );
			_.bindAll( this, 'triggerShown' );
			_.bindAll( this, 'triggerHidden' );

			this._deferred = $.Deferred();
			this._deferred.promise(this);
			this._deferred.resolve();

			options = getValue(options, this);

			this.options = _.extend({}, _.result(this, 'options'), options);
			
			Backbone.View.call(this, this.options);
		},

		_isShowing: false,

		_isDestroyed: false,

		triggerMethod: triggerMethod,

		isShowing: function(){

			return this._isShowing;

		},

		show: function(){

			if(this._isShowing){ return this; }

			this._isShowing = true;

			this.triggerMethod('show');

			this.killTransitions();

			this._deferred = $.Deferred();
			this._deferred.done(_.bind(this.triggerMethod, this, 'shown'));

			if(_.isFunction(this.showTransition)){
				this.showTransition();
			}else{
				this._deferred.resolve();
			}

			return this._deferred.promise(this);

		},

		hide: function(){

			if(!this._isShowing){ return this; }

			this._isShowing = false;

			this.triggerMethod('hide');

			this.killTransitions();

			this._deferred = $.Deferred();
			this._deferred.done(_.bind(this.triggerMethod, this, 'hidden'));

			if(_.isFunction(this.hideTransition)){
				this.hideTransition();
			}else{
				this._deferred.resolve();
			}				

			return this._deferred.promise(this);

		},

		toggleShow: function(){

			if(this.isShowing()){
				this.hide();
			}else{
				this.show();
			}

		},

		triggerShown: function(){

			if(!this._isShowing){ return; }

			if(!this._deferred){ return; }

			this._deferred.resolve();

		},

		triggerHidden: function(){

			if(this._isShowing){ return; }

			if(!this._deferred){ return; }

			this._deferred.resolve();

		},

		killTransitions: function(){

			if(this._deferred){
				this._deferred.reject();
				this._deferred = undefined;
			}

		},

		destroy: function(){

			this.killTransitions();
			
			if(this._isDestroyed){ return this; }

			this.triggerMethod('before:destroy', this);

			this.$el.empty();
			this.undelegateEvents();

			this._isDestroyed = true;

			// destroy is triggered before remove() which calls stopListening()
			this.triggerMethod('destroy', this);

			this.remove();

			return this;
			
		}

	});

	return View;

});
define('selectable/select-view',['lodash', 'core/view'], function(_, View){
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
define('selectable/selectable-model',['backbone', 'backbone.select'], function(Backbone){
	'use strict';

	var SelectableModel = Backbone.Model.extend({

		initialize: function(){
			Backbone.Select.Me.applyTo(this);
		}

	});

	return SelectableModel;

});
define('selectable/single-collection',['backbone', 'backbone.select'], function(Backbone){
	'use strict';

	var SingleCollection = Backbone.Collection.extend({

		initialize: function(models){
			Backbone.Select.One.applyTo(this, models);
		}

	});

	return SingleCollection;

});
define('selectable/multi-collection',['backbone', 'backbone.select'], function(Backbone){
	'use strict';

	var MultiCollection = Backbone.Collection.extend({

		initialize: function(models){			
			Backbone.Select.Many.applyTo(this, models);
		}

	});

	return MultiCollection;

});
define('selectable',[
	'lodash',
	'selectable/select-view',
	'selectable/selectable-model',
	'selectable/single-collection',
	'selectable/multi-collection'
	], function(
		_,		
		SelectView,
		SelectableModel,
		SingleCollection,
		MultiCollection
	){
	'use strict';

	var Selectable = {

		SelectView: SelectView,
		SelectableModel: SelectableModel,
		SingleCollection: SingleCollection,
		MultiCollection: MultiCollection

	};

	return Selectable;
});
define('core/item-view',['core/view'], function(View){
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
define('core/view-factory',['lodash', 'core/view', 'core/item-view'], function(_, View, ItemView){
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
define('core/container-view',['core/view', 'backbone.babysitter'], function(View, ChildViewContainer){
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

		/**
		
			TODO:
			- if child view.options.el is defined need to make sure it is a child of parent view otherwise append
		
		**/
		

		_renderChildren: function(){

			this.container.each(function(view){

				view.render();
				if(!view.options.el || !this.el.contains(view.el)){
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
define('core/collection-view',['lodash', 'backbone', 'core/view', 'core/item-view', 'backbone.babysitter', 'core/container-view', 'helpers/get-value', 'core/view-factory'], function(_, Backbone, View, ItemView, ChildViewContainer, ContainerView, getValue, ViewFactory){
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
define('core/dom-collection-view',['lodash', 'core/collection-view'], function(_, CollectionView){
	'use strict';

	var DomCollectionView = {

		applyTo: function(view){

			if((_.isUndefined(view)) || view instanceof CollectionView !== true){
				throw new Error('view is undefined or view is not instance of CollectionView');
			}

			if(view.$el.children().length !== view.collection.length || _.isUndefined(view.collection)){
				throw new Error('view has no collection or collection length does not match view el\'s children length');
			}

			view.collection.each(setDomViewEl, view);

		}

	};

	function setDomViewEl(model, index){
		// getting "possible strict mode violation" from jshint
		/*jshint validthis:true */

		// grab the model property that the factory
		//looks for the view options.
		// default is viewOptions
		var prop = this.factory.modelViewOptionsProperty;
		// // only change the el and leave the other viewOptions
		var viewOptions = model.get(prop) ? model.get(prop) : {};

		viewOptions.el = this.$el.children().eq(index);
		model.set(prop, viewOptions);

	}

	return DomCollectionView;

});
define('core/viewer',['lodash', 'backbone', 'core/view', 'core/container-view', 'helpers/get-value'], function(_, Backbone, View, ContainerView, getValue){
	'use strict';

	var Viewer = ContainerView.extend({

		constructor: function(options){

			options = getValue(options, this);

			if(options.model){
				options.model.set('view', undefined);
			}else{
				options.model = new Backbone.Model();
			}

			this.options = _.extend({}, _.result(this, 'options'), options);
			
			ContainerView.call(this, this.options);

		},

		initialize: function(){
			
			this.listenTo(this.model, 'change:view', this._onViewChanged, this);

		},

		_onViewChanged: function(model){

			if(model.get('view') instanceof View){
				this._setView();
			}
		},

		_setView: function(){			

			if(this._currentView && !this._previousView){
				this._previousView = this._currentView;
			}
			this._currentView = this.model.get('view');

			this.container.add(this._currentView);

			if(this.container.length > 1){				
				this._previousView.hide().done(_.bind(this._removePreviousViews, this));
			}else{
				this._renderChildren();
				this._currentView.show();
			}

		},

		_removePreviousViews: function(){

			this.container.each(this._removePreviousView, this);
			this._previousView = undefined;
			this._renderChildren();
			this._currentView.show();

		},

		_removePreviousView: function(view){

			if(view.cid != this.model.get('view').cid){
				this._destroyItemView(view);
			}

		},

		getCurrentView: function(){
			return this.model.get('view');
		}

	});



	return Viewer;

});
define('core',[
	'lodash',
	'helpers',
	'selectable',
	'core/view',
	'core/item-view',
	'core/view-factory',
	'core/container-view',
	'core/collection-view',
	'core/dom-collection-view',
	'core/viewer'
	], function(
		_,
		M,
		Selectable,
		View,
		ItemView,
		ViewFactory,
		ContainerView,
		CollectionView,
		DomCollectionView,
		Viewer
	){
	'use strict';

	var core = {

		View: View,
		ItemView: ItemView,
		ViewFactory: ViewFactory,
		ContainerView: ContainerView,
		CollectionView: CollectionView,
		DomCollectionView: DomCollectionView,
		Viewer: Viewer

	};
		
	_.extend(M, core, Selectable);

	return M;
});
define('modiphy',['core'], function(M){
	'use strict';

	return M;
});

define("core/modiphy.core", function(){});
