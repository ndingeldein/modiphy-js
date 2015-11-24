define(['backbone', 'modiphy', 'pageable/page', 'lodash'], function(Backbone, M, Page, _){
	'use strict';

	var page;

	describe('Page', function(){

		beforeEach(function(){

			page = new Page();

		});

		it('should apply Backbone.Select.Me mixin to the model', function(){

			spyOn(Backbone.Select.Me, 'applyTo');

			var myPage = new Page();

			expect(Backbone.Select.Me.applyTo).toHaveBeenCalledWith(myPage);

		});

		describe('isOverlayPage method', function(){

			it('should return false if page is not an overlay page', function(){

				expect(page.isOverlayPage()).toBe(false);

				page = new Page({
					linkUrl: 'notanoverlay'
				});

				expect(page.isOverlayPage()).toBe(false);

			});

			it('should return true if page is an overlay page', function(){

				page = new Page({
					linkUrl: '?overlay=am_an_overlay'
				});

				expect(page.isOverlayPage()).toBe(true);

			});

		});

		describe('isLoaded method', function(){

			it('should return false if page html content is undefined', function(){

				page.get('content').json = {};
				expect(page.isLoaded()).toBe(false);

			});

			it('should return false if page json content is undefined', function(){

				page.get('content').html = '';
				expect(page.isLoaded()).toBe(false);

			});

			it('should return true if page json content and html content are defined', function(){

				expect(page.isLoaded()).toBe(false);
				page.get('content').html = '';
				page.get('content').json = {};
				expect(page.isLoaded()).toBe(true);
				

			});

		});

		describe('properties', function(){

			describe('"content"', function(){

				it('should be an empty object', function(){

					expect(_.isPlainObject(page.get('content'))).toBe(true);
					expect(page.get('content').html).toBeUndefined();
					expect(page.get('content').html).toBeUndefined();

				});

			});

			it('should have a "name"', function(){

				expect(page.get('name')).toEqual(jasmine.any(String));

			});

			describe('navText', function(){

				it('can be explictly set in constructor', function(){

					page = new Page({
						navText: 'About Us'
					});

					expect(page.get('navText')).toBe('About Us');

				});

				it('default value should be derived from "name" and add spaces and camelcase', function(){

					page = new Page();

					expect(page.get('navText')).toBe('Page Name');

				});

			});

			describe('title', function(){

				it('can be explictly set in constructor', function(){

					page = new Page({
						title: 'About Us Title'
					});
					
					expect(page.get('title')).toBe('About Us Title');

				});

				it('default value should be derived from "navText"', function(){

					expect(page.get('title')).toBe('Page Name');

					page = new Page({
						navText: 'Hotdog'
					});

					expect(page.get('title')).toBe('Hotdog');

				});

			});

			describe('layout', function(){

				it('should default to "default"', function(){

					expect(page.get('layout')).toBe('default');

				});

				it('should default to "default_overlay" if page is an overlay page', function(){

					expect(page.get('layout')).toBe('default');

					page = new Page({
						linkUrl: '?overlay=hotdog'
					});

					expect(page.get('layout')).toBe('default_overlay');

					page = new Page({
						layout: 'not_default',
						linkUrl: '?overlay=hotdog'
					});

					expect(page.get('layout')).toBe('not_default');

				});

			});

			describe('type', function(){

				it('should default to "text"', function(){

					expect(page.get('type')).toBe('text');

				});

			});

			describe('linkUrl', function(){

				it('should default to undefined', function(){

					expect(page.get('linkUrl')).toBeUndefined();

				});

			});

			describe('gallery_id', function(){

				it('should default to defined', function(){

					expect(page.get('gallery_id')).toBeDefined();

				});

			});

		});

	});
	
});