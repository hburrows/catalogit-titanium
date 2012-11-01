"use strict";

var jotClient = require('utils/jotclient');

function ApplicationWindow(entry_json_obj) {

	var self = Ti.UI.createWindow({
		title: entry_json_obj.entry_type,
		barColor: '#006',
//		backgroundImage: '/images/bg_grey_gradient_noise.png',
		backgroundColor: 'white'
	});

  var image = Ti.UI.createImageView({
		defaultImage:'/images/cloud.png',
		width:'auto',
		height:'auto'
  });
  self.add(image);
 
	jotClient().getEntry({

		entry_id: entry_json_obj.id,

		success: function(response,xhrResult) {
			if (response.images && response.images.length > 0) {
				image.image = response.images[0].image;
			}
		},

		error: function(response, xhrResult) {
      Ti.UI.createAlertDialog({
            title:'Create Activity Error',
            message:'status code: ' + xhrResult.status + ', message: ' + response
      }).show();										
		}
		 
	});
/*
	var button = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('newWindow'),
		top:20
	});
	self.add(button);
	
	button.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title: L('openWindow'),
			backgroundColor: 'white'
		}));
	});
*/

	return self;
}


module.exports = ApplicationWindow;
