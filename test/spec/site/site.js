define(['lodash', 'modiphy', 'site/site', 'modiphy.pageable'], function(_, M, Site){
	'use strict';

	var site;
	var np = [
		{
			field01: 'about'
		},
		{
			field01: 'services'
		}
	];
	var op = [
		{
			field01: 'about'
		},		
		{
			field01: 'contact',
			field04: 'map',
			field05: 'map'
		},
		{
			field01: 'gallery',
			link01: '?overlay=gallery'
		},
		{
			name: 'youtube',
			link01: '?overlay=youtube'
		}
	];

	var cp = [

		{
			foo: 'fighters',
			bar: 'fights'
		},

		{
			foo: 'foo',
			bar: 'Bar Binx'
		}

	]

	describe('modiphy.site', function(){

		beforeEach(function(){

			site = new Site();

		});

		describe('addPages', function(){

			beforeEach(function(){

				site.addPages([np, op]);

			});

			it('should map the models as pages', function(){

				expect(site.pages.normal.findWhere({name: 'about'})).toBeDefined();
				expect(site.pages.normal.findWhere({layout: 'map'})).toBeDefined();
				expect(site.pages.normal.findWhere({type: 'map'})).toBeDefined();

			});

			it('should separate normal and overlay pages', function(){
			
				expect(site.pages.normal.findWhere({name: 'about'})).toBeDefined();
				expect(site.pages.overlay.findWhere({name: 'youtube'})).toBeDefined();

			});

			it('should remove duplicate names', function(){

				expect(site.pages.normal.where({name: 'about'}).length).toBe(1);

			});			

			it('by default should ignore identically named pages', function(){

				site.addPages([{
					field01: 'about',
					navText: 'About Me'
				}]);

				expect(site.pages.normal.where({name:'about'}).length).toBe(1);
				expect(site.pages.normal.findWhere({name:'about'}).get('navText')).toBe('About');

			});

			it('should retain previous pages', function(){

				site.addPages([cp], {
					map: {
						foo: 'name',
						bar: 'navText'
					}
				});

				expect(site.pages.normal.findWhere({name: 'contact'})).toBeDefined();

			});

			it('should accept an array of pages or 1 page', function(){

				expect(site.pages.normal.length).toBeGreaterThan(1);

				site.pages.normal.reset();
				site.pages.overlay.reset();
				site.addPages({
					field01: 'new'
				});

				expect(site.pages.normal.length).toBe(1);
				expect(site.pages.overlay.length).toBe(0);
				expect(site.pages.normal.at(0).get('name')).toBe('new');


				site.addPages({
					field01: 'hotdog',
					link01: '?overlay=hotdog'
				});

				expect(site.pages.normal.length).toBe(1);
				expect(site.pages.overlay.length).toBe(1);
				expect(site.pages.overlay.at(0).get('name')).toBe('hotdog');
				

			});

			describe('options (2nd parameter)', function(){


				

				it('by should be able to merge in new page', function(){

					site.addPages([{
							field01: 'about',
							navText: 'About Me'
						}], {						
						merge: true
					});

					expect(site.pages.normal.findWhere({name: 'contact'})).toBeDefined();

					expect(site.pages.normal.where({name:'about'}).length).toBe(1);
					expect(site.pages.normal.findWhere({name:'about'}).get('navText')).toBe('About Me');

				});

				it('should default as old flux gallery map', function(){

					var p = site.pages.normal.findWhere({name:'contact'});
					expect(p.get('layout')).toBe('map');
					expect(p.get('type')).toBe('map');

				});

				it('should be able to apply custom map', function(){

					site.addPages([cp], {
						map: {
							foo: 'name',
							bar: 'navText'
						}						
					});

					expect(site.pages.normal.findWhere({name:'fighters'})).toBeDefined();
					expect(site.pages.normal.findWhere({name:'foo'}).get('navText')).toBe('Bar Binx');

				});

			});


		});

		// describe('PageView factory', function(){

		// 	beforeEach(function(){
		// 		site.addPages([np, op]);
		// 	});

		// 	it('should have a viewPrototype of "M.PageView', function(){

		// 		expect(site.factory.viewPrototype).toBe(M.PageView);

		// 		//site.factory.registerViewType('default', MyView);

		// 		var model = site.pages.normal.at(0);
		// 		var view = site.factory.getView(model);
				

		// 	});

		// });
		
	});

});