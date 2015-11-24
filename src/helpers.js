define([
	'helpers/trigger-method',
	'helpers/get-value',
	'helpers/map-model',
	'helpers/deparam'
	], function(
		triggerMethod,
		getValue,
		mapModel,
		deparam
	){
	'use strict';

	var M = {

		triggerMethod: triggerMethod,
		getValue: getValue,
		mapModel: mapModel,
		deparam: deparam

	};

	return M;
});