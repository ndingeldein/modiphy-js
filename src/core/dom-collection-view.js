define(['lodash', 'core/collection-view'], function(_, CollectionView){
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