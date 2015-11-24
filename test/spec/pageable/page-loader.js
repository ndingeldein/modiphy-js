define(['backbone', 'jquery', 'modiphy', 'pageable/page-loader', 'pageable/page'], function(Backbone, $, M, PageLoader, Page){
	'use strict';

	var loader;
	var page;
	Backbone.history.start({ pushState: true });

	console.log(M);

	describe('PageLoader', function(){

		beforeEach(function(){

			loader = new PageLoader();

		});

		describe('options', function(){

			describe('"jsonPath"', function(){

				it('should default to "json/json.php"', function(){

					expect(loader.jsonPath).toBe('json/json.php');

				});

			});

			describe('"htmlPath"', function(){

				it('should default to "layout/page/page.php"', function(){

					expect(loader.htmlPath).toBe('layout/page/page.php');

				});

			});

		});

		describe('load method', function(){

			beforeEach(function(){

				loader.jsonPath = 'fixtures/json/json.php';
				loader.htmlPath = 'fixtures/page/page.php';

				page = new Page();

			});

			it('should return a deferred object', function(){

				expect(loader.load(page).done).toBeDefined();

			});

			it('should suspend loading of previous page', function(done){

				var doned = false;
				var falsed = false;

				loader.load(page)
					.done(function(){
						doned = true;
					})
					.fail(function(){
						falsed = true;
					});

				var newPage = new Page();				
				var newDeferred = loader.load(newPage);

				newDeferred.done(function(){

					expect(doned).toBe(false);
					expect(falsed).toBe(true);
					
					done();
				});
				
			});

			describe('if page is not loaded', function(){

				beforeEach(function(){

					page = new Page();

				});

				it('should load the page related json', function(done){

					loader.load(page).done(function(){

						expect(page.get('content').json.success).toBe(true);

						done();

					});
				});

				it('should use jsonPath and pass page properties and pass the current url', function(){

					spyOn($, 'get').and.callThrough();

					var params;
					if(Backbone.history.fragment){
						params = M.deparam.querystring(Backbone.history.fragment);
					}else{
						params = {};
					}

					params.page = page.get('name');
					params.layout = page.get('layout');
					params.title = page.get('title');
					params.type = page.get('type');			
					params.page_id = page.get('id');
					params.page_gallery_id = page.get('gallery_id');
					params.url = document.URL;

					loader.load(page);

					expect($.get.calls.argsFor(1)).toEqual([loader.jsonPath, params, 'json']);

				});

				it('should load the page related html', function(done){

					loader.load(page).done(function(){

						console.log(page.get('content').html);

						expect(page.get('content').html.indexOf(page.get('title'))).not.toEqual(-1);

						done();

					});
				});

				it('should use htmlPath and pass page properties and pass current url', function(){

					spyOn($, 'get').and.callThrough();

					var params;
					if(Backbone.history.fragment){
						params = M.deparam.querystring(Backbone.history.fragment);
					}else{
						params = {};
					}

					params.page = page.get('name');
					params.layout = page.get('layout');
					params.title = page.get('title');
					params.type = page.get('type');			
					params.page_id = page.get('id');
					params.page_gallery_id = page.get('gallery_id');
					params.url = document.URL;

					loader.load(page);

					expect($.get.calls.argsFor(0)).toEqual([loader.htmlPath, params]);

				});

				it('should maintain the current url params', function(done){

					Backbone.history.navigate('modiphy-js/test/page_runner.html?foo=bar');

					spyOn($, 'get').and.callThrough();

					loader.load(page).done(function(){

						expect(M.deparam.querystring(Backbone.history.fragment).foo).toBe('bar');

						done();

					});
					

				});

				it('should trigger model "change:content" event', function(done){

					var obj = {
						testCallback: function(){}
					};
					spyOn(obj, 'testCallback');
					page.on('change:content', obj.testCallback);

					loader.load(page).done(function(){

						expect(obj.testCallback).toHaveBeenCalled();

						done();

					});

				});

				it('should trigger model "page:loaded" event and pass page model', function(done){

					var obj = {
						testCallback: function(){}
					};
					spyOn(obj, 'testCallback').and.callThrough();
					page.on('page:loaded', obj.testCallback);

					loader.load(page).done(function(){

						expect(obj.testCallback).toHaveBeenCalled();
						expect(obj.testCallback).toHaveBeenCalledWith(page);

						done();

					});

				});

			});

			describe('if page is already loaded', function(){

				beforeEach(function(done){

					page = new Page();

					loader.load(page).done(function(){

						done();

					});

				});

				it('should return page content', function(done){

					var originalContent = page.get('content');
					
					loader.load(page).done(function(){
						expect(originalContent).toEqual(page.get('content'));

						done();
					});				

				});

				it('should not reload content', function(done){

					spyOn($, 'get').and.callThrough();

					loader.load(page).done(function(){
						expect($.get).not.toHaveBeenCalled();

						done();
					});	

				});

				it('should trigger model "page:loaded" event and pass page model', function(done){

					var obj = {
						testCallback: function(){}
					};
					spyOn(obj, 'testCallback').and.callThrough();
					page.on('page:loaded', obj.testCallback);

					loader.load(page).done(function(){

						expect(obj.testCallback).toHaveBeenCalled();
						expect(obj.testCallback).toHaveBeenCalledWith(page);

						done();

					});

				});

			});

		});

	});
	
});