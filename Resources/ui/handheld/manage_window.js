/*
 * 
 */

module.exports = function (title) {

  "use strict";

	var jotClient = require('utils/jotclient');

	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white',
		barColor:'#036'
	});

  // initialize to all modes
  self.orientationModes = [
    Titanium.UI.PORTRAIT,
    Titanium.UI.LANDSCAPE_LEFT,
    Titanium.UI.LANDSCAPE_RIGHT
  ];

  Ti.Gesture.addEventListener('orientationchange', function (e) {
    Titanium.API.info('Orientation changed');
  });

  var PADDING = 10;

	var container = Ti.UI.createView({
	  left: PADDING, top: 0,
	  right: PADDING, bottom: PADDING,
	  layout: 'vertical'
	});
	self.add(container);
	
	var classesView = Ti.UI.createView({
	  top: 10,
	  width: Ti.UI.FILL, height: 100,
	  borderWidth: 1,
	  borderColor: '#999',
	  layout: 'vertical'
	});
	container.add(classesView);

  var classesTitle = Ti.UI.createLabel({
    left: 0, top: 0,
    font: {
      font:'Avenir',
      fontSize: 14,
      fontWeight: 'bold'
    },
    text: 'Classes'
  });
  classesView.add(classesTitle);
 
  var classesDescription = Ti.UI.createLabel({
    left: 0, top: 5,
    font: {
      font:'Avenir',
      fontSize: 14,
      fontWeight: 'normal'
    },
    text: 'Classes are used to represent a thing or concept that has a tangible or physical representation in your world.  This pane lists all the classes defined in your collection and allows you to create new classes and relate them to one another.'
  });
  classesView.add(classesDescription);
 
	var propertiesView = Ti.UI.createView({
	  top: 10,
    width: Ti.UI.FILL, height: 100,
    borderWidth: 1,
    borderColor: '#999',
    layout: 'vertical'	  
	});
	container.add(propertiesView);

  var propertiesTitle = Ti.UI.createLabel({
    left: 0, top: 0,
    font: {
      font:'Avenir',
      fontSize: 14,
      fontWeight: 'bold'
    },
    text: 'Properties',
    backgroundColor: '#fcfcfc'
  });
  propertiesView.add(propertiesTitle);

  var propertiesDescription = Ti.UI.createLabel({
    left: 0, top: 5,
    font: {
      font:'Avenir',
      fontSize: 14,
      fontWeight: 'normal'
    },
    text: 'Properties describe individual attributes or characteristics of an thing.  For example, a \'Person\' thing might have properties like name, age, marital status, etc.  Use this pane to view and manage your properties.'
  });
  propertiesView.add(propertiesDescription);

	return self;
}
