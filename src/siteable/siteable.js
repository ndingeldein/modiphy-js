define([
	'lodash',
	'modiphy',
	'siteable/site',
	'siteable/site-router',
	'siteable/overlay-page-wrapper'
	], function(
		_,
		M,
		Site,
		SiteRouter,
		OverlayPageWrapper
	){
	'use strict';

	var Siteable = {

		Site: Site,
		SiteRouter: SiteRouter,
		OverlayPageWrapper: OverlayPageWrapper

	};

	return Siteable;
	
});