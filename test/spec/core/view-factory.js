define(['lodash', 'backbone', 'core/view', 'core/item-view', 'core/view-factory', 'jasmine-jquery'], function(_, Backbone, View, ItemView, ViewFactory){
	'use strict';

	describe('modiphy ViewFactory', function(){

		var factory;		

		describe('options', function(){

			beforeEach(function(){
				factory = new ViewFactory();
			});
				
			describe('viewOptions property', function(){
				
				it('should have a default value of an empty object', function(){

					expect(factory.viewOptions).toBeDefined();
					expect(factory.viewOptions).toEqual({});

				});

				it('should be able to be overwritten in constructor', function(){

					factory = new ViewFactory({
						viewOptions: {
							tagName: 'foo',
							className: 'bar'
						}
					});

					expect(factory.viewOptions.tagName).toBe('foo');
					expect(factory.viewOptions.className).toBe('bar');

				});

			});

			describe('viewType', function(){
				it('should have default value of ItemView', function(){

					expect(factory.viewType).toBe(ItemView);

				});

				it('should be able to be overwritten in constructor', function(){

					var factory = new ViewFactory({
						viewType: Backbone.View
					});
					expect(factory.viewType).toBe(Backbone.View);

				});
			});

			describe('viewPrototype', function(){

				it('should have default value of View', function(){

					expect(factory.viewPrototype).toBe(View);

				});

				it('should be able to be overwritten in constructor', function(){

					var factory = new ViewFactory({
						viewPrototype: Backbone.View
					});
					expect(factory.viewPrototype).toBe(Backbone.View);

				});

			});

			describe('modelViewOptionsProperty', function(){

				it('should have default value of "viewOptions"', function(){

					expect(factory.modelViewOptionsProperty).toBe('viewOptions');

				});

				it('should be able to be overwritten in constructor', function(){

					var factory = new ViewFactory({
						modelViewOptionsProperty: 'foo'
					});
					expect(factory.modelViewOptionsProperty).toBe('foo');

				});

			});

			describe('modelViewTypeProperty', function(){

				it('should have default value of "viewType"', function(){

					expect(factory.modelViewTypeProperty).toBe('viewType');

				});

				it('should be able to be overwritten in constructor', function(){

					var factory = new ViewFactory({
						modelViewTypeProperty: 'foo'
					});
					expect(factory.modelViewTypeProperty).toBe('foo');

				});

			});

		});

		describe('getView method', function(){

			beforeEach(function(){
				factory = new ViewFactory();
			});

			describe('if model is defined', function(){
				it('should return an instance of the viewPrototype', function(){

					var model = new Backbone.Model();

					expect(factory.getView(model) instanceof factory.viewPrototype).toBe(true);

				});
			});

			describe('if model is undefined', function(){
				it('should throw and error', function(){
					
					expect(function(){factory.getView();}).toThrow();	

				});
			});

			describe('if modelViewTypeProperty is NOT found on model', function(){

				it('should return an instance of viewType', function(){
					var model = new Backbone.Model();

					expect(factory.getView(model) instanceof factory.viewType).toBe(true);
				});				

			});

			describe('if modelViewTypeProperty is found on model', function(){

				describe('and it is and instance of viewPrototype', function(){

					it('should return that type if it is an instance of viewPrototype', function(){

						var Type = ItemView.extend();

						var model = new Backbone.Model({
							viewType: Type
						});

						expect(factory.getView(model) instanceof factory.viewPrototype).toBe(true);

						expect(factory.getView(model) instanceof Type).toBe(true);

					});

				});

				describe('and it is NOT an instance of viewPrototype', function(){

					it('should return the instance of viewType', function(){

						var Type = Backbone.View.extend();

						var model = new Backbone.Model({
							viewType: Type
						});

						expect(factory.getView(model) instanceof factory.viewPrototype).toBe(true);

						expect(factory.getView(model) instanceof Type).toBe(false);

					});

				});
				

			});

			describe('if modelViewOptionsProperty is not found on model', function(){

				beforeEach(function(){
					factory = new ViewFactory();
				});

				it('should apply the factory "viewOptions" to view', function(){

					factory.viewOptions = {
						tagName: 'span',
						foo: 'bar'
					};

					var model = new Backbone.Model();

					var view = factory.getView(model);
					
					expect(view.options.foo).toBe('bar');
					expect(view.el.tagName).toBe('SPAN');

				});

			});

			describe('if modelViewOptionsProperty is found on model', function(){

				beforeEach(function(){
					factory = new ViewFactory();
				});

				it('should apply models view options to view', function(){

					var model = new Backbone.Model({
						myViewOptions: {
							tagName: 'li',
							foo: 'bar'
						}
					});

					factory.modelViewOptionsProperty = 'myViewOptions';

					var view = factory.getView(model);

					expect(view.options.foo).toBe('bar');
					expect(view.el.tagName).toBe('LI');

				});

			});

			it('needs to add model param to view', function(){

				var model = new Backbone.Model({

					foo: 'bar'

				});

				var view = factory.getView(model);
				expect(view.model).toBe(model);

			});

		});

	});

});