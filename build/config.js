require.config({
	baseUrl: '../src',
    paths: {       
        'lodash': '../bower_components/lodash/lodash',     
        'jquery': '../bower_components/jquery/dist/jquery',
        'backbone': '../bower_components/backbone/backbone',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'backbone.select': '../bower_components/backbone.select/dist/amd/backbone.select',
        'backbone.queryparams': '../bower_components/backbone-query-parameters/backbone.queryparams',
    },
    map: {
        '*': {
            'underscore': 'lodash'
        }
    }

});
define();