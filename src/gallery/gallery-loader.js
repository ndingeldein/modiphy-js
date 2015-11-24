define(['lodash', 'jquery', 'backbone', 'modiphy', 'gallery/image-galleries', 'gallery/image-gallery', 'gallery/gallery-categories', 'gallery/gallery-category', 'gallery/gallery-items'], function(_, $, Backbone, M,ImageGalleries, ImageGallery, GalleryCategories, GalleryCategory, GalleryItems){
	'use strict';



	var GalleryLoader = function(options){		

		options = options || {};

		var defaults = {

			jsonPath: 'http://www.webgallerydisplay.com/lib/cached_gallery_jsonp.php'

		};

		_.defaults(this, options, defaults);

	};

	_.extend(GalleryLoader.prototype, {

		triggerMethod: M.triggerMethod,

		load: function(id){
			if(this.deferreds){
				this._stopLoading();
			}			
			if(_.isArray(id)){
				this._loadGalleries(id);
			}else{
				this._loadGallery(id);
			}

		},

		_loadGalleries: function(ids){
			
			this.deferreds = [];
			_.each(ids, function(value){				
				this.deferreds.push(this._loadGallery(value));
			}, this);

			$.when.apply( $, this.deferreds ).done(_.bind(this._allDataLoaded, this));

		},

		_loadGallery: function(id){

			var deferred = $.Deferred();
			
			$.ajax({			
		            url: this.jsonPath,
		            data: {gallery_id: id},
		            dataType: 'jsonp'

		        }).done(_.bind(this._dataLoaded, this, deferred, id))
				.fail(deferred.reject);

			return deferred;

		},

		_dataLoaded: function(deferred, id, data){
			if(data.success){
				var gallery = this._createGallery(id, data);				
				deferred.resolve(gallery);
			}else{
				deferred.reject();
				alert('Gallery not found :(\n' + 'Please try again!');		
			}
		},

		_allDataLoaded: function(){

			var galleries = new ImageGalleries();
			_.each(arguments, function(value){
				galleries.add(value);
			});
			this.trigger('galleries:loaded', galleries);
		},

		_createGallery: function(id, data){

			var categories = new GalleryCategories();

			_.each(data.images, _.bind(this._createCategory, this, data, categories));

			var gallery = new ImageGallery({
				id: id,
				categories: categories
			});

			this.triggerMethod('gallery:loaded', gallery);

			return gallery;

		},

		_createCategory: function(data, categories, value, index){

			data.categories[index].items = new GalleryItems( value );

			categories.add( new GalleryCategory( data.categories[index] ) );

		},

		_stopLoading: function(){
			if(this.deferreds){
				_.each(this.deferreds, function(deferred){
					deferred.reject();
				});
				this.deferreds.length = 0;
			}
		}

	});

	_.extend(GalleryLoader.prototype, Backbone.Events);

	return GalleryLoader;

});