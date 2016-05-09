define(['modiphy'], function(M){
	'use strict';

	var OverlayPageWrapper = M.ContainerView.extend({
		el: '.overlay-page-wrapper',

		events: {
			'click .close-button': 'closeOverlay'
		},

		closeOverlay: function(){

			var url;
			var i = Backbone.history.fragment.indexOf('?');
			if(i == -1){
				url = Backbone.history.fragment;
			}else{
				url = Backbone.history.fragment.substring(0, i);
			}

			var params = M.deparam.querystring(Backbone.history.fragment);
			var newParams = {
				overlay: 'none'
			};
			
			params = _.extend(params, newParams);
			delete params.overlay;
			var paramStr = $.param( params );
			
			url = url + '?' + paramStr;

			if(this.router){
				this.router.navigate(url, {trigger: true});
			}			

		},

		onShow: function(){

			this.$el.show();

		},

		onHidden: function(){

			this.$el.hide();

		}

	});

	return OverlayPageWrapper;

});