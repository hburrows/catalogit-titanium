
"use strict";

/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.  
 * A starting point for tab-based application with multiple top-level windows. 
 * Requires Titanium Mobile SDK 1.8.0+.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

function getIsTablet() {

	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
			version = Ti.Platform.version,
			height = Ti.Platform.displayCaps.platformHeight,
			width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	return osname === 'ipad' || (osname === 'android' && (width > 899 || height > 899));
}


function showTabs(isTablet) {

	var Capture,
			Browse,
			You,
			Manage;
	
	if (isTablet) {
		Capture = require('ui/tablet/CaptureWindow');
		Browse = require('ui/tablet/BrowseWindow');
		You = require('ui/tablet/YouWindow');
		Manage = require('ui/tablet/ManageWindow');
	}
	else {
		Capture = require('ui/handheld/CaptureWindow');
		Browse = require('ui/handheld/BrowseWindow');
		You = require('ui/handheld/YouWindow');
		Manage = require('ui/handheld/ManageWindow');
	}

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup([
		{"name":"Capture","window":Capture,"icon":"/images/nav_post_jot.png"},
		{"name":"Browse","window":Browse,"icon":"/images/tabs/KS_nav_ui.png"},
		{"name":"Manage","window":Manage,"icon":"/images/tabs/KS_nav_views.png"},
		{"name":"You","window":You,"icon":"/images/nav_profile.png"}
	]).open();

}

function doLogin(isTablet) {
	var loginWindow = require('ui/common/LoginWindow');
	loginWindow().open();
}

// Handle successful login
Ti.App.addEventListener("LoginSuccess", function(e){
	// open tab group
	showTabs(getIsTablet());
});

// This is a single context application with mutliple windows in a stack
(function() {

	//determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
			version = Ti.Platform.version,
			height = Ti.Platform.displayCaps.platformHeight,
			width = Ti.Platform.displayCaps.platformWidth;
	
	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android
	var isTablet = getIsTablet();

	var signedIn = Ti.App.Properties.getBool("signedin");
	if (signedIn) {

		var JOTClient = require('utils/jotclient');
		var client = JOTClient();
	
		client.status({
			success: function(response, xhrResult) {

				// only if we think we're authenticated and the server says we're authenticate
				// will we go to the tabs
				if (response.authenticated) {
					showTabs(isTablet);
				}
				else {
					Ti.App.Properties.setBool("signedin",false);		
					doLogin(isTablet);
				}
			},

			error: function(response, xhrResult) {
				alert('Error! ' + JSON.stringify(response) + '.  Application and service are not currently available');
			}
		});
		
	}
	else {
		Ti.App.Properties.setBool("signedin",false);		
		doLogin(isTablet);
	}

}());
