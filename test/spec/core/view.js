define(['core/view', 'lodash', 'jquery', 'backbone', 'jasmine-jquery'], function(View, _, $,  Backbone){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../test/fixtures';

	describe('modiphy View', function(){

		var view;
		var MockView = View.extend({
			initialize: function(){
				
			}
		});

		beforeEach(function(){

			loadFixtures('view.html');

			spyOn(MockView.prototype, 'initialize');

			beforeEach(function(){

				view = new MockView({
					el: '.test-view'
				});

			});

		});

		afterEach(function(){

			view = undefined;

		});

		describe('View Instance', function(){
			
			it('should extend Backbone.View.prototype', function(){

				expect(View instanceof Backbone.View).toBe(false);
				expect(View.prototype instanceof Backbone.View).toBe(true);

				expect(Backbone.View.prototype.isPrototypeOf( View )).toBe(false);
				expect(Backbone.View.prototype.isPrototypeOf( View.prototype )).toBe(true);

			});

		});

		describe('View options', function(){

			beforeEach(function(){

				view = new MockView(function(){
				var bar = 'bar';
					return {
						model: new Backbone.Model({
							name: 'Test Model'
						}),
						foo: bar,
						el: '.test-view'
					};
				});

			});


			it('should accept custom properties', function(){
				
				expect(view.options.foo).toEqual('bar');

			});

			it('should accept a function', function(){

				expect(view.options.foo).toEqual('bar');

			});

			it('should be accesible from initialize function', function(){

				expect(view.initialize).toHaveBeenCalled();
				expect(view.initialize).toHaveBeenCalledWith(view.options);

			});

		});

		describe('render method', function(){

			it('should be always bound (_.bindAll) to instance', function(){

				_.extend(MockView.prototype, {
					render: function(){
						expect(this).toEqual(view);
					}
				});

				view = new MockView();

				spyOn(view, 'render').and.callThrough();

				_.each([{}], view.render);

				expect(view.render).toHaveBeenCalled();
				
			});

		});

		describe('destroy method', function(){

			beforeEach(function(){

				view = new MockView(function(){
					var bar = 'bar';
					return {
						model: new Backbone.Model({
							name: 'Test Model'
						}),
						foo: bar,
						el: '.test-view'
					};
				});

			});

			it('should trigger the before:destroy event and pass the view instance as first parameter', function(){

				spyOn(view, 'trigger').and.callThrough();

				view.destroy();

				expect(view.trigger.calls.argsFor(0)).toEqual(['before:destroy', view]);

			});


			it('should trigger the destroy event and pass the view instance as first parameter', function(){

				spyOn(view, 'trigger').and.callThrough();

				view.destroy();

				expect(view.trigger.calls.argsFor(1)).toEqual(['destroy', view]);

			});

			it('should call onDestroy method if one is found', function(){

				var OnDestroyView = View.extend({

					onBeforeDestroy: function(){}

				});

				view = new OnDestroyView();

				spyOn(view, 'onBeforeDestroy');

				view.destroy();

				expect(view.onBeforeDestroy.calls.count()).toEqual(1);

			});

			it('should empty the View $el', function(){

				spyOn(view, 'remove');

				view.destroy();

				expect(view.$el.is(':empty')).toBe(true);
				expect(view.remove).toHaveBeenCalled();

			});

			it('should call Backbone.View remove method', function(){

				spyOn(view, 'remove').and.callThrough();
				
				expect($('.container .test-view').length).toEqual(1);

				view.destroy();

				expect($('.container .test-view').length).toEqual(0);

			});

			it('should stopListening to triggered events', function(){

				var obj = {
					onBeforeDestroy: function(){},
					onModelChange: function(){}
				};

				spyOn(view, 'stopListening').and.callThrough();
				spyOn(obj, 'onBeforeDestroy');
				spyOn(obj, 'onModelChange');				

				view.listenTo(view, 'before:destroy', obj.onBeforeDestroy);
				view.listenTo(view.model, 'change', obj.onModelChange);

				view.model.set('name', 'New Model');

				expect(obj.onModelChange.calls.count()).toEqual(1);

				view.destroy();

				view.model.set('name', 'Brand New Model');

				expect(obj.onModelChange.calls.count()).toEqual(1);

				expect(obj.onBeforeDestroy).toHaveBeenCalled();
				expect(obj.onBeforeDestroy.calls.count()).toEqual(1);

				view.destroy();

				expect(obj.onBeforeDestroy.calls.count()).toEqual(1);

			});

			it('should return the view instance', function(){

				expect(view.destroy()).toEqual(view);

				// Make sure it gets returned even if it has already been called
				expect(view.destroy()).toEqual(view);

			});

			it('should only be called once', function(){

				spyOn(view, 'stopListening');

				view.destroy();

				expect(view.stopListening.calls.count()).toEqual(1);

				view.destroy();

				expect(view.stopListening.calls.count()).toEqual(1);

			});

			it('should call the "killTransitions" method', function(){

				spyOn(view, 'killTransitions');

				view.destroy();

				expect(view.killTransitions.calls.count()).toBe(1);

			});

		});

		describe('isShowing method', function(){

			it('should return boolean state of view show', function(){

				expect(view.isShowing()).toBe(false);
				view.show();
				expect(view.isShowing()).toBe(true);

			});

		});

		describe('show method', function(){

			it('should return the view instance', function(){

				expect(view.show()).toEqual(view);

			});

			it('should trigger the show event', function(){

				spyOn(view, 'trigger');

				view.show();

				expect(view.trigger.calls.argsFor(0)[0]).toEqual('show');

			});

			it('should only trigger "show" event if view !isShowing()', function(){

				var obj = {
					onShow: function(){

					}
				};

				spyOn(obj, 'onShow');

				view.listenTo(view, 'show', obj.onShow);

				view.show();

				expect(obj.onShow.calls.count()).toBe(1);

				view.show();

				expect(obj.onShow.calls.count()).toBe(1);

			});

			it('should return a Deferred promise no matter the state of isShowing()', function(){

				var ret = view.show();

				expect(ret.then).toBeDefined();
				expect(ret.done).toBeDefined();
				expect(ret.fail).toBeDefined();
				expect(ret.always).toBeDefined();
				expect(ret.pipe).toBeDefined();
				expect(ret.progress).toBeDefined();
				expect(ret.state).toBeDefined();

				ret = view.show();

				expect(ret.then).toBeDefined();
				expect(ret.done).toBeDefined();
				expect(ret.fail).toBeDefined();
				expect(ret.always).toBeDefined();
				expect(ret.pipe).toBeDefined();
				expect(ret.progress).toBeDefined();
				expect(ret.state).toBeDefined();

				expect(ret.resolve).not.toBeDefined();

			});			

			it('should trigger "shown" event when Deferred is resolved but not if it is already shown', function(){

				spyOn(view, 'trigger');

				view.show();

				expect(view.trigger.calls.mostRecent().args[0]).toEqual('shown');

				view.trigger.calls.reset();

				view.show();

				expect(view.trigger).not.toHaveBeenCalled();


			});

			it('should fire the promise "done" function even if it has been shown', function(){

				var obj = {
					done: function(){}
				};

				view.show();

				spyOn(obj, 'done');

				expect(view.isShowing()).toBe(true);
				expect(view.state()).toBe('resolved');

				view.show().done(obj.done);

				expect(obj.done).toHaveBeenCalled();

			});

			describe('if isShowing()', function(){

				beforeEach(function(){

					jasmine.clock().install();

				});

				afterEach(function(){
					jasmine.clock().uninstall();
				});

				it('should not call showTransition', function(){

					var shownCounter = 0;

					_.extend(view, {

						onShow: function(){
							
						},

						showTransition: function(){

							setTimeout(function(){

								view.triggerShown();

							}, 500 );							
							
						},

						onShown: function(){

							shownCounter++;
						}

					});

					spyOn(view, 'showTransition').and.callThrough();
					spyOn(view, 'onShow').and.callThrough();
					spyOn(view, 'onShown').and.callThrough();

					view.show();
					
					setTimeout(view.show, 200);

					jasmine.clock().tick(100);

					expect(view.showTransition.calls.count()).toBe(1);
					
					jasmine.clock().tick(200);

					expect(view.showTransition.calls.count()).toBe(1);

					jasmine.clock().tick(200);

					expect(view.showTransition.calls.count()).toBe(1);
					expect(view.onShown.calls.count()).toBe(1);
					

				});

			});

		});		

		describe('onShow method', function(){

			it('if it exists should be called when show event is triggered', function(){

				_.extend(view, {

					onShow: function(){}

				});

				spyOn(view, 'onShow');

				expect(view.onShow.calls.count()).toBe(0);

				view.show();

				expect(view.onShow.calls.count()).toBe(1);

			});

		});		

		describe('showTransition method', function(){

			describe('if showTransition does not exist', function(){

				it('onShown method should be triggered immediately', function(){

					_.extend(view, {

						onShown: function(){}

					});

					spyOn(view, 'onShown');

					expect(view.onShown.calls.count()).toBe(0);

					view.show();

					expect(view.onShown.calls.count()).toBe(1);

				});				

			});

			describe('if showTransition method exists', function(){

				beforeEach(function(){

					view = new MockView({
						el: '.text-view'
					});

					_.extend(view, {

						showTransition: function(){

						}

					});

					jasmine.clock().install();

				});

				afterEach(function(){
					jasmine.clock().uninstall();
				});

				it('showTransition method should be called', function(){

					spyOn(view, 'showTransition');

					view.show();

					expect(view.showTransition.calls.count()).toEqual(1);

				});

				describe('onShown method', function(){

					beforeEach(function(){

						_.extend(view, {
							onShown: function(){
								
							}
						});

						jasmine.clock().install();

					});

					afterEach(function(){
						jasmine.clock().uninstall();
					});

					describe('when Deferred is resolved', function(){

						it('should trigger onShown method', function(){

							_.extend(view, {

								showTransition: function(){

									var that = this;

									setTimeout(function(){

										that.triggerShown();
										
									}, 500);								

								}

							});

							spyOn(view, 'onShown');

							view.show();

							expect(view.onShown).not.toHaveBeenCalled();

							jasmine.clock().tick(250);

							expect(view.onShown).not.toHaveBeenCalled();

							jasmine.clock().tick(250);

							expect(view.onShown).toHaveBeenCalled();
							
						});

					});
				});

			
			});

		});	

		describe('triggerShown method', function(){

			it('should not trigger "shown" event if !isShowing()', function(){

				expect(view.isShowing()).toBe(false);

				spyOn(view, 'trigger');

				view.triggerShown();

				expect(view.trigger.calls.count()).toBe(0);

			});

			it('should not trigger "shown" event if showTransition is finished', function(){

				expect(view.isShowing()).toBe(false);

				view.show();

				spyOn(view, 'trigger');

				view.triggerShown();

				expect(view.trigger.calls.count()).toBe(0);

			});

			it('should trigger "shown" event if Deferred is pending and isShowing()', function(){

				_.extend(view, {
					showTransition: function(){
						
						this.triggerShown();

					},
					onShown: function(){
						
					}
				});

				spyOn(view, 'trigger');

				view.show();

				expect(view.trigger.calls.mostRecent().args[0]).toBe('shown');

			});

		});

		describe('triggerHidden method', function(){

			it('should not trigger "hidden" event if isShowing()', function(){

				view.show();

				expect(view.isShowing()).toBe(true);

				spyOn(view, 'trigger');

				view.triggerHidden();

				expect(view.trigger.calls.count()).toBe(0);

			});

			it('should not trigger "hidden" event if hideTransition is finished', function(){

				expect(view.isShowing()).toBe(false);

				spyOn(view, 'trigger');

				view.triggerHidden();

				expect(view.trigger.calls.count()).toBe(0);

			});

			it('should trigger "hidden" event if Deferred is pending and !isShowing()', function(){

				_.extend(view, {
					hideTransition: function(){
						
						this.triggerHidden();

					},
					onHidden: function(){
						
					}
				});

				view.show();

				spyOn(view, 'trigger');

				view.hide();

				expect(view.trigger.calls.mostRecent().args[0]).toBe('hidden');

			});

		});

		describe('killTransitions method', function(){

			beforeEach(function(){

				view = new MockView({
					el: '.text-view'
				});

				jasmine.clock().install();

			});

			afterEach(function(){
				jasmine.clock().uninstall();
			});

			it('should kill all transitions', function(){

				_.extend(view, {

					showTransition: function(){

						var that = this;
						
						setTimeout(function(){

							that.triggerShown();

						}, 500);

					},

					onShown: function(){}

				});

				view.show();

				jasmine.clock().tick(300);

				expect(view._deferred.state()).toBe('pending');

				view.killTransitions();

				jasmine.clock().tick(400);

				expect(view._deferred).not.toBeDefined();
				

			});

			it('should call the promise fail() function', function(){

				var obj = {
					fail: function(){

					}
				};

				_.extend(view, {

					showTransition: function(){

						var that = this;
						
						setTimeout(function(){

							that.triggerShown();

						}, 500);

					},

					onShown: function(){}

				});

				spyOn(obj, 'fail');

				view.show().fail(obj.fail);

				view.killTransitions();

				expect(obj.fail.calls.count()).toBe(1);

			});

		});

		describe('hide method', function(){

			
			it('should return the view instance', function(){

				expect(view.hide()).toEqual(view);

			});

			it('should trigger the hide event', function(){

				// set _isShowing to true
				view.show();

				spyOn(view, 'trigger');

				view.hide();

				expect(view.trigger.calls.argsFor(0)[0]).toEqual('hide');

			});

			it('should only trigger "hide" event if view isShowing()', function(){

				var obj = {
					onHide: function(){

					}
				};

				// set _isShowing to true
				view.show();

				spyOn(obj, 'onHide');

				view.listenTo(view, 'hide', obj.onHide);

				view.hide();

				expect(obj.onHide.calls.count()).toBe(1);

				view.hide();

				expect(obj.onHide.calls.count()).toBe(1);

			});

			it('should return a Deferred promise no matter the state of isShowing()', function(){

				var ret = view.hide();

				expect(ret.then).toBeDefined();
				expect(ret.done).toBeDefined();
				expect(ret.fail).toBeDefined();
				expect(ret.always).toBeDefined();
				expect(ret.pipe).toBeDefined();
				expect(ret.progress).toBeDefined();
				expect(ret.state).toBeDefined();

				ret = view.hide();

				expect(ret.then).toBeDefined();
				expect(ret.done).toBeDefined();
				expect(ret.fail).toBeDefined();
				expect(ret.always).toBeDefined();
				expect(ret.pipe).toBeDefined();
				expect(ret.progress).toBeDefined();
				expect(ret.state).toBeDefined();

				expect(ret.resolve).not.toBeDefined();

			});

			it('should trigger "hidden" event when Deferred is resolved but not if it is already hidden', function(){

				spyOn(view, 'trigger');

				view.hide();

				expect(view.trigger).not.toHaveBeenCalled();

				view.show();

				view.hide();

				expect(view.trigger.calls.mostRecent().args[0]).toEqual('hidden');

			});

			it('should fire the promise "done" function even if it has been hidden', function(){

				var obj = {
					done: function(){}
				};

				view.hide();

				spyOn(obj, 'done');

				expect(view.isShowing()).toBe(false);
				expect(view.state()).toBe('resolved');

				view.hide().done(obj.done);

				expect(obj.done).toHaveBeenCalled();

			});


			describe('if !isShowing()', function(){

				beforeEach(function(){
					jasmine.clock().install();
				});

				afterEach(function(){
					jasmine.clock().uninstall();
				});

				it('should not call hideTransition', function(){

					var hiddenCounter = 0;

					_.extend(view, {

						onHide: function(){
							
						},

						hideTransition: function(){

							setTimeout(function(){

								view.triggerHidden();

							}, 500 );							
							
						},

						onHidden: function(){

							hiddenCounter++;
						}

					});

					view.show();

					spyOn(view, 'hideTransition').and.callThrough();
					spyOn(view, 'onHide').and.callThrough();
					spyOn(view, 'onHidden').and.callThrough();

					view.hide();
					
					setTimeout(view.hide, 200);

					expect(view.hideTransition.calls.count()).toBe(1);

					jasmine.clock().tick(100);

					expect(view.hideTransition.calls.count()).toBe(1);

					jasmine.clock().tick(300);

					expect(view.hideTransition.calls.count()).toBe(1);

					jasmine.clock().tick(200);

					expect(view.onHidden.calls.count()).toBe(1);
					

				});

			});

		});

		describe('onHidden method', function(){

			it('if it exists should be called when hide event is triggered', function(){

				_.extend(view, {

					onHide: function(){}

				});

				view.show();

				spyOn(view, 'onHide');

				expect(view.onHide.calls.count()).toBe(0);

				view.hide();

				expect(view.onHide.calls.count()).toBe(1);

			});

		});		

		describe('hideTransition method', function(){

			describe('if hideTransition does not exist', function(){

				it('onHide method should be triggered immediately', function(){

					view.show();

					_.extend(view, {

						onHide: function(){}

					});

					spyOn(view, 'onHide');

					expect(view.onHide.calls.count()).toBe(0);

					view.hide();

					expect(view.onHide.calls.count()).toBe(1);

				});				

			});

			describe('if showTransition method exists', function(){

				beforeEach(function(){

					view = new MockView({
						el: '.text-view'
					});

					_.extend(view, {

						hideTransition: function(){

						}

					});

					jasmine.clock().install();

				});

				afterEach(function(){
					jasmine.clock().uninstall();
				});

				it('hideTransition method should be called', function(){

					view.show();

					spyOn(view, 'hideTransition');

					view.hide();

					expect(view.hideTransition.calls.count()).toEqual(1);

				});

				describe('onHidden method', function(){

					beforeEach(function(){

						_.extend(view, {
							onHidden: function(){
								
							}
						});

						jasmine.clock().install();

					});

					afterEach(function(){
						jasmine.clock().uninstall();
					});

					describe('when Deferred is resolved', function(){

						it('should trigger onHidden method', function(){

							_.extend(view, {

								hideTransition: function(){

									var that = this;

									setTimeout(function(){

										that.triggerHidden();
										
									}, 500);								

								}

							});

							view.show();

							spyOn(view, 'onHidden');

							view.hide();

							expect(view.onHidden).not.toHaveBeenCalled();

							jasmine.clock().tick(250);

							expect(view.onHidden).not.toHaveBeenCalled();

							jasmine.clock().tick(250);

							expect(view.onHidden).toHaveBeenCalled();
							
						});

					});
				});

			
			});

		});

		describe('show/hide behavior if view promise state === "pending"', function(){

			beforeEach(function(){

				jasmine.clock().install();

				_.extend(view, {

					onShow: function(){},

					showTransition: function(){

						var that = this;

						setTimeout(function(){
							that.triggerShown();
						}, 500);

					},

					onShown: function(){},

					onHide: function(){},

					hideTransition: function(){

						var that = this;

						setTimeout(function(){
							that.triggerHidden();
						}, 500);

					},

					onHidden: function(){}

				});

			});

			afterEach(function(){

				jasmine.clock().uninstall();

			});

			describe('if isShowing() and state === "pending"', function(){

				describe('hide method', function(){

					it('should fire the promise "fail" function and not fire the done function', function(){

						var obj = {
							done: function(){},
							fail: function(){}
						};

						spyOn(obj, 'fail');
						spyOn(obj, 'done');

						view.show().done(obj.done).fail(obj.fail);

						jasmine.clock().tick(250);

						expect(view.state()).toBe('pending');

						view.hide();

						expect(obj.fail).toHaveBeenCalled();

						jasmine.clock().tick(350);

						expect(obj.done).not.toHaveBeenCalled();
					

					});

					it('should kill show transition', function(){

						spyOn(view, 'onShow');
						spyOn(view, 'onShown');

						view.show();

						expect(view.onShow).toHaveBeenCalled();
						expect(view.state()).toBe('pending');

						jasmine.clock().tick(250);

						expect(view.state()).toBe('pending');

						view.hide();

						jasmine.clock().tick(250);

						expect(view.onShown).not.toHaveBeenCalled();

						expect(view.state()).toBe('pending');						

					});

				});

			});

			describe('if !isShowing() and state === "pending"', function(){

				describe('show method', function(){

					beforeEach(function(){

						// setting _isShowing to true
						// and making sure showTransition is finished
						view.show();
						jasmine.clock().tick(500);
						expect(view.isShowing()).toBe(true);
						expect(view.state()).toBe('resolved');

					});

					it('should fire the promise "fail" function and not fire the done function', function(){

						var obj = {
							done: function(){},
							fail: function(){}
						};

						spyOn(obj, 'fail');
						spyOn(obj, 'done');

						view.hide().done(obj.done).fail(obj.fail);

						jasmine.clock().tick(250);

						expect(view.state()).toBe('pending');

						view.show();

						expect(obj.fail).toHaveBeenCalled();

						jasmine.clock().tick(350);

						expect(obj.done).not.toHaveBeenCalled();
					

					});

					it('should kill show transition', function(){

						spyOn(view, 'onHide');
						spyOn(view, 'onHidden');

						view.hide();

						expect(view.onHide).toHaveBeenCalled();
						expect(view.state()).toBe('pending');

						jasmine.clock().tick(250);

						expect(view.state()).toBe('pending');

						view.show();

						jasmine.clock().tick(250);

						expect(view.onHidden).not.toHaveBeenCalled();

						expect(view.state()).toBe('pending');						

					});

				});

			});

		});

		describe('toggleShow method', function(){

			it('if isShowing() then it should call the hide() method', function(){

				spyOn(view, 'hide');

				view.show();

				expect(view.isShowing()).toBe(true);

				view.toggleShow();

				expect(view.hide).toHaveBeenCalled();

			});

			it('if !isShowing() then it should call the show() method', function(){

				spyOn(view, 'show');

				expect(view.isShowing()).toBe(false);

				view.toggleShow();

				expect(view.show).toHaveBeenCalled();

			});

		});

	});

});