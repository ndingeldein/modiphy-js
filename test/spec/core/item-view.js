define(['core/view', 'core/item-view', 'lodash', 'backbone', 'templates', 'jasmine-jquery'], function(View, ItemView, _, Backbone, Templates){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../test/fixtures';

	describe('Modiphy ItemView', function(){

		it('should extend M.View type', function(){

			expect(ItemView instanceof View).toBe(false);
			expect(ItemView.prototype instanceof View).toBe(true);

			expect(View.prototype.isPrototypeOf( ItemView )).toBe(false);
			expect(View.prototype.isPrototypeOf( ItemView.prototype )).toBe(true);

		});

		describe('render method', function(){

			var view;

			beforeEach(function(){
				loadFixtures('item_view.html');

				view = new ItemView({
					tagName: 'div',
					className: 'item-view'
				});

			});

			it('should return the view instance', function(){

				expect(view.render()).toBe(view);

			});

			it('should trigger the "before:render" event', function(){

				spyOn(view, 'trigger');

				view.render();

				expect(view.trigger.calls.argsFor(0)).toEqual(['before:render']);

			});

			it('should trigger the "render" event', function(){

				spyOn(view, 'trigger');

				view.render();

				expect(view.trigger.calls.argsFor(1)).toEqual(['render']);

			});

			it('should call the "onBeforeRender" method if it exists', function(){

				expect(view.onBeforeRender).toBeUndefined();

				_.extend(view, {

					onBeforeRender: function(){}

				});

				spyOn(view, 'onBeforeRender');

				view.render();

				expect(view.onBeforeRender).toHaveBeenCalled();


			});

			it('should call the "onRender" method if it exists', function(){

				expect(view.onRender).toBeUndefined();

				_.extend(view, {

					onRender: function(){}

				});

				spyOn(view, 'onRender');

				view.render();

				expect(view.onRender).toHaveBeenCalled();


			});			

			describe('if template is defined', function(){

				beforeEach(function(){
					_.extend(view, {
						template: Templates['item-view']
					});
				});				

				describe('if model is defined', function(){

					beforeEach(function(){
						view.model = new Backbone.Model({
							field01: 'foo',
							field02: 'bar'
						});
					});	

					it('should apply template with model as context', function(){
						
						expect(view.template).toBeDefined();
						expect(view.model).toBeDefined();

						expect(view.$el.children().length).toBe(0);

						view.render();

						expect(view.$el.children().length).toBeGreaterThan(0);

						expect(view.el.innerHTML.indexOf(view.model.get('field01'))).not.toEqual(-1);

					});

				});

				describe('if model is undefined', function(){

					it('should not apply template', function(){

						expect(view.template).toBeDefined();
						expect(view.model).toBeUndefined();

						expect(view.render).not.toThrow();

					});

				});

			});

		});

	});

});