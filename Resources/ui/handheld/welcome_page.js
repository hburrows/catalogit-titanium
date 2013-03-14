/*
 * 
 */

module.exports = function () {

  "use strict";

  var GLOBALS = require('globals');

  var self = Titanium.UI.createWindow(),
      navGroup;
  
  // create the window to hold all the "sub" windows in the navigation group
  var welcomeWin = Titanium.UI.createWindow({
    backgroundColor: '#fff',
    title: 'Start',
    barColor: 'blue',
    navBarHidden: true
  });

  // initialize to all modes
  welcomeWin.orientationModes = [
    Ti.UI.PORTRAIT,
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ];

  var view1 = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL    
  });

  var image1 = Ti.UI.createImageView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    image:'/images/welcome/arches.jpg'  
  });
  view1.add(image1);

  var message1 = Ti.UI.createLabel({
    width: '80%',
    center: '50%',
    top: '10%',
    text: 'CatalogIt allows you to easily document your valuables, collections, and everyday things.\n\nSwipe to learn more...',
    font: {fontSize: 16, fontWeight: 'bold'},
    color: '#fff',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  });
  view1.add(message1);

  var view2 = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL    
  });

  var image2 = Ti.UI.createImageView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    image:'/images/welcome/violin2.jpg'  
  });
  view2.add(image2);

  var message2 = Ti.UI.createLabel({
    width: '80%',
    center: '50%',
    top: '60%',
    text: 'TBD',
    font: {fontSize: 16, fontWeight: 'bold'},
    color: '#fff',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  });
  view2.add(message2);

  var view3 = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL    
  });

  var image3 = Ti.UI.createImageView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    image:'/images/welcome/dog2.jpg'  
  });
  view3.add(image3);

  var message3 = Ti.UI.createLabel({
    width: '80%',
    center: '50%',
    top: '60%',
    text: 'By starting with a photo or video CatalogIt takes a visual first approach to cataloging things.',
    font: {fontSize: 16, fontWeight: 'bold'},
    color: '#fff',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  });
  view3.add(message3);


  var view4 = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL    
  });

  var image4 = Ti.UI.createImageView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    image:'/images/welcome/trumpet.jpg'  
  });
  view4.add(image4);

  var message4 = Ti.UI.createLabel({
    width: '80%',
    center: '50%',
    top: '60%',
    text: 'TBD',
    font: {fontSize: 16, fontWeight: 'bold'},
    color: '#fff',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  });
  view4.add(message4);

  var view5 = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL    
  });

  var image5 = Ti.UI.createImageView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    image:'/images/welcome/rooster.jpg'  
  });
  view5.add(image5);

  var message5 = Ti.UI.createLabel({
    width: '80%',
    center: '50%',
    top: '10%',
    text: 'It costs nothing to get started so what\'s stopping you.  Click \'Register\' now and let\'s get going.',
    font: {fontSize: 16, fontWeight: 'bold'},
    color: '#fff',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  });
  view5.add(message5);


  var scrollView = Ti.UI.createScrollableView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    views:[view1,view3,view5],
    showPagingControl:true,
    pagingControlHeight:30,
    pagingControlOnTop: true,
    maxZoomScale:2.0,
    currentPage: 0
  });
  welcomeWin.add(scrollView);

  //
  // -- BUTTON VIEW
  //
  var buttonContainer = Titanium.UI.createView({
    left: 10, bottom: 10,
    right: 10, height: Ti.UI.SIZE
  });
  welcomeWin.add(buttonContainer);

  var registerButton = Titanium.UI.createButton({
    title: 'Register',
    left: 0,
    width: '49%',
    opacity: 0.75
  });
  buttonContainer.add(registerButton);

  registerButton.addEventListener('click', function (e) {
    var registerPage = require('ui/' + GLOBALS.layout + '/register_page');
    navGroup.open(registerPage(), {animated:true});
    return;  
  });
  
  var loginButton = Titanium.UI.createButton({
    title: 'Log In',
    left: '51%',
    width: '49%',
    opacity: 0.75
  });
  buttonContainer.add(loginButton);

  loginButton.addEventListener('click', function (e) {
    var loginPage = require('ui/' + GLOBALS.layout + '/login_page');
    navGroup.open(loginPage(), {animated:true});
    return;  
  });

  navGroup = Titanium.UI.iPhone.createNavigationGroup({
     window: welcomeWin
  });
  self.add(navGroup);

  //
  // listener for successful login to close navigation group
  //
  Ti.App.addEventListener("authentication:success", function(e){
    // open tab group
    self.close();
  });

  return self;
}
