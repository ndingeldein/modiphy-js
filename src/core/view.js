define(['lodash', 'jquery', 'backbone', 'helpers/get-value', 'helpers/trigger-method'], function(_, $, Backbone, getValue, triggerMethod){
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