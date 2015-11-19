define(['lodash', 'helpers/deparam'], function(_, deparam){
	'use strict';

	describe('modiphy.js deparam helper', function(){

		describe('deparam.fragment', function(){

			it('should convert frament to object with params key value pairs', function(){

				var str = 'score=22&home=jags&away=panthers';

				expect(deparam.fragment(str)).toEqual({

					score: '22',
					home: 'jags',
					away: 'panthers'

				});

			});

		});

		describe('deparam.querystring', function(){

			it('should remove leading ? and url path', function(){

				var str = 'http://www.espn.com/nfl?score=22';

				expect(deparam.querystring(str)).toEqual({

					score: '22'

				});

			});

			it('should return an empty object if ? is not found', function(){

				var str = 'http://www.espn.com/nfl';

				expect(deparam.querystring(str)).toEqual({});

			});

		});

	});

});