define([
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