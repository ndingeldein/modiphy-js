// Trigger Method
// --------------
// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v2.4.1
//
// Copyright (c)2015 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com

// Similar to `_.result`, this is a simple helper
// If a function is provided we call it with context
// otherwise just return the value. If the value is
// undefined return a default value

define(['lodash'], function(_){
	'use strict';

	var getValue = function(value, context, params) {
		if (_.isFunction(value)) {
			value = params ? value.apply(context, params) : value.call(context);
		}
		return value;
	};

	return getValue;

});