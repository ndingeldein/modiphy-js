define(function(){
	'use strict';

	var pageToTitle = function(str){
		return str.split('-').join(' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	return pageToTitle;

});