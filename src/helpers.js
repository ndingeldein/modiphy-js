define([
	'helpers/trigger-method',
	'helpers/get-value',
	'helpers/deparam'
	], function(
		triggerMethod,
		getValue,
		deparam
	){
	'use strict';

	var M = {

		triggerMethod: triggerMethod,
		getValue: getValue,
		deparam: deparam

	};

	return M;
});