define(function(){
	'use strict';

	var specs = [		
		// 'spec/helpers',
		// 'spec/helpers/trigger-method',
		// 'spec/helpers/map-model',
		// 'spec/helpers/deparam',
		// 'spec/core/view',
		// 'spec/core/item-view',
		// 'spec/core/container-view',
		// 'spec/core/view-factory',
		// 'spec/core/collection-view',
		// 'spec/core/dom-collection-view'
		'spec/core/viewer'
		// 'spec/selectable/select-view',
		// 'spec/selectable/selectable-model',
		// 'spec/selectable/single-collection',
		// 'spec/selectable/multi-collection'

	];

	require(['boot'], function(){
		require(specs, function(){
			window.onload();
		});
	});
});