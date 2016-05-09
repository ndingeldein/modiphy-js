define(function(){
	'use strict';

	var specs = [
		// 'spec/siteable/overlay-page-wrapper'
		'spec/siteable/site'
		//'spec/siteable/site-router',		
	];

	require(['boot'], function(){
		require(specs, function(){
			window.onload();
		});
	});
});