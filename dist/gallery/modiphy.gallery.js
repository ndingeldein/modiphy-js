define('gallery/gallery-item',['backbone', 'backbone.select'], function(Backbone){
	'use strict';

	var GalleryItem = Backbone.Model.extend({

		defaults:{

			parent_id: 0,

			gallery_id: 1,

			filename: '',

			filesize: 0,

			width: 0,

			height: 0,

			mime: '',

			category: 0,

			linktext01: '',

			linktext02: '',

			link01: '',

			link02: '',

			link03: '',

			target01: '',

			target02: '',

			target03: '',

			order: 0,

			field01: '',

			field02: '',

			field03: '',

			field04: '',

			field05: '',

			field06: '',

			field07: '',

			field08: '',

			field09: '',

			field10: '',

			scaleWidth: '',

			scaleHeight: '',

			description01: '',

			description02: '',

			description03: '',

			subcat: 0,

			objType: 0


		},

		fluxPath: 'https://modiphy.dnsconnect.net/~webgalle/ez_img/',

		thumbnailPath: 'http://webgallerydisplay.com/image.php?id=',

		defaultLinkField: 'link01',

		linkFields: ['link01', 'link02', 'link02'],

		initialize: function(){
			Backbone.Select.Me.applyTo(this);
		},

		imageUrl: function(maxwidth, maxheight){

			maxwidth = typeof maxwidth !== 'undefined' ? maxwidth : 0;
			maxheight = typeof maxheight !== 'undefined' ? maxheight : 0;

			if(!maxwidth && !maxheight){
				return this.fluxPath + this.get('gallery_id')+ '/' + this.get('id') + '.' + this.get('filename').split('.').pop().toLowerCase();
			}else{
				maxwidth = maxwidth ? maxwidth : this.get('width');
				maxheight = maxheight ? maxheight : this.get('height');
				return this.thumbnailPath + this.get('id')+ '&maxwidth=' + maxwidth + '&maxheight=' + maxheight;
			}
			
		},

		linkUrl: function(defaultUrl, linkField){

			defaultUrl = defaultUrl ? defaultUrl : '';
			linkField = linkField ? linkField : this.defaultLinkField;

			if( _.indexOf( this.linkFields, linkField ) == -1 ){
				linkField = this.defaultLinkField;
			}

			return this.get(linkField) ? this.get(linkField) : defaultUrl;

		}

	});

	return GalleryItem;

});
define('gallery/gallery-items',['backbone', 'gallery/gallery-item', 'backbone.select'], function(Backbone, GalleryItem){
	'use strict';

	var GalleryItems = Backbone.Collection.extend({

		model: GalleryItem,

		initialize: function(models){
			 Backbone.Select.One.applyTo( this, models );
		}

	});

	return GalleryItems;

});
define('gallery/gallery-category',['backbone', 'gallery/gallery-items', 'backbone.select'], function(Backbone, GalleryItems){
	'use strict';

	var GalleryCategory = Backbone.Model.extend({

		defaults:{

			description: '',

			gallery_id: 0,

			image_id: 0,

			order: 0,

			parent_id: 0,

			items: new GalleryItems()

		},

		initialize: function(){
			Backbone.Select.Me.applyTo(this);
		}

	});

	return GalleryCategory;

});
define('gallery/gallery-categories',['backbone', 'gallery/gallery-category', 'backbone.select'], function(Backbone, GalleryCategory){
	'use strict';

	var GalleryCategories = Backbone.Collection.extend({

		model: GalleryCategory,

		initialize: function(models){
			Backbone.Select.One.applyTo( this, models );
		}

	});

	return GalleryCategories;

});
define('gallery/image-gallery',['backbone', 'gallery/gallery-categories', 'backbone.select'], function(Backbone, GalleryCategories){
	'use strict';

	var ImageGallery = Backbone.Model.extend({

		defaults: {
			title: '',
			categories: new GalleryCategories()
		},

		initialize: function(){
			Backbone.Select.Me.applyTo(this);
		}

	});

	return ImageGallery;

});
define('gallery/image-galleries',['backbone', 'gallery/image-gallery', 'backbone.select'], function(Backbone, ImageGallery){
	'use strict';

	var ImageGalleries = Backbone.Collection.extend({

		model: ImageGallery,

		initialize: function(models){			
			Backbone.Select.One.applyTo( this, models );
		}

	});

	return ImageGalleries;

});
define('gallery/gallery-loader',['lodash', 'jquery', 'backbone', 'modiphy', 'gallery/image-galleries', 'gallery/image-gallery', 'gallery/gallery-categories', 'gallery/gallery-category', 'gallery/gallery-items'], function(_, $, Backbone, M,ImageGalleries, ImageGallery, GalleryCategories, GalleryCategory, GalleryItems){
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
define('gallery/gallery',[	
	'gallery/gallery-item',
	'gallery/gallery-items',
	'gallery/gallery-category',
	'gallery/gallery-categories',
	'gallery/image-gallery',
	'gallery/image-galleries',
	'gallery/gallery-loader'
	], function(		
		GalleryItem,
		GalleryItems,
		GalleryCategory,
		GalleryCategories,
		ImageGallery,
		ImageGalleries,
		GalleryLoader
	){
	'use strict';

	var Gallery = {

		GalleryItem: GalleryItem,
		GalleryItems: GalleryItems,
		GalleryCategory: GalleryCategory,
		GalleryCategories: GalleryCategories,
		ImageGallery: ImageGallery,
		ImageGalleries: ImageGalleries,
		GalleryLoader: GalleryLoader	

	};
	
	return Gallery;
	
});
define('modiphy.gallery',[
	'lodash',
	'modiphy',
	'gallery/gallery'
	], function(
		_,
		M,
		Gallery
	){
	'use strict';

	_.extend(M, Gallery);

	return M;
	
});

define("gallery/modiphy.gallery", function(){});
