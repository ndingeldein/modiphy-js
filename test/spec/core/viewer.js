define(['core/view', 'core/container-view', 'core/viewer', 'lodash', 'jquery', 'backbone', 'jasmine-jquery'], function(View, ContainerView, Viewer, _, $,  Backbone){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../test/fixtures';

	describe('modiphy Viewer', function(){

		var viewer;
		var view;
		var view2;
		var view3;
		var $views;
		var $view1;
		var $view2;
		var $view3;
		var MockViewer = Viewer.extend({
			
		});

		var showView = {
			onShow: function(){},

			showTransition: function(){

				var that = this;

				setTimeout(function(){
					that.triggerShown();
				}, 500);

			},

			onShown: function(){},
		};

		var hideView = {
										
			onHide: function(){},

			hideTransition: function(){

				var that = this;

				setTimeout(function(){
					that.triggerHidden();
				}, 500);

			},

			onHidden: function(){}

		};

		beforeEach(function(){

			loadFixtures('viewer.html');
			$views = $('.view');
			$view1 = $views.eq(0);
			$view2 = $views.eq(1);
			$view3 = $views.eq(2);


			viewer = new MockViewer({
				el: '.viewer'
			});


			

		});

		afterEach(function(){

			viewer = undefined;

		});

		describe('Viewer Instance', function(){
			
			it('should extend ContainerView.prototype', function(){

				spyOn(MockViewer.prototype, 'initialize');

					viewer = new MockViewer({
					el: '.viewer'
				});

				expect(Viewer instanceof ContainerView).toBe(false);
				expect(Viewer.prototype instanceof ContainerView).toBe(true);

				expect(ContainerView.prototype.isPrototypeOf( Viewer )).toBe(false);
				expect(ContainerView.prototype.isPrototypeOf( Viewer.prototype )).toBe(true);

			});

		});

		describe('getCurrentView method', function(){

			it('should return model\'s view property', function(){

				expect(viewer.getCurrentView()).toBe(undefined);

				view = new Backbone.View({
					el: $view1
				});

				viewer.model.set('view', view);

				expect(viewer.getCurrentView()).toBe(view);

			});

		});

		describe('Viewer model', function(){

			it('should default as empty Backbone.Model', function(){

				expect(viewer.model instanceof Backbone.Model).toBe(true);
				expect(viewer.model).toBeDefined();

			});

			describe('if model is defined on creation', function(){

				var model;

				beforeEach(function(){
					model = new Backbone.Model({
						foo: 'bar',
						view: 'howdy'
					});
					viewer = new Viewer({
						model: model
					});
				});

				it('should set "view" property to "undefined"', function(){
					
					expect(viewer.model.get('view')).toBe(undefined);

				});

				it('should be the same model', function(){
					
					expect(viewer.model).toBe(model);
					expect(model.get('foo')).toEqual('bar');

				});


			});

			describe('when model\'s "view" property is changed', function(){

				describe('when "view" property is defined', function(){

					describe('when view is not an instance of View', function(){

						it('should not break anything or do anything', function(){

							view = new Backbone.View({
								el: $view1
							});

							spyOn(viewer, '_setView');

							viewer.model.set('view', view);

							expect(viewer._setView).not.toHaveBeenCalled();

						});

					});

					describe('when view is an instance of View', function(){

						describe('when there is no previous view', function(){

							it('should render, append to viewer, and show the current view', function(){

								view = new View({
									el: $view1
								});	

								spyOn(view, 'show');
								spyOn(view, 'render');

								viewer.model.set('view', view);

								expect(view.show).toHaveBeenCalled();
								expect(view.render).toHaveBeenCalled();
								expect(viewer.$el.find('.view').length).toBe(1);



							});

						});

						describe('when there is a previous view', function(){

							beforeEach(function(){


								view = new View({
									el: $view1
								});

								view2 = new View({
									el: $view2
								});

								view3 = new View({
									el: $view3
								});

							});

							it('should hide and destroy the previous views', function(){

								viewer.model.set('view', view);
								expect(viewer.container.length).toBe(1);

								spyOn(view, 'hide').and.callThrough();
								spyOn(view2, 'hide').and.callThrough();

								viewer.model.set('view', view2);

								expect(view.hide.calls.count()).toBe(1);
								expect(viewer.container.length).toBe(1);

								viewer.model.set('view', view3);			

								expect(view.hide.calls.count()).toBe(1);
								expect(view2.hide.calls.count()).toBe(1);

								expect(viewer.container.length).toBe(1);

								expect(viewer.$el.find('.view').length).toBe(1);

							});

							it('should show and render the current view after hiding previous views', function(){

								viewer.model.set('view', view);

								spyOn(view2, 'show').and.callThrough();
								spyOn(view2, 'render');

								viewer.model.set('view', view2);

								expect(view2.show).toHaveBeenCalled();
								expect(view2.render).toHaveBeenCalled();

								expect(viewer.$el.find('.view').length).toBe(1);



							});

							describe('when previous view is "hiding"', function(){

								beforeEach(function(){

									jasmine.clock().install();

									_.extend(view, hideView);
									//_.extend(view2, hideView);

								});


								it('should continue hiding initial previous view and then only show current view', function(){

									spyOn(view, 'onHidden');
									spyOn(view2, 'hide').and.callThrough();
									spyOn(view2, 'show');
									spyOn(view3, 'show').and.callThrough();
									


									viewer.model.set('view', view);

									viewer.model.set('view', view2);

									jasmine.clock().tick(250);

									viewer.model.set('view', view3);

									expect(view2.hide).not.toHaveBeenCalled();
									expect(viewer.$el.find('.view').length).toBe(1);

									jasmine.clock().tick(250);

									expect(view.onHidden).toHaveBeenCalled();
									expect(view2.show).not.toHaveBeenCalled();
									expect(view3.show).toHaveBeenCalled();
									
									expect(viewer.$el.find('.view').length).toBe(1);


								});

							
							});


						});



					});

				});				

			});

		});

		describe('clearView method', function(){

			it('should remove all views', function(){

				view = new View({
					el: $view1
				});

				_.extend(view, hideView);

				view2 = new View({
					el: $view2
				});

				_.extend(view2, hideView, showView);

				jasmine.clock().install();
				
				viewer.model.set('view', view);

				viewer.model.set('view', view2);

				jasmine.clock().tick(250);

				viewer.clearViews();

				expect(viewer._currentView).toBeUndefined();

				expect(viewer.container.length).toBeGreaterThan(0);

				jasmine.clock().tick(250);

				expect(viewer._previousView).toBeUndefined();
				expect(viewer.container.length).toBe(0);
							
				

			});

			it('should trigger viewer:cleared', function(){

				view = new View({
					el: $view1
				});

				var obj = {
					onCleared: function(){}
				}

				viewer.model.set('view', view);

				spyOn(obj, 'onCleared');

				viewer.on('viewer:cleared', obj.onCleared);

				viewer.clearViews();

				expect(obj.onCleared).toHaveBeenCalled();

			});

		});	


	});

});