"use strict";

var createServicesWindow = require('ui/handheld/ServicesWindow')

function doLogin() {

	
	Ti.App.Properties.setBool("signedin",false);

	var loginWindow = require('ui/common/LoginWindow');
	var loginWindowInstance = loginWindow()
	loginWindowInstance.open();
}

function ApplicationWindow(title) {

	var jotClient = require('utils/jotclient');

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

	logout.addEventListener('click', function() {

		var client = jotClient();
		
		client.logout({
			success: function(response, cookie) {
				doLogin();
			},
			error: function(response,xhr) {
				alert('Error attempting to logout');
			}
		});

	});

	return self;
}

module.exports = ApplicationWindow;
