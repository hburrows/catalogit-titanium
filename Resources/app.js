
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
    createHTTPClient = require('lib/http_client_wrapper'),
    mainPage;

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

	var Dashboard,
	    Capture,
			Browse,
			You,
			Manage;
	
	Dashboard = require('ui/' + GLOBALS.layout + '/dashboard_window');
	Capture = require('ui/' + GLOBALS.layout + '/capture_window');
	Browse = require('ui/' + GLOBALS.layout + '/browse_window');
	You = require('ui/' + GLOBALS.layout + '/you_window');
	Manage = require('ui/' + GLOBALS.layout + '/manage_window');

	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	mainPage = new ApplicationTabGroup([
    {"name": "Dashboard",
     "window": Dashboard,
     "icon": "/images/tabs/KS_nav_views.png"
    },
		{"name": "View",
		 "window": Browse,
		 "icon":"/images/tabs/KS_nav_ui.png"
		},
    {"name": "Capture",
     "window": Capture,
     "icon": "/images/tabs/10-medical.png"
    },
		{"name": "Manage",
		 "window": Manage,
     "icon":"/images/nav_post_jot.png"
		},
		{"name": "You",
		 "window": You,
		 "icon":"/images/nav_profile.png"
		}
	]);
	
	mainPage.setActiveTab(1);
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

function serviceGateway() {

  // check if the backend service is responding so as to provide a "better"
  // UX if not
  var xhr = createHTTPClient({
    
    onload : function (e) {
  
      var response = JSON.parse(this.responseText); 
  
      // only if we think we're authenticated and the server says we're authenticated
      // will we go to the tabs
      if (response.authenticated) {
        showTabs();
      }
      else {
        doLogin();
      }
    },
    
    onerror: function (e) {
      var alert;

      if (!this.connected && this.status === 0) {

        alert = Titanium.UI.createAlertDialog({title: 'No response from service.', message: 'Do you want to try connecting to the service again?', buttonNames: ['Yes', 'No'], cancel: 1});

        alert.addEventListener('click', function(e) {
          
          Titanium.API.info('e = ' + JSON.stringify(e));

           // Clicked cancel, first check is for iphone, second for android
           if (e.cancel === e.index || e.cancel === true) {
              return;
           }
        
            //now you can use parameter e to switch/case
        
           switch (e.index) {
              case 0: Titanium.API.info('Clicked button 0 (YES)');
              serviceGateway();
              break;
        
              //This will never be reached, if you specified cancel for index 1
              case 1: Titanium.API.info('Clicked button 1 (NO)');
              alert("Kill the application and then try again.")
              break;
        
              default:
              break;
        
          }
        });

        alert.show();
      }
      else
        e._cit_handle_error(e);
      
    }
  
  });
  
  xhr.open('GET', GLOBALS.api.STATUS_RESOURCE);
  xhr.send('');
  
  
}
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
    serviceGateway();
	}
	else {
		doLogin();
	}

}());
