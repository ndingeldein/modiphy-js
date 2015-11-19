define(function(){
	'use strict';

	var specs = [		
		'spec/pageable/page',
		'spec/pageable/pages',
		'spec/pageable/page-loader'
	];

	require(['boot'], function(){
		require(specs, function(){
			window.onload();
		});
	});
});