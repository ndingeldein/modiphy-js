define(['lodash', 'backbone', 'core/view', 'core/container-view', 'helpers/get-value'], function(_, Backbone, View, ContainerView, getValue){
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