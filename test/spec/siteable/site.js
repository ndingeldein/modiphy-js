define(['lodash', 'jquery', 'modiphy', 'siteable/site', 'modiphy.pageable', 'jasmine-jquery'], function(_, $, M, Site){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../../test/fixtures';
	loadFixtures('links.html');

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

	var TextView = M.PageView.extend({

	});

	describe('modiphy.site', function(){

		beforeEach(function(){

			site = new Site();
			site.factory.registerViewType('default', TextView);

		});

		describe('options', function(){

			it('should have a boolean isMobile property', function(){

				expect(site.isMobile).toBe(true);

				site = new Site({
					isMobile: false
				});

				expect(site.isMobile).toBe(false);

			});

			it('should have a pushstate root', function(){

				expect(site.rootDirectory).toBe('');

				site = new Site({
					rootDirectory: '/main/'
				});

				expect(site.rootDirectory).toBe('/main/');

			});

			it('should have a directLink', function(){

				expect(site.directLink).toBe('');

				site = new Site({
					directLink: 'http://google.com'
				});

				expect(site.directLink).toBe('http://google.com');

			});

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

		describe('View Factory', function(){

			it('should have a view prototype of M.PageView ', function(){

				expect(site.factory.viewPrototype).toBe(M.PageView);

			});

			it('should have modelViewTypeProperty of "type"', function(){

				expect(site.factory.modelViewTypeProperty).toBe('type');

			});	

		});

		describe('startHistory method', function(){

			// it('should initiate Backbone history with pushstate and set router', function(){

			// 	spyOn(Backbone.history, 'start').and.callThrough();

			// 	site.rootDirectory = '/main/';
			// 	site.startHistory();

			// 	expect(Backbone.history.start).toHaveBeenCalled();
			// 	expect(Backbone.history.start).toHaveBeenCalledWith({
			// 		pushState: true,
			// 		root: '/main/'
			// 	});

			// 	expect(site.router).toBeDefined();


			// });



			/**
			
				TODO:
				- Not sure how write a test for this
			
			 */
			

			// it('should add the delegate click handler', function(){

			// 	spyOn(site, '_delegateClick');
			// 	$('a.directLink').trigger('click');
			// 	expect(site._delegateClick).toHaveBeenCalled();

			// });

		});

		describe('When normal page is selected', function(){

			beforeEach(function(){
				site.addPages([np, op]);
			});

			it('should load the selected page', function(){

				spyOn(site.pageLoader, 'load').and.callThrough();

				// site.pages.normal.at(1).once('page:loaded', loadable.pageLoaded);
				site.pages.normal.at(1).select();

				expect(site.pageLoader.load).toHaveBeenCalled();				
				expect(site.pageLoader.load.calls.mostRecent().args[0]).toBe(site.pages.normal.at(1));

			});

			it('should call page selected mothod if it exists', function(){

				_.extend(site, {
					onPageSelected: function(){}
				});

				spyOn(site, 'onPageSelected').and.callThrough();
				

				site.pages.normal.at(2).select();

				expect(site.onPageSelected).toHaveBeenCalled();	
				
				expect(site.onPageSelected.calls.mostRecent().args[0]).toBe(site.pages.normal.at(2));

			});

			describe('When normal page is loaded', function(){

				it('should create and set pageview', function(done){

					var pageLoaded = function(){
						expect(site.viewer.model.get('view').model).toBe(site.pages.normal.selected);
						done();
					}

					site.pages.normal.at(1).select();

					site.pages.normal.on('page:loaded', pageLoaded);

				});

			});

			it('should add layout class to the body (page-layout)', function(){

				site.pages.normal.at(2).select();

				expect($('body').hasClass('map-page')).toBe(true);

			});

		});

		describe('When overlay page is selected', function(){

			beforeEach(function(){
				site.addPages([np, op]);
			});

			it('should load the selected page', function(){

				spyOn(site.overlayPageLoader, 'load').and.callThrough();

				// site.pages.normal.at(1).once('page:loaded', loadable.pageLoaded);
				site.pages.overlay.at(0).select();

				expect(site.overlayPageLoader.load).toHaveBeenCalled();				
				expect(site.overlayPageLoader.load.calls.mostRecent().args[0]).toBe(site.pages.overlay.at(0));

			});

			it('should call page selected method if it exists', function(){

				_.extend(site, {
					onOverlayPageSelected: function(){}
				});

				spyOn(site, 'onOverlayPageSelected').and.callThrough();
				

				site.pages.overlay.at(1).select();

				expect(site.onOverlayPageSelected).toHaveBeenCalled();	
				
				expect(site.onOverlayPageSelected.calls.mostRecent().args[0]).toBe(site.pages.overlay.at(1));

			});

			it('should show the overlay page wrapper', function(){

				spyOn(site.overlayPageWrapper, 'show');

				site.pages.overlay.at(0).select();
				expect(site.overlayPageWrapper.show).toHaveBeenCalled();

			});

			describe('When overlay page is loaded', function(){

				it('should create and set pageview', function(done){

					var pageLoaded = function(){
						expect(site.overlayViewer.model.get('view').model).toBe(site.pages.overlay.selected);
						done();
					}

					site.pages.overlay.at(0).select();

					site.pages.overlay.on('page:loaded', pageLoaded);

				});

			});

			// describe('when no overlaypages are selected', function(){

			// 	it('should hide the overlay page wrapper', function(){

			// 		site.rootDirectory = '/modiphy-js/test/site_runner/';
			// 		site.startHistory();

			// 		site.router.navigate('about?overlay=youtube', {trigger: true});	

			// 		spyOn(site.overlayPageWrapper, 'hide');

			// 		site.router.navigate('about', {trigger:true});

			// 		expect(site.overlayPageWrapper.hide).toHaveBeenCalled();
					

			// 	});

			// });


		});


		// describe('_delegateClick handler', function(){

		// 	describe('if link is a directLink', function(){

		// 		beforeEach(function(){

		// 			site.directLink = 'http://foo.com/';

		// 		});

		// 		it('should update pushstate', function(){

					

		// 		});

		// 	});

		// });

		
	});

});