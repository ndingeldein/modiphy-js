require.config({
	baseUrl: '../src',
    paths: {       
        'lodash': '../bower_components/lodash/lodash',     
        'jquery': '../bower_components/jquery/dist/jquery',
        'backbone': '../bower_components/backbone/backbone',
        'backbone.babysitter': '../bower_components/backbone.babysitter/lib/backbone.babysitter',
        'backbone.select': '../bower_components/backbone.select/dist/amd/backbone.select'
    },
    map: {
        '*': {
            'underscore': 'lodash'
        }
    }

});
define();