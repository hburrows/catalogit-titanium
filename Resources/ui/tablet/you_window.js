module.exports = function (title) {

  "use strict";
  
  var GLOBALS = require('globals');

  var self = Ti.UI.createWindow({
    title: title,
    barColor: GLOBALS.ui.titleBarColor
  });

  var container = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    backgroundColor: '#fff'
  });
  self.add(container);

  var services = Ti.UI.createButton({
    height: 44,
    width: 200,
    title: L('services'),
    top: 20
  });
  self.add(services);
  
  var logout = Ti.UI.createButton({
    height: 44,
    width: 200,
    title: L('logout'),
    top: 80
  });
  self.add(logout);
  
  services.addEventListener('click', function() {
    var createServicesWindow = require('ui/handheld/ServicesWindow');
    var servicesWindow = createServicesWindow();
    self.containingTab.open(servicesWindow);
  });

  logout.addEventListener('click', function() {

    var xhr = Ti.Network.createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {
        Ti.App.Properties.setBool("signedin",false);
        Ti.App.fireEvent("authentication:logout");
      },

      // function called when an error occurs, including a timeout
      onerror : function(e) {
        Ti.API.debug(this.status + ': ' + this.error);
        alert(e.error);
      },

      timeout : 5000  // in milliseconds
    });

    xhr.open('POST', GLOBALS.api.LOGOUT_RESOURCE);
    xhr.send();

  });

  return self;
}


