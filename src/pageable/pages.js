define(['modiphy', 'pageable/page'], function(M, Page){
	'use strict';

	var Pages = M.SingleCollection.extend({

		model: Page

	});

	return Pages;

});