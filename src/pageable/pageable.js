define([
	'lodash',
	'modiphy',
	'pageable/page',
	'pageable/pages',
	'pageable/page-view',
	'pageable/page-loader',
	'pageable/page-to-title',
	'pageable/is-overlay-page'
	], function(
		_,
		M,
		Page,
		Pages,
		PageView,
		PageLoader,
		pageToTitle,
		isOverlayPage
	){
	'use strict';

	var Pageable = {

		Page: Page,
		Pages: Pages,
		PageView: PageView,
		PageLoader: PageLoader,
		pageToTitle: pageToTitle,
		isOverlayPage: isOverlayPage

	};

	return Pageable;
	
});