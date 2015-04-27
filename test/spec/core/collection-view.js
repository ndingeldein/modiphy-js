define(['lodash', 'backbone', 'core/view', 'core/item-view', 'core/container-view', 'core/view-factory', 'core/collection-view', 'templates', 'jasmine-jquery'], function(_, Backbone, View, ItemView, ContainerView, ViewFactory, CollectionView, Templates){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../test/fixtures';

	describe('modiphy CollectionView', function(){

		var view;
		var collection;

		it('should extend modiphy ContainerView.prototype', function(){

			expect(CollectionView instanceof ContainerView).toBe(false);
			expect(CollectionView.prototype instanceof ContainerView).toBe(true);

			expect(ContainerView.prototype.isPrototypeOf( CollectionView )).toBe(false);
			expect(ContainerView.prototype.isPrototypeOf( CollectionView.prototype )).toBe(true);

		});

		it('should create a collection if one is not provided in options', function(){

			view = new CollectionView();
			expect(view.collection).toBeDefined();

		});

		describe('factory property', function(){

			it('should be an instance of ViewFactory', function(){

				view = new CollectionView();

				expect(view.factory).toBeDefined();
				expect(view.factory instanceof ViewFactory).toBe(true);

			});

			it('should force viewType to be instance of View and default to ItemView', function(){

				var MyChildView = ItemView.extend({
					myFunc: function(){}
				});
				var MyView = function(){};

				view = new CollectionView({
					factoryOptions: {
						viewType: MyChildView
					}
				});

				expect(view.factory.viewType).toBe(MyChildView);
				
				view = new CollectionView({
					factoryOptions: {
						viewType: MyView
					}
				});

				expect(view.factory.viewType).toBe(ItemView);

			});

		});

		describe('render method', function(){

			beforeEach(function(){

				view = new CollectionView();

			});

			it('should call ContainerView.prototype.render', function(){

				expect(ContainerView.prototype.render === CollectionView.prototype.render).toBe(true);

			});

			describe('for each item in collection', function(){

				beforeEach(function(){

					collection = new Backbone.Collection();
					for(var i=0; i<3; i++){
						collection.add(new Backbone.Model({
							name: 'item-' + i
						}));
					}

					view = new CollectionView({
						collection: collection
					});

				});

				it('should create a View and add it to the container', function(){

					view.render();

					expect(view.container.length).toBe(3);
					view.container.each(function(view){
						expect(view instanceof View).toBe(true);
					});

				});

				it('should call the ViewFactory\'s getView method', function(){

					spyOn(view.factory, 'getView').and.callThrough();

					view.render();

					expect(view.factory.getView.calls.count()).toBe(3);

				});

				it('should use a model\'s custom view options if specified', function(){

					collection.at(1).set('viewOptions', {
						tagName: 'li'
					});

					view.render();

					expect(view.container.findByIndex(1).el.tagName).toBe('LI');

				});

				it('should use a model\'s custom view type if specified', function(){

					var CustomType = ItemView.extend();

					collection.at(2).set('viewType', CustomType);

					view.render();

					expect(view.container.findByIndex(2) instanceof CustomType).toBe(true);

				});

				it('item view should be added to collection view\'s el', function(){

					view.render();

					expect(view.el.childNodes.length).toBe(3);

				});

			});

			describe('if collection has already been rendered', function(){

				beforeEach(function(){

					collection = new Backbone.Collection();
					for(var i=0; i<3; i++){
						collection.add(new Backbone.Model({
							name: 'item-' + i
						}));
					}

					view = new CollectionView({
						collection: collection
					});

				});

				it('the view\'s el children, container length, and collection length should all be equal and position should match', function(){

					view.render();

					expect(view.container.length).toBe(3);
					expect(view.el.childNodes.length).toBe(3);

					view.collection.add(new Backbone.Model({
						name: 'item-4'
					}));

					view.collection.add(new Backbone.Model({
						name: 'item-5'
					}), {at: 2});

					view.collection.remove(view.collection.at(0));

					view.render();

					expect(view.container.length).toBe(view.el.childNodes.length);
					
					view.collection.each(function(model, index){
						var childView = view.container.findByIndex(index);
						expect(childView.el).toEqual(view.el.childNodes[index]);
						expect(model).toBe(childView.model);
					});

				});

			});

		});

		describe('collection events', function(){

			beforeEach(function(){

				collection = new Backbone.Collection();

				for(var i=0; i<3; i++){
					collection.add(new Backbone.Model({
						name: 'item-' + i
					}));
				}

				view = new CollectionView({
					collection: collection,
					tagName: 'ul',
					factoryOptions: {
						viewOptions: {
							tagName: 'li'
						}
					}
				});

			});

			describe('add event', function(){

				describe('if collection view has not been rendered', function(){

					beforeEach(function(){

						view.render();

					});

					it('should trigger add:view event', function(){

						spyOn(view, 'trigger').and.callThrough();

						view.collection.add(new Backbone.Model({
							name: 'item-4'
						}));

						expect(view.trigger.calls.argsFor(0)).toEqual(['add:view', jasmine.any(Backbone.View)]);

					});

					it('should call onAddView method if it exists', function(){

						_.extend(view, {
							onAddView: function(){}
						});

						spyOn(view, 'onAddView');

						view.collection.add(new Backbone.Model({
							name: 'item-4'
						}));

						expect(view.onAddView).toHaveBeenCalled();
						
					});

					it('should be able to add view at any position', function(){

						view.collection.add(new Backbone.Model({
							name: 'item-4',
							viewOptions: {
								className: 'added-item'
							}
						}), {at: 1});

						expect(view.container.length).toBe(view.el.childNodes.length);

						view.collection.each(function(model, index){
							
							var childView = view.container.findByModel(model);
							expect(view.el.childNodes[index]).toEqual(childView.el);

						});

					});


				});				

				describe('if collection view has not been rendered', function(){

					it('should not trigger add:view event', function(){

						spyOn(view, 'trigger').and.callThrough();

						view.collection.add(new Backbone.Model({
							name: 'item-4'
						}));

						expect(view.trigger.calls.count()).toBe(0);

					});

				});


			});

			describe('remove event', function(){

				describe('if collection view has been rendered', function(){

					beforeEach(function(){

						view.render();

					});

					it('should trigger remove:view event', function(){

						spyOn(view, 'trigger').and.callThrough();

						view.collection.remove(view.collection.at(1));

						expect(view.trigger.calls.argsFor(0)).toEqual(['remove:view', jasmine.any(Object)]);

					});

					it('should call onRemoveView method if it exists', function(){

						_.extend(view, {
							onRemoveView: function(){}
						});

						spyOn(view, 'onRemoveView');

						view.collection.remove(view.collection.at(1));

						expect(view.onRemoveView).toHaveBeenCalled();

					});

					it('should remove the corresponding view', function(){

						view.collection.remove(view.collection.at(1));

						expect(view.container.length).toEqual(view.collection.length);
						expect(view.container.length).toEqual(view.el.childNodes.length);

						view.collection.each(function(model, index){
							var childView = view.container.findByIndex(index);
							expect(view.el.childNodes[index]).toEqual(childView.el);
						});

					});

				});

				describe('if collection view has not been rendered', function(){

					it('should not trigger remove:view event', function(){

						spyOn(view, 'trigger').and.callThrough();

						view.collection.remove(view.collection.at(1));

						expect(view.trigger.calls.count()).toBe(0);

					});

				});

			});

			describe('reset event', function(){

				describe('if view has NOT been rendered', function(){

					it('should not render the collection view', function(){

						spyOn(view, 'render');

						collection.reset();
						
						expect(view.render).not.toHaveBeenCalled();

					});

				});

				describe('if view has been rendered', function(){

					beforeEach(function(){

						view.render();

					});

					it('should render the collection view', function(){

						view.collection.reset();

						//spyOn(view, 'render').and.callThrough();

						//expect(view.render).toHaveBeenCalled();

						expect(view.container.length).toBe(0);
						expect(view.el.childNodes.length).toBe(0);

						for(var i=0; i<3; i++){
							collection.add(new Backbone.Model({
								name: 'item-' + i
							}));
						}

						view.collection.reset(collection.toJSON());

						expect(view.container.length).toBe(3);
						expect(view.el.childNodes.length).toBe(3);

					});

				});				

			});

		});

	});

});
