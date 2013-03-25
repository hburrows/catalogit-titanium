module.exports = function (title) {

  "use strict";
  
  var GLOBALS = require('globals'),
      createHTTPClient = require('lib/http_client_wrapper');

	var self = Ti.UI.createWindow({
		title: title,
		barColor: GLOBALS.ui.titleBarColor
	});

  var container = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    backgroundColor: '#fff',
    layout: 'vertical'
  });
  self.add(container);

	var services = Ti.UI.createButton({
		height: 44,
		width: '50%',
		title: L('services'),
		top: 20, center: '50%'
	});
	container.add(services);
	
	var logout = Ti.UI.createButton({
		height: 44,
		width: '50%',
		title: L('logout'),
		top: 20, center: '50%'
	});
	container.add(logout);
	
	services.addEventListener('click', function (e) {
    var createServicesWindow = require('ui/handheld/services_window');
		var servicesWindow = createServicesWindow();
		self.containingTab.open(servicesWindow);
	});

	logout.addEventListener('click', function (e) {

    var xhr = createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {
        Ti.App.Properties.setBool("signedin",false);
        Ti.App.fireEvent("authentication:logout");
      }
    });

    xhr.open('POST', GLOBALS.api.LOGOUT_RESOURCE);
    xhr.send();

	});

  var test = Ti.UI.createButton({
    height: 44,
    width: '50%',
    title: 'Test',
    top: 20, center: '50%'
  });
  container.add(test);

  function renderContents(container, width, height) {
    container.setBackgroundColor('#eee');
  }

  test.addEventListener('click', function (e) {

    var createSheetView = require('ui/common/sheet_view'),
        sheetView = createSheetView(self, self, 'test');

    sheetView.show();
     
  });

  self.addEventListener('test:closed', function (e) {
//    alert('closed');
  });

	return self;
}


