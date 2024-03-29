"use strict";

var createServicesWindow = require('ui/handheld/ServicesWindow')

function doLogin() {

	
	Ti.App.Properties.setBool("signedin",false);

	var loginWindow = require('ui/common/login_window');
	var loginWindowInstance = loginWindow()
	loginWindowInstance.open();
}

function ApplicationWindow(title) {

	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		barColor:'#036'
	});
	
	var services = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('services'),
		top:20
	});
	self.add(services);
	
	var logout = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('logout'),
		top:80
	});
	self.add(logout);
	
	services.addEventListener('click', function() {
		servicesWindow = createServicesWindow();
		self.containingTab.open(servicesWindow);
	});

	return self;
}

module.exports = ApplicationWindow;
