define(function(){
	'use strict';

	var specs = [		
		'spec/modiphy',
		'spec/helpers',
		'spec/core'
		// 'spec/helpers/trigger-method',
		// 'spec/core/view',
		// 'spec/core/item-view',
		// 'spec/core/container-view',
		// 'spec/core/view-factory',
		// 'spec/core/collection-view',
		// 'spec/core/dom-collection-view',
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