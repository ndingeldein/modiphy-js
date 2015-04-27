define([
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