define(['lodash'], function(_){
    'use strict';

    var mapModel = function(obj, map) {
        return _.mapKeys(obj, function(value, key){
        	return ( map[key] ) ? map[key] : key;
        });
    };

    return mapModel;

});
