define(['lodash', 'backbone', 'site/site', 'site/site-router'], function(_, Backbone, Site, SiteRouter){
	'use strict';

	var pages = [
		{
			field01: 'about'
		},
		{
			field01: 'services'
		},
		{
			field01: 'contact',
			layout: 'map',
			type: 'map'
		},
		{
			field01: 'gallery',
			link01: '?overlay=gallery'
		}
	];

	var site = new Site();
	site.addPages(pages);

	var router = new SiteRouter({
		site: site
	});
	var site_root = '/modiphy-js/test/site_runner/';


	Backbone.history.start({ pushState: true, root: site_root });

	describe('modiphy.site-router', function(){

		beforeEach(function(){

			

		});

		it('reference a site and its pages', function(){
			
			expect(router.site).toBe(site);
			expect(router.pages).toBe(site.pages);

		});

		describe('index route', function(){

			it('should select the first page', function(){
				router.navigate( '', {trigger: true} );
				expect(site.pages.normal.selected).toBe(site.pages.normal.at(0));

			});

		});

		it('should select page by name with url', function(){

			router.navigate( 'services', {trigger: true} );

			expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'services'}));

			router.navigate( 'about/', {trigger: true} );

			expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'about'}));

		});

		it('should use last url directory to select page', function(){

			router.navigate( 'about/contact', {trigger: true} );

			expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'contact'}));

			router.navigate( 'contact/about', {trigger: true} );

			expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'about'}));

			router.navigate( 'about/contact/services', {trigger: true} );

			expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'services'}));

			router.navigate( 'about/services/contact', {trigger: true} );

			expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'contact'}));

			router.navigate( 'about/services/about/', {trigger: true} );

			expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'about'}));

		});

		describe('if page is not found', function(){

			it('should create new page and select it', function(){

				router.navigate( 'new_page', {trigger: true} );

				expect(site.pages.normal.findWhere({name:'new_page'})).toBeDefined();

				expect(site.pages.normal.selected).toBe(site.pages.normal.findWhere({name:'new_page'}));

			});

		});

		describe('url query parameters', function(){

			describe('if "overlay" parameter', function(){

				it('should select overlay page', function(){

					router.navigate( 'about?overlay=gallery', {trigger: true} );

					expect(site.pages.overlay.selected).toBe(site.pages.overlay.findWhere({name:'gallery'}));

				});

				describe('if overlay page is not found', function(){

					it('should create new page and select it', function(){

						router.navigate( 'about?overlay=foobar', {trigger: true} );

						expect(site.pages.overlay.findWhere({name:'foobar'})).toBeDefined();

						expect(site.pages.overlay.selected).toBe(site.pages.overlay.findWhere({name:'foobar'}));

						router.navigate( 'about/contact?overlay=bar', {trigger: true} );

						expect(site.pages.overlay.selected).toBe(site.pages.overlay.findWhere({name:'bar'}));

						router.navigate( 'about/contact/maps?overlay=cake', {trigger: true} );

						expect(site.pages.overlay.selected).toBe(site.pages.overlay.findWhere({name:'cake'}));

					});

				});

				describe('if new query parameters are defined', function(){

					it('should deselect and then select currently selected overlay page', function(){

						router.navigate('contact', true);
						router.navigate('contact?overlay=gallery', true);

						expect(site.pages.normal.selected).toBe(site.pages.normal.get('contact'));

						expect(site.pages.overlay.selected).toBe(site.pages.overlay.get('gallery'));

						spyOn(site.pages.overlay, 'select').and.callThrough();
						spyOn(site.pages.overlay, 'deselect').and.callThrough();

						router.navigate('contact?overlay=gallery&hello=world', true);

						expect(site.pages.overlay.deselect).toHaveBeenCalled();
						expect(site.pages.overlay.select).toHaveBeenCalled();
						expect(site.pages.overlay.selected).toBe(site.pages.overlay.get('gallery'));

					});	

				});

			});

			describe('if no overlay parameter', function(){

				it('should deselect overlay page', function(){

					router.navigate( 'about?overlay=foobar', {trigger: true} );

					router.navigate('about', true);

					expect(router.pages.overlay.selected).not.toBeDefined();

					expect(router.pages.normal.selected).toBe(router.pages.normal.at(0));

				});

				describe('if new query parameters are defined', function(){

					it('should deselect and then select currently selected normal page', function(){

						router.navigate('services', true);

						expect(site.pages.normal.selected).toBe(site.pages.normal.get('services'));

						spyOn(site.pages.normal, 'select').and.callThrough();
						spyOn(site.pages.normal, 'deselect').and.callThrough();

						router.navigate('services?foo=bar', true);

						expect(site.pages.normal.deselect).toHaveBeenCalled();
						expect(site.pages.normal.select).toHaveBeenCalled();

						expect(site.pages.normal.selected).toBe(site.pages.normal.get('services'));


					});	

				});

			});			

			describe('"ignore_params"', function(){

				

			});

		});

	});

	afterAll(function(){

		// resetting url so it livereload will work
		//router.navigate( '', {trigger: true} );

	});
	

});