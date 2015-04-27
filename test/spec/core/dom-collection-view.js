define(['lodash', 'backbone', 'jquery', 'core/item-view', 'core/collection-view', 'core/dom-collection-view', 'jasmine-jquery'], function(_, Backbone, $, ItemView, CollectionView, DomCollectionView){
	'use strict';

	jasmine.getFixtures().fixturesPath = '../test/fixtures';

	describe('modiphy DomCollectionView mixin', function(){

		var collection;
		var	view;

		

		beforeEach(function(){

			loadFixtures('collection_view.html');

			collection = new Backbone.Collection();
			$('.dom-collection-view').children().each(function(index){
				collection.add(new Backbone.Model({
					name: 'item-' + index
				}));
			});

			view = new CollectionView({
				el: '.dom-collection-view',
				collection: collection
			});

		});

		describe('constructor', function(){

			it('should throw an error if view is undefined', function(){	

				var myView;

				expect(function(){
					DomCollectionView.applyTo(myView);
				}).toThrow();


			});

			it('should throw an error if view is not an instance of CollectionView', function(){	

				var myView = new ItemView();
				
				expect(function(){
					DomCollectionView.applyTo(myView);
				}).toThrow();


			});

			it('should throw an error if view.el.childNodes.length does not equal collection.length', function(){

				collection.add(new Backbone.Model({
					name: 'item-4'
				}));

				expect(function(){
					DomCollectionView.applyTo(view);
				}).toThrow();

			});

			it('should set the viewOptions el for each model in the collection to the respective child element', function(){

				DomCollectionView.applyTo(view);

				view.collection.each(function(model){
					
					expect(model.get('viewOptions')).toBeDefined();
					expect(model.get('viewOptions').el.length).toBe(1);
					
				});

			});

			it('should use the ViewFactory\'s modelViewOptionsProperty to find and change the view options', function(){


				view.factory.modelViewOptionsProperty = 'myViewOptions';

				DomCollectionView.applyTo(view);

				view.collection.each(function(model){
					
					expect(model.get('myViewOptions')).toBeDefined();
					expect(model.get('myViewOptions').el.length).toBe(1);

				});


			});

			describe('when the collection view is rendered', function(){

				it('should add the model to the container', function(){

					DomCollectionView.applyTo(view);
					view.render();

					view.collection.each(function(model, index){
						
						expect(view.container.findByIndex(index).model).toBe(model);

					});

				});

				it('the collection view\'s DOM element should have same number of children', function(){

					DomCollectionView.applyTo(view);

					expect(view.$el.children().length).toBe(3);

					view.render();

					expect(view.$el.children().length).toBe(3);

				});

			});
			
		});

	});

});