define([
	'lodash',
	'modiphy',
	'pageable/page',
	'pageable/pages',
	'pageable/page-loader',
	'pageable/page-to-title'
	], function(
		_,
		M,
		Page,
		Pages,
		PageLoader,
		pageToTitle
	){
	'use strict';

	var Pageable = {

		Page: Page,
		Pages: Pages,
		PageLoader: PageLoader,
		pageToTitle: pageToTitle

	};

	return Pageable;
	
});