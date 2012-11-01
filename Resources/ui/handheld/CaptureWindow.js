"use strict";

function ApplicationWindow(title) {

	var primaryCaptureGrid = require('/ui/handheld/PrimaryCaptureView');

	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		barColor:'#309'
	});

	var view = primaryCaptureGrid();
	view.top = 20;
	self.add(view);

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
};

module.exports = ApplicationWindow;