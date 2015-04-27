define([
	'helpers/trigger-method',
	'helpers/get-value'
	], function(
		triggerMethod,
		getValue
	){
	'use strict';

	var M = {

		triggerMethod: triggerMethod,
		getValue: getValue

	};

	return M;
});