module.exports = function (title) {

  "use strict";

  var GLOBALS = require('globals'),
	    makeCaptureView = require('/ui/handheld/capture_view');

	var self = Ti.UI.createWindow({
		title: title,
		backgroundColor: '#fff',
		barColor: GLOBALS.ui.titleBarColor
	});

	var view = makeCaptureView();
	self.add(view);

	return self;
}

