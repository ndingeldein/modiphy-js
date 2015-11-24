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
define('gallery/gallery',[
	'lodash',
	'modiphy',
	'gallery/gallery-item',
	'gallery/gallery-items',
	'gallery/gallery-category',
	'gallery/gallery-categories',
	'gallery/image-gallery',
	'gallery/image-galleries'
	], function(
		_,
		M,
		GalleryItem,
		GalleryItems,
		GalleryCategory,
		GalleryCategories,
		ImageGallery,
		ImageGalleries
	){
	'use strict';

	var gallery = {

		GalleryItem: GalleryItem,
		GalleryItems: GalleryItems,
		GalleryCategory: GalleryCategory,
		GalleryCategories: GalleryCategories,
		ImageGallery: ImageGallery,
		ImageGalleries: ImageGalleries		

	};
	
	_.extend(M, gallery);

	return M;
	
});

define("gallery/modiphy.gallery", function(){});
