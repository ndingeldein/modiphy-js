define(function(){
	'use strict';

	var specs = [		
		'spec/site/site'
		// 'spec/site/site-router'
	];

	require(['boot'], function(){
		require(specs, function(){
			window.onload();
		});
	});
});