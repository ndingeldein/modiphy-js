define([
	'lodash',
	'modiphy',
	'pageable/pageable'
	], function(
		_,
		M,
		Pageable
	){
	'use strict';

	_.extend(M, Pageable);

	return M;
	
});