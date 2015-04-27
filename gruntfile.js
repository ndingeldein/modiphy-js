module.exports = function(grunt){

	grunt.initConfig({

		requirejs: {
			compile: {
				options: {
					baseUrl: 'src',
					mainConfigFile: 'build/config.js',
					out: 'dist/modiphy.js',
					removeCombined: true,
					// dir: 'dist'
					name: 'modiphy'
					// modules: [{
					// 	name: 'modiphy'
					// }]
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['requirejs']);

};