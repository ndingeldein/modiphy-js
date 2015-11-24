define(['backbone', 'backbone.select'], function(Backbone){
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