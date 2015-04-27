define(['lodash', 'backbone', 'backbone.babysitter', 'core/view', 'core/container-view', 'templates', 'jasmine-jquery'], function(_, Backbone, ChildViewContainer, View, ContainerView, Templates){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../test/fixtures';

	describe('modiphy ContainerView', function(){

		var view;


		it('should extend modiphy View.prototype', function(){

			expect(ContainerView instanceof View).toBe(false);
			expect(ContainerView.prototype instanceof View).toBe(true);

			expect(View.prototype.isPrototypeOf( ContainerView )).toBe(false);
			expect(View.prototype.isPrototypeOf( ContainerView.prototype )).toBe(true);

		});	
		
		describe('container property', function(){

			beforeEach(function(){

				view = new ContainerView();

			});

			it('should be defined', function(){

				expect(view.container).toBeDefined();

			});

			it('should be an instance of Backbone.ChildViewContainer', function(){

				expect(view.container instanceof ChildViewContainer).toBe(true);

				var myView = new View();

				view.container.add(myView);

				expect(view.container.length).toBe(1);


			});

		});

		describe('render method', function(){

			beforeEach(function(){

				loadFixtures('container_view.html');

				view = new ContainerView({
					el: '.container'
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

				expect(view.trigger.calls.argsFor(3)).toEqual(['render']);

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

			it('should render children', function(){

				var childView = new View();
				var childView2 = new View();

				spyOn(childView, 'render');
				spyOn(childView2, 'render');

				view.container.add(childView);
				view.container.add(childView2);

				view.render();

				expect(childView.render).toHaveBeenCalled();
				expect(childView2.render).toHaveBeenCalled();

			});

			describe('if child view options.el is defined', function(){

				
				it('should not append children to view but should select item from container view el', function(){

					
					view = new ContainerView({
						el: '.container'
					});

					var childView = new View({
						el: '.item-view-1'
					});

					spyOn(view.$el, 'append');

					expect(view.el.getElementsByClassName('item-view-1').length).toBe(1);

					view.container.add(childView);

					view.render();

					expect(view.$el.append).not.toHaveBeenCalled();

					expect(view.el.getElementsByClassName('item-view-1').length).toBe(1);


				});

			});

			describe('if child view options.el is undefined', function(){

				it('should append children to view', function(){

					spyOn(view.$el, 'append');			

					var childView = new View({
						className: 'my-view'
					});

					view.$el.append(childView.$el);

					expect(view.$el.append).toHaveBeenCalledWith(childView.el);

				});

			});

			it('should trigger "before:render:children" event', function(){

				spyOn(view, 'trigger');

				view.render();

				expect(view.trigger.calls.argsFor(1)).toEqual(['before:render:children']);

			});

			it('should trigger "render:children" event', function(){

				spyOn(view, 'trigger');

				view.render();

				expect(view.trigger.calls.argsFor(2)).toEqual(['render:children']);

			});

			it('should call "onBeforeRenderChildren" method if it exists', function(){

				_.extend(view, {
					onBeforeRenderChildren: function(){}
				});

				spyOn(view, 'onBeforeRenderChildren');

				view.render();

				expect(view.onBeforeRenderChildren).toHaveBeenCalled();

			});

			it('should call "onRenderChildren" method if it exists', function(){

				_.extend(view, {
					onRenderChildren: function(){}
				});

				spyOn(view, 'onRenderChildren');

				view.render();

				expect(view.onRenderChildren).toHaveBeenCalled();

			});

			describe('if template is defined', function(){

				beforeEach(function(){
					view = new ContainerView();
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

		describe('remove method', function(){

			beforeEach(function(){

				view = new ContainerView();

			});

			it('should call View.prototype remove method', function(){

				spyOn(View.prototype, 'remove');

				view.remove();

				expect(View.prototype.remove).toHaveBeenCalled();

			});

			it('should call View.prototype.remove on all children', function(){

				var childView1 = new View({
					className: 'my-view-1'
				});
				var childView2 = new View({
					className: 'my-view-2'
				});

				view.container.add(childView1);
				view.container.add(childView2);

				view.render();

				spyOn(View.prototype, 'remove');

				view.remove();

				expect(View.prototype.remove.calls.count()).toBe(3);


			});

		});

		describe('destroy method', function(){

			beforeEach(function(){

				view = new ContainerView();

			});

			it('should call View.prototype destroy method', function(){

				spyOn(View.prototype, 'destroy');

				view.destroy();

				expect(View.prototype.destroy).toHaveBeenCalled();

			});

			it('should call View.prototype.destroy on all children', function(){

				var childView1 = new View({
					className: 'my-view-1'
				});
				var childView2 = new View({
					className: 'my-view-2'
				});

				view.container.add(childView1);
				view.container.add(childView2);

				view.render();

				spyOn(View.prototype, 'destroy');

				view.destroy();

				expect(View.prototype.destroy.calls.count()).toBe(3);


			});

			it('should trigger the "before:destroy:container" event', function(){

				spyOn(view, 'trigger');

				view.destroy();

				expect(view.trigger.calls.argsFor(0)).toEqual(['before:destroy:container']);

			});

			it('should trigger the "destroy:container" event', function(){

				spyOn(view, 'trigger');

				view.destroy();

				expect(view.trigger.calls.argsFor(1)).toEqual(['destroy:container']);

			});

			it('should call "onBeforeDestroyContainer" method if it exists', function(){

				_.extend(view, {
					onBeforeDestroyContainer: function(){}
				});

				spyOn(view, 'onBeforeDestroyContainer');

				view.destroy();

				expect(view.onBeforeDestroyContainer).toHaveBeenCalled();

			});

			it('should call "onDestroyContainer" method if it exists', function(){

				_.extend(view, {
					onDestroyContainer: function(){}
				});

				spyOn(view, 'onDestroyContainer');

				view.destroy();

				expect(view.onDestroyContainer).toHaveBeenCalled();

			});

			it('should remove all views from ChildViewContainer instance', function(){

				var childView1 = new View({
					className: 'my-view-1'
				});
				var childView2 = new View({
					className: 'my-view-2'
				});

				view.container.add(childView1);
				view.container.add(childView2);

				view.render();

				spyOn(view.container, 'remove').and.callThrough();

				expect(view.container.length).toBe(2);

				view.destroy();

				expect(view.container.length).toBe(0);

			});

		});

	});

});