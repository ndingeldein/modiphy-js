define(['backbone', 'lodash', 'gallery/gallery-item'], function(Backbone, _, GalleryItem){
	'use strict';

	var item;

	describe('GalleryItem', function(){

		beforeEach(function(){

			item = new GalleryItem({
				gallery_id: 10,
				category: 100,
				id: 999,
				width: 200,
				height: 200,
				filename: 'my_img.JPG'
			});

		});

		it('should be selectable', function(){

			expect(item.select).toBeDefined();
			expect(item.deselect).toBeDefined();
			expect(item.toggleSelected).toBeDefined();

		});

		it('should have some default properties', function(){

			expect(item.get('gallery_id')).toBeDefined();
			expect(item.get('category')).toBeDefined();
			expect(item.get('field01')).toBeDefined();
			expect(item.get('link01')).toBeDefined();
			expect(item.get('target01')).toBeDefined();
			expect(item.get('parent_id')).toBeDefined();

		});

		it('should have a direct path to corresponding image', function(){

			expect(item.fluxPath).toBe('https://modiphy.dnsconnect.net/~webgalle/ez_img/');

		});

		it('should have a path to use for retriving a thumnnail with the image id', function(){

			expect(item.thumbnailPath).toBe('http://webgallerydisplay.com/image.php?id=');

		});

		describe('imageUrl method', function(){

			describe('if no minwidth nor minheight is provided', function(){

				it('should return a valid direct url to the image', function(){

					expect(item.imageUrl()).toBe('https://modiphy.dnsconnect.net/~webgalle/ez_img/' + item.get('gallery_id') + '/' + item.get('id') + '.jpg');

				});

			});


			describe('if a minwidth or minheight is provided', function(){

				it('should return a thumnail url', function(){

					expect(item.imageUrl(100)).toEqual(item.thumbnailPath + item.get('id') + '&maxwidth=100&maxheight=' + item.get('height'));

					expect(item.imageUrl(0, 100)).toEqual(item.thumbnailPath + item.get('id') + '&maxwidth=' + item.get('height') + '&maxheight=100');

				});

			});

		});

		describe('linkUrl method', function(){

			describe('if no linkField is provided', function(){

				it('should return default url', function(){

					expect(item.linkUrl('hotdog')).toEqual('hotdog');

				});

			});

			describe('if linkField is provided', function(){

				describe('linkField is empty or doesn\'t exist', function(){
					it('should return defaultUrl', function(){


						expect(item.linkUrl('hotdog', 'link01')).toEqual('hotdog');

						item.set('link05', 'weiner');

						expect(item.linkUrl('hotdog', 'link05')).toEqual('hotdog');

					});
				});

				describe('linkField is not empty and does exist', function(){
					it('should return the value of linkfield', function(){

						item.set('link01', 'weiner');

						expect(item.linkUrl('hotdog')).toEqual('weiner');

						item.set('link02', 'bratwurst');

						expect(item.linkUrl('hotdog', 'link02')).toEqual('bratwurst');

					});
				});


			});

		});


	});
	
});