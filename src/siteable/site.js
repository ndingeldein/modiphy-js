define(['lodash', 'jquery', 'modiphy', 'siteable/site-router', 'siteable/overlay-page-wrapper', 'modiphy.pageable'], function(_, $, M, SiteRouter, OverlayPageWrapper){
	'use strict';

	var DefaultPageView = M.PageView.extend();
	var $body = $('body');
	var $bodyHtml = $('body, html');

	var defaultModelMap = {

		field01: 'name',

		field02: 'navText',

		field03: 'title',

		field04: 'layout',

		field05: 'type',

		link01: 'linkUrl'

	};

	var Site = function(options){

		options = options ? options : {};
		var defaults = {
			isMobile: true,
			rootDirectory: '',
			directLink: ''
		}
		_.defaults(this, options, defaults);

		this.pages = {};
		this.pages.normal = new M.Pages();
		this.pages.overlay = new M.Pages();

		this.factory = new M.ViewFactory({
			viewPrototype: M.PageView,
			modelViewTypeProperty: 'type',
			defaultViewType: DefaultPageView
		});

		this.pageLoader = new M.PageLoader();
		this.overlayPageLoader = new M.PageLoader();

		this.viewer = new M.Viewer({
			el: '.page-container'
		});
		this.overlayViewer = new M.Viewer({
			el: '.overlay-page-container'
		});


		this.pages.normal.on( 'select:one', this._onPageSelected, this );
		this.pages.overlay.on( 'select:one', this._onOverlayPageSelected, this );
		this.overlayPageWrapper = new OverlayPageWrapper({
				router: this.router
		});
		this.overlayViewer.on('viewer:cleared', this._onOverlayViewerCleared, this);

	};

	_.extend(Site.prototype, {

		triggerMethod: M.triggerMethod,

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

		},

		startHistory: function(){

			this.router = new SiteRouter({
				site: this
			});

			this.overlayPageWrapper.router =  this.router;

			Backbone.history.start({ pushState: true, root: this.rootDirectory });			

			$(document).on('click', 'a', {that: this}, this._delegateClick);

		},

		_onPageSelected: function(page){

			$body.attr('class', '');
			$body.addClass(page.get('layout') + '-page');
			$bodyHtml.animate({'scrollTop': 0}, {'duration':600, 'easing':'swing'});

			page.once('page:loaded', this._onPageLoaded, this);
			this.pageLoader.load(page);

			this.triggerMethod('page:selected', page);

		},

		_onOverlayPageSelected: function(page){

			this.overlayPageWrapper.show();
		
			page.once('page:loaded', this._onOverlayPageLoaded, this);
			this.overlayPageLoader.load(page);

			this.triggerMethod('overlay:page:selected', page);

		},

		_onPageLoaded: function(page){
			var view = this.factory.getView(page);
			this.viewer.model.set('view', view);
		},

		_onOverlayPageLoaded: function(page){
			
			var view = this.factory.getView(page);
			this.overlayViewer.model.set('view', view);

		},

		_onOverlayViewerCleared: function(){
			this.overlayPageWrapper.hide();
		},

		_scrollTo: function(e, href){

			e.preventDefault();

            var dest = 0;
            href = href.substring(1);

            var $target = $('a[name="' + href + '"]');
            if($target.length){

            	var $dh = $(document).height();
            	var $wh = $(window).height();

            	if ($target.offset().top > $dh - $wh) {
	                dest = $dh - $wh;
	            } else {
	                dest = $target.offset().top;
	            }
	            //go to destination
	            $bodyHtml.animate({
	                scrollTop: dest
	            }, 600, 'swing');
            }          

		},

		_delegateClick: function(e){			

			var that = e.data.that;
			var url = '';			
			var href = this.getAttribute('href');

			if(href.slice(0, 1) == '#'){

				that._scrollTo(e, href);

				return;
			}

			if (href.slice(0, that.directLink.length) == that.directLink){

				e.preventDefault();

				if( href.indexOf('?overlay') !== -1 ){

					var i = Backbone.history.fragment.indexOf('?');
					if(i == -1){
						url = Backbone.history.fragment;
					}else{
						url = Backbone.history.fragment.substring(0, i);
					}

					var params = M.deparam.querystring(Backbone.history.fragment);
					var newParams = M.deparam.querystring(href);
					
					params = _.extend(params, newParams);
					var paramStr = $.param( params );
					url = url + '?' + paramStr;	


				}else{

					url = href.slice(that.directLink.length);					

				}

				that.router.navigate(url, {trigger: true});
				
			}else{
				return;
			}

		}



	})

	return Site;

});