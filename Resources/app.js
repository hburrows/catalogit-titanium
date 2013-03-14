
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

var GLOBALS = require('globals'),
    mainPage

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

function showTabs() {

	var Capture,
			Browse,
			You,
			Manage;
	
	Capture = require('ui/' + GLOBALS.layout + '/CaptureWindow');
	Browse = require('ui/' + GLOBALS.layout + '/BrowseWindow');
	You = require('ui/' + GLOBALS.layout + '/YouWindow');
	Manage = require('ui/' + GLOBALS.layout + '/manage_window');

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	mainPage = new ApplicationTabGroup([
		{"name": "Capture",
		 "window": Capture,
		 "icon":"/images/nav_post_jot.png"
		},
		{"name": "Browse",
		 "window": Browse,
		 "icon":"/images/tabs/KS_nav_ui.png"
		},
		{"name": "Manage",
		 "window": Manage,
		 "icon": "/images/tabs/KS_nav_views.png"
		},
		{"name": "You",
		 "window": You,
		 "icon":"/images/nav_profile.png"
		}
	]);
	
	mainPage.open();

}

function doLogin() {
  /*
	var loginWindow = require('ui/common/login_window');
  Ti.App.Properties.setBool("signedin",false);    
	loginWindow().open();
	*/
  var welcomePage = require('ui/' + GLOBALS.layout + '/welcome_page');
  welcomePage().open();
}

// Handle successful login
Ti.App.addEventListener("authentication:success", function(e){
	// open tab group
	showTabs();
});

// Handle logout
Ti.App.addEventListener("authentication:logout", function(e){
  var welcomePage = require('ui/' + GLOBALS.layout + '/welcome_page');
  welcomePage().open();
});

// This is a single context application with mutliple windows in a stack
//
(function() {

	// determine platform and form factor and render approproate components
	var osname = Ti.Platform.osname,
			version = Ti.Platform.version,
			height = Ti.Platform.displayCaps.platformHeight,
			width = Ti.Platform.displayCaps.platformWidth;

	//considering tablet to have one dimension over 900px - this is imperfect, so you should feel free to decide
	//yourself what you consider a tablet form factor for android

  GLOBALS.layout = getIsTablet() ? 'tablet' : 'handheld';
  
	var signedIn = Ti.App.Properties.getBool("signedin");
	if (signedIn) {

		var makeJOTClient = require('utils/jotclient');
		var client = makeJOTClient();
	
		client.status({
			success: function(response, xhrResult) {

				// only if we think we're authenticated and the server says we're authenticated
				// will we go to the tabs
				if (response.authenticated) {
					showTabs();
				}
				else {
					doLogin();
				}
			},

			error: function(response, xhrResult) {
				alert('Error! ' + JSON.stringify(response) + '.  Application and service are not currently available');
			}
		});
		
	}
	else {
		doLogin();
	}

}());
