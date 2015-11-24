module.exports = function(grunt){

	grunt.initConfig({

		requirejs: {
			compile: {
				options: {
					baseUrl: 'src',
					mainConfigFile: 'build/config.js',
					// out: 'dist/modiphy.js',
					removeCombined: true,
					dir: 'dist',
					optimize: 'none',
					// name: 'modiphy'
					modules: [
					{
						name: 'modiphy',
						exclude: ['lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					},{
						name: 'modiphy.min',
						override: {
							optimize: 'uglify'
						},
						create: true,
						include: ['modiphy'],
						exclude: ['lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					},{
						name: 'modiphy.bundled',
						override: {
							optimize: 'uglify'
						},
						create: true,
						include: ['modiphy']
					},{
						name: 'core/modiphy.core',
						create: true,
						include: ['modiphy'],
						exclude: ['lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					},{
						name: 'core/modiphy.core.min',
						create: true,
						override: {
							optimize: 'uglify'
						},
						include: ['modiphy'],
						exclude: ['lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					},{
						name: 'core/modiphy.core.bundled',
						create: true,
						override: {
							optimize: 'uglify'
						},
						include: ['modiphy']
					},{
						name: 'dep/modiphy.dep',
						create: true,
						override: {
							optimize: 'uglify'
						},
						include: ['lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']					
					},{
						name: 'gallery/modiphy.gallery',
						create: true,
						include: ['gallery/gallery'],
						exclude: ['modiphy', 'lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					},{
						name: 'gallery/modiphy.gallery.min',
						create: true,
						override: {
							optimize: 'uglify'
						},
						include: ['gallery/gallery'],
						exclude: ['modiphy', 'lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					},{
						name: 'pageable/modiphy.pageable',
						create: true,
						include: ['pageable/pageable'],
						exclude: ['modiphy', 'lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					},{
						name: 'pageable/modiphy.pageable.min',
						create: true,
						override: {
							optimize: 'uglify'
						},
						include: ['pageable/pageable'],
						exclude: ['modiphy', 'lodash', 'backbone', 'jquery', 'backbone.babysitter', 'backbone.select']
					}]
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['requirejs']);

};