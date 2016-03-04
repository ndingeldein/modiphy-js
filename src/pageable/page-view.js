define(['modiphy'], function(M){
	'use strict';

	var PageView = M.ContainerView.extend({

		tagName: 'div',

		className: 'page',

		initialize: function(){

			this.$el.addClass( this.model.get('type') );
			this.$el.addClass( this.model.get('layout') );
			this.$el.addClass( this.model.get('name') );

		},

		onBeforeRender: function(){
			if( !this.template ){
				this.$el.html( this.model.get('content').html );
			}
		}

	});

	return PageView;

});