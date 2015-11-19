define(['modiphy', 'lodash'], function(M, _){
	'use strict';

	var pageToTitle = function(str){
		return str.split('_').join(' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	_.extend(M, {

		pageToTitle: pageToTitle

	});

	return M;

});