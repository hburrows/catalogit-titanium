
"use strict";

function ApplicationWindow(title) {

	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	var login = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('login'),
		top:20
	});
	self.add(button);
	
	login.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title: L('login'),
			backgroundColor: 'white'
		}));
	});
	
	var logout = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('logout'),
		top:100
	});
	self.add(button);
	
	logout.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title: L('login'),
			backgroundColor: 'white'
		}));
	});
	return self;
}

module.exports = ApplicationWindow;
