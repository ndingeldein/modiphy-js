define([
	'lodash',
	'modiphy',
	'gallery/gallery'
	], function(
		_,
		M,
		Gallery
	){
	'use strict';

	_.extend(M, Gallery);

	return M;
	
});