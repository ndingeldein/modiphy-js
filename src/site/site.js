define(['lodash', 'modiphy', 'modiphy.pageable'], function(_, M){
	'use strict';

	var defaultModelMap = {

		field01: 'name',

		field02: 'navText',

		field03: 'title',

		field04: 'layout',

		field05: 'type',

		link01: 'linkUrl'

	};

	var Site = function(options){

		this.pages = {};
		this.pages.normal = new M.Pages();
		this.pages.overlay = new M.Pages();

		this.factory = new M.ViewFactory({
			viewPrototype: M.PageView
		});

	};

	_.extend(Site.prototype, {

		addPages: function(models, options){

			var defaults = {
				map: defaultModelMap,
				merge: false
			}

			options = options ? options : {};
			_.defaults(options, defaults);

			if(_.isArray(models)){
				var items = _.flatten( models );
				var all = _.map( items, function(value){

					var model = M.mapModel(value, options.map);

					return new M.Page(model);

				});

				all = _.uniq( all, function( page ){

					return page.get('name');

				});

				this.pages.normal.add( _.reject( all, M.isOverlayPage ), options );
				this.pages.overlay.add( _.filter( all, M.isOverlayPage ), options );

			}else{
				var page = new M.Page( M.mapModel(models, options.map) );
				if( page.isOverlayPage() ){
					this.pages.overlay.add(page);
				}else{
					this.pages.normal.add(page);
				}
			}		

			

		}

	})

	return Site;

});