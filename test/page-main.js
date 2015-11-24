define(function(){
	'use strict';

	var specs = [		
		'spec/pageable/page',
		'spec/pageable/pages',
		'spec/pageable/page-loader',
		'spec/pageable/page-to-title',
		'spec/pageable/pageable'
	];

	require(['boot'], function(){
		require(specs, function(){
			window.onload();
		});
	});
});