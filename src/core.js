define([
	'lodash',
	'helpers',
	'selectable',
	'core/view',
	'core/item-view',
	'core/view-factory',
	'core/container-view',
	'core/collection-view',
	'core/dom-collection-view'
	], function(
		_,
		M,
		Selectable,
		View,
		ItemView,
		ViewFactory,
		ContainerView,
		CollectionView,
		DomCollectionView
	){
	'use strict';

	var core = {

		View: View,
		ItemView: ItemView,
		ViewFactory: ViewFactory,
		ContainerView: ContainerView,
		CollectionView: CollectionView,
		DomCollectionView: DomCollectionView

	};
		
	_.extend(M, core, Selectable);

	return M;
});