define(['lodash', 'jquery', 'backbone', 'modiphy', 'backbone.queryparams'], function(_, $, Backbone, M){
	'use strict';

	var SiteRouter = Backbone.Router.extend({

		routes: {
			'': 'index',
			':page': 'selectPage',
			':page/': 'selectPage',
			':page/:subpage': 'selectSubPage',
			':page/:subpage/': 'selectSubPage',
			':page/:subpage/:subsubpage': 'selectSubSubPage',
			':page/:subpage/:subsubpage/': 'selectSubSubPage'
		},

		initialize: function( options ){

			this.site = options.site;
			this.pages = options.site.pages;

		},

		index: function(){
			
			if(this.site.pages.normal.length){
				this.site.pages.normal.at(0).select();
			}
			
		},

		updateNormalPage: function(hash){

			_.escape(hash);

			var i = hash.indexOf('#');
			if(i >= 0){
				hash = hash.substr(0, i);
			}

			var page = this.pages.normal.get(hash);
			if(!page){
				page = new M.Page( {name: hash} );
				this.pages.normal.add(page);
			}

			this.pages.normal.select(page);

		},

		updateOverlayPage: function(params){

			if(params && params.overlay){

				var page = this.pages.overlay.get( params.overlay );
				if(!page){
					page = new M.Page({name: params.overlay});
					this.pages.overlay.add(page);
				}

				this.pages.overlay.select(page);

			}else{
				this.pages.overlay.deselect();				
				this.site.overlayViewer.clearViews();
			}

		},

		updateParams: function(page, params){

			if(params && !params.overlay){

				var page = this.pages.normal.get(page);
				if(page == this.pages.normal.selected){
					this.pages.normal.deselect();
				}

			}else if(params && params.overlay){
				var page = this.pages.overlay.get(params.overlay);
				if(page == this.pages.overlay.selected){
					this.pages.overlay.deselect();
				}
			}

		},

		selectPage: function(page, params){

			_.escape( page );

			this.updateParams(page, params);		

			this.updateNormalPage(page);
			this.updateOverlayPage(params);			

		},

		selectSubPage: function(page, subpage, params){

			_.escape( subpage );

			this.updateParams(page, params);

			this.updateNormalPage(subpage);
			this.updateOverlayPage(params);			

		},

		selectSubSubPage: function(page, subpage, subsubpage, params){

			_.escape( subsubpage );

			this.updateParams(page, params);

			this.updateNormalPage(subsubpage);
			this.updateOverlayPage(params);
		}

	});

	return SiteRouter;

});