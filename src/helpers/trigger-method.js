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

// Trigger an event and/or a corresponding method name. Examples:
//
// `this.triggerMethod("foo")` will trigger the "foo" event and
// call the "onFoo" method.
//
// `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
// call the "onFooBar" method.

define(['lodash'], function(_) {
    'use strict';

    var _triggerMethod = (function() {
        // split the event name on the ":"
        var splitter = /(^|:)(\w)/gi;

        // take the event section ("section1:section2:section3")
        // and turn it in to uppercase name
        function getEventName(match, prefix, eventName) {
            return eventName.toUpperCase();
        }

        return function(context, event, args) {
            var noEventArg = arguments.length < 3;
            if (noEventArg) {
                args = event;
                event = args[0];
            }

            // get the method name from the event name
            var methodName = 'on' + event.replace(splitter, getEventName);
            var method = context[methodName];
            var result;

            // call the onMethodName if it exists
            if (_.isFunction(method)) {
                // pass all args, except the event name
                result = method.apply(context, noEventArg ? _.rest(args) : args);
            }

            // trigger the event, if a trigger method exists
            if (_.isFunction(context.trigger)) {
                if (noEventArg + args.length > 1) {
                    context.trigger.apply(context, noEventArg ? args : [event].concat(_.drop(args, 0)));
                } else {
                    context.trigger(event);
                }
            }

            return result;
        };

    })();

    // Trigger an event and/or a corresponding method name. Examples:
    //
    // `this.triggerMethod("foo")` will trigger the "foo" event and
    // call the "onFoo" method.
    //
    // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
    // call the "onFooBar" method.
    var triggerMethod = function(event) {
        return _triggerMethod(this, arguments);
    };

    return triggerMethod;

});
