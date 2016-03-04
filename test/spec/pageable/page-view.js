define(['core/view', 'pageable/page', 'pageable/page-view', 'templates'], function(View, Page, PageView, Templates){
	'use strict';

	var model = new Page({
		name: 'about',
		layout: 'foo',
		type: 'bar'
	});

	var pageView = new PageView({
		model: model
	});

	describe('PageView', function(){

		it('should be a div', function(){

			expect(pageView.tagName).toBe('div');

		});

		it('should have a class of "page"', function(){

			expect(pageView.className).toBe('page');

		});

		it('should apply classes for type, layout, name', function(){

			expect(pageView.$el.hasClass('bar')).toBe(true);
			expect(pageView.$el.hasClass('foo')).toBe(true);
			expect(pageView.$el.hasClass('about')).toBe(true);			

		});

		describe('if no template', function(){

			it('should add html content', function(){

				model.set('content', {
					html: 'asdf'
				});

				pageView.render();

				expect(pageView.$el.html()).toBe('asdf');

			});

		});

		describe('if template', function(){

			it('should not add content', function(){

				model.set('content', {
					html: 'asdf'
				});

				_.extend(pageView, {
					template: Templates['item-view']
				});

				pageView.render();

				expect(pageView.$el.html()).not.toBe('asdf');


			});

		});

	});

});