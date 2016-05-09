define([
	'lodash',
	'modiphy',
	'siteable/siteable',
	'backbone.queryparams'
	], function(
		_,
		M,
		Siteable
	){
	'use strict';

	_.extend(M, Siteable);

	return M;
	
});