"use strict";

var jotClient = require('utils/jotclient');

function ApplicationWindow() {

	var self = Ti.UI.createWindow({
		title: 'Services',
		barColor: '#036',
//		backgroundImage: '/images/bg_grey_gradient_noise.png',
		backgroundColor: 'white'
	});

  var label = Ti.UI.createLabel({
	  color: '#900',
	  font: { fontSize:24 },
//	  shadowColor: '#aaa',
//	  shadowOffset: {x:3, y:3},
	  text: 'Connect to your Services',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  top: 30,
	  width: 'auto', height: 'auto'
  });
  self.add(label);
 
	var facebook = Ti.UI.createButton({
		height:44,
		width:200,
		title:'Facebook',
		top:100
	});
	self.add(facebook);
	
	var twitter = Ti.UI.createButton({
		height:44,
		width:200,
		title:'Twitter',
		top:150
	});
	self.add(twitter);

	var instagram = Ti.UI.createButton({
		height:44,
		width:200,
		title:'Instagram',
		top:200
	});
	self.add(instagram);

	var foursquare = Ti.UI.createButton({
		height:44,
		width:200,
		title:'Foursquare',
		top:250
	});
	self.add(foursquare);

	return self;
}


module.exports = ApplicationWindow;
