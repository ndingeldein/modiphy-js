define(['lodash', 'backbone', 'core/item-view', 'selectable/select-view', 'core/collection-view', 'backbone.select'], function(_, Backbone, ItemView, SelectableView, CollectionView){
	'use strict';

	describe('Modiphy SelectableView', function(){
		var view;
		var model;
		var collection;
		var models;


		var SelectableModel = Backbone.Model.extend({
			initialize: function(){
				Backbone.Select.Me.applyTo( this );
			}
		});

		var SingleCollection = Backbone.Collection.extend({

			model: SelectableModel,

			initialize: function(models){
				Backbone.Select.One.applyTo( this, models );
			}

		});

		var MultiCollection = Backbone.Collection.extend({

			model: SelectableModel,

			initialize: function(models){
				Backbone.Select.Many.applyTo( this, models );
			}

		});


		describe('SelectableView.Me', function(){			

			describe('applyTo method', function(){

				beforeEach(function(){

						model = new Backbone.Model();
						Backbone.Select.Me.applyTo(model);	

				});

				describe('when mixin is applied', function(){

					beforeEach(function(){

						view = new ItemView({
							model
						});

						SelectableView.Me.applyTo(view);

					});

					afterEach(function(){

						view.model.deselect();

					});

					describe('when model is selected', function(){			

						it('should trigger view\'s "select:view" event and pass the view and model as parameters', function(){

							spyOn(view, 'trigger');

							view.model.select();

							expect(view.trigger.calls.mostRecent().args).toEqual(['select:view', view, view.model]);

						});

						it('should trigger the view\'s onSelectView method if it exists and pass the view and model as parameters', function(){

							_.extend(view, {
								onSelectView: function(){}
							});

							spyOn(view, 'onSelectView');

							view.model.select();

							expect(view.onSelectView).toHaveBeenCalledWith(view, view.model);

						});

					});

					describe('when model is deselected', function(){

						it('should trigger view\'s "deselect:view" event and pass the view and model as parameters', function(){

							spyOn(view, 'trigger');

							view.model.select();
							view.model.deselect();


							expect(view.trigger.calls.mostRecent().args).toEqual(['deselect:view', view, view.model]);

						});

						it('should trigger the view\'s onDeselectView method if it exists and pass the view and model as parameters', function(){

							_.extend(view, {
								onDeselectView: function(){}
							});

							spyOn(view, 'onDeselectView');

							view.model.select();
							view.model.deselect();

							expect(view.onDeselectView).toHaveBeenCalledWith(view, view.model);

						});

					});

					describe('when model is reselected', function(){

						it('should trigger view\'s "reselect:view" event and pass the view and model as parameters', function(){

							spyOn(view, 'trigger');

							view.model.select();
							view.model.select();


							expect(view.trigger.calls.mostRecent().args).toEqual(['reselect:view', view, model]);

						});

						it('should trigger the view\'s onReselectView method if it exists and pass the view and model as parameters', function(){

							_.extend(view, {
								onReselectView: function(){}
							});

							spyOn(view, 'onReselectView');

							view.model.select();
							view.model.select();

							expect(view.onReselectView).toHaveBeenCalledWith(view, model);

						});

					});

				});

				describe('when view is not instance of View', function(){

					it('should throw error', function(){

						view = new Backbone.View();
						view.model = model;

						expect(function(){
							SelectableView.Me.applyTo(view);
						}).toThrow();

					});

				});

				describe('when view\'s model is undefined', function(){

					it('should throw error', function(){

						view = new Backbone.View();
						view.model = undefined;

						expect(function(){
							SelectableView.Me.applyTo(view);
						}).toThrow();

					});

				});


			});

		});

		describe('SelectableView.One', function(){		

			describe('applyTo method', function(){

				models = [
					{
						name: 'item-1'
					},
					{
						name: 'item-2'
					},
					{
						name: 'item-3'
					}
				];				

				beforeEach(function(){


					collection = new SingleCollection(models);
					view = new CollectionView({
						collection
					});
					
					SelectableView.One.applyTo(view);

				});

				describe('when mixin is applied', function(){

					beforeEach(function(){
							
					});

					afterEach(function(){

						collection.deselect();

					});

					describe('when model is selected', function(){			

						it('should trigger view\'s "select:one:view" event and pass view, model, and model\'s collection as parameters', function(){

							spyOn(view, 'trigger');

							collection.at(0).select();

							expect(view.trigger.calls.mostRecent().args).toEqual(['select:one:view', view, view.collection.selected, view.collection]);


						});

						it('should trigger the view\'s onSelectOneView method if it exists and pass view, model, and model\'s collection as parameters', function(){

							_.extend(view, {
								onSelectOneView: function(){}
							});

							spyOn(view, 'onSelectOneView');

							view.collection.at(1).select();

							expect(view.onSelectOneView).toHaveBeenCalledWith(view, view.collection.selected, view.collection);

						});

					});

					describe('when model is deselected', function(){

						it('should trigger view\'s "deselect:one:view" event and pass view, model, and model\'s collection as parameters', function(){

							spyOn(view, 'trigger');

							collection.at(1).select();						
							collection.deselect();

							expect(view.trigger.calls.mostRecent().args).toEqual(['deselect:one:view', view, collection.at(1), view.collection]);


						});

						it('should trigger the view\'s onDeselectOneView method if it exists and pass view, model, and model\'s collection as parameters', function(){

							_.extend(view, {
								onDeselectOneView: function(){}
							});

							spyOn(view, 'onDeselectOneView');

							view.collection.at(1).select();
							collection.deselect();

							expect(view.onDeselectOneView).toHaveBeenCalledWith(view, collection.at(1), view.collection);

						});

					});

					describe('when model is reselected', function(){

						it('should trigger view\'s "reselect:one:view" event and pass view, model, and model\'s collection as parameters', function(){

							spyOn(view, 'trigger');

							collection.at(1).select();
							collection.at(1).select();

							expect(view.trigger.calls.mostRecent().args).toEqual(['reselect:one:view', view, view.collection.selected, view.collection]);


						});

						it('should trigger the view\'s onReselectOneView method if it exists and pass view, model, and model\'s collection as parameters', function(){

							_.extend(view, {
								onReselectOneView: function(){}
							});

							spyOn(view, 'onReselectOneView');

							view.collection.at(1).select();
							view.collection.at(1).select();

							expect(view.onReselectOneView).toHaveBeenCalledWith(view, view.collection.selected, view.collection);

						});

					});

				});

				describe('when view is not instance of View', function(){

					it('should throw error', function(){

						view = new Backbone.View();
						view.model = model;

						expect(function(){
							SelectableView.Me.applyTo(view);
						}).toThrow();

					});

				});

				describe('when view\'s collection is undefined', function(){

					it('should throw error', function(){

						view = new Backbone.View();
						view.collection = undefined;

						expect(function(){
							SelectableView.One.applyTo(view);
						}).toThrow();

					});

				});

			});			

		});

		describe('SelectableView.Many', function(){		

			describe('applyTo method', function(){

				models = [
					{
						name: 'item-1'
					},
					{
						name: 'item-2'
					},
					{
						name: 'item-3'
					}
				];

				beforeEach(function(){

					collection = new MultiCollection(models);
					view = new CollectionView({
						collection
					});
					
					SelectableView.Many.applyTo(view);

				});

				describe('when mixin is applied', function(){

					beforeEach(function(){
							
					});

					afterEach(function(){

						collection.deselectAll();

					});

					describe('when all models are selected', function(){			

						it('should trigger view\'s "select:all:view" event and pass view, selected/deselected "diff" hash, and model\'s collection as parameters', function(){

							spyOn(view, 'trigger');

							collection.selectAll();

							expect(view.trigger.calls.mostRecent().args).toEqual(['select:all:view', view, {

								selected: collection.models,
								deselected: jasmine.any(Array)

							}, view.collection]);


						});

						it('should trigger the view\'s onSelectAllView method if it exists and pass view, model, and model\'s collection as parameters', function(){

							_.extend(view, {
								onSelectAllView: function(){}
							});

							spyOn(view, 'onSelectAllView');

							collection.selectAll();

							expect(view.onSelectAllView).toHaveBeenCalledWith(view, {

								selected: collection.models,
								deselected: jasmine.any(Array)

							}, view.collection);

						});

					});

					describe('when all models are deselected', function(){			

						it('should trigger view\'s "select:none:view" event and pass view, selected/deselected "diff" hash, and model\'s collection as parameters', function(){

							spyOn(view, 'trigger');

							collection.selectAll();
							collection.deselectAll();

							expect(view.trigger.calls.mostRecent().args).toEqual(['select:none:view', view, {

								selected: jasmine.any(Array),
								deselected: collection.models

							}, view.collection]);


						});

						it('should trigger the view\'s onSelectNoneView method if it exists and pass view, model, and model\'s collection as parameters', function(){

							_.extend(view, {
								onSelectNoneView: function(){}
							});

							spyOn(view, 'onSelectNoneView');

							collection.selectAll();
							collection.deselectAll();

							expect(view.onSelectNoneView).toHaveBeenCalledWith(view, {

								selected: jasmine.any(Array),
								deselected: collection.models

							}, view.collection);

						});

					});

					describe('when some models are selected', function(){			

						it('should trigger view\'s "select:some:view" event and pass view, selected/deselected "diff" hash, and model\'s collection as parameters', function(){

							spyOn(view, 'trigger');

							collection.at(0).select();
							collection.at(1).select();

							expect(view.trigger.calls.mostRecent().args).toEqual(['select:some:view', view, {

								selected: jasmine.any(Array),
								deselected: jasmine.any(Array)

							}, view.collection]);


						});

						it('should trigger the view\'s onSelectSomeView method if it exists and pass view, model, and model\'s collection as parameters', function(){

							_.extend(view, {
								onSelectSomeView: function(){}
							});

							spyOn(view, 'onSelectSomeView');

							collection.at(0).select();
							collection.at(1).select();

							expect(view.onSelectSomeView).toHaveBeenCalledWith(view, {

								selected: jasmine.any(Array),
								deselected: jasmine.any(Array)

							}, view.collection);

						});

					});

					describe('when some models are reselected', function(){			

						it('should trigger view\'s "reselect:any:view" event and pass view, array of selected models, and model\'s collection as parameters', function(){

							spyOn(view, 'trigger');

							collection.at(1).select();
							collection.at(1).select();

							expect(view.trigger.calls.mostRecent().args).toEqual(['reselect:any:view', view, [collection.at(1)], view.collection]);


						});

						it('should trigger the view\'s onReselectAnyView method if it exists and pass view, model, and model\'s collection as parameters', function(){

							_.extend(view, {
								onReselectAnyView: function(){}
							});

							spyOn(view, 'onReselectAnyView');

							collection.at(1).select();
							collection.at(1).select();

							expect(view.onReselectAnyView).toHaveBeenCalledWith(view, [collection.at(1)], view.collection);

						});

					});

				});

			});
			
		});		

	});

});