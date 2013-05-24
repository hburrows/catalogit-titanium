/**
 * @author Howard Burrows
 */

module.exports = function (title) {

  "use strict";
  
  var GLOBALS = require('globals'),
      createHTTPClient = require('lib/http_client_wrapper');

  var self = Ti.UI.createWindow({
    title: title,
    barColor: GLOBALS.ui.titleBarColor,
  });

  var container = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    backgroundColor: '#fff',
    layout: 'vertical'
  });
  self.add(container);

  var explanation = Ti.UI.createLabel({
    left: 20, right: 20, top:20,
    text: 'This tab is used to be a dashboard and display count, value, and other general status information'
  });
  self.add(explanation);

  return self;
}


