/*
 * 
 */

module.exports = function () {

  "use strict";

  var GLOBALS = require('globals');

  function doLogin(username, password) {
  
    var xhr = Ti.Network.createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {

        Ti.API.info("Received text: " + this.responseText);

        var response,
            contentType = this.getResponseHeader("Content-Type");

        // assuming JSON response on 200 response
        
        response = JSON.parse(this.responseText);

        Ti.App.Properties.setString('username',response.username);
        Ti.App.Properties.setBool('signedin',true);
        Ti.App.fireEvent("authentication:success");
      },

      // function called when an error occurs, including a timeout
      onerror : function(e) {
        Ti.API.debug(this.status + ': ' + this.error);
        if (!this.connected && this.status === 0) {
          alert(e.error);
        }
        else {
          alert('Ugh, tiny keyboards, right?\n\nTry entering your username and password again.');
        }
      },

      timeout : 5000  // in milliseconds
    });

    xhr.open('POST', GLOBALS.api.LOGIN_RESOURCE);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({"username": username, "password": password}));

  }

  // create the window to hold all the "sub" windows in the navigation group
  var self = Titanium.UI.createWindow({
    backgroundColor: '#eee',
    title:'Log In',
    barColor: 'blue',
    navBarHidden: false
  });

  // initialize to all modes
  self.orientationModes = [
    Ti.UI.PORTRAIT,
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ];

  //
  // NAVBAR LOGIN BUTTON
  //
  //
  var navbarLogin = Titanium.UI.createButton({
    title:'Log In',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  self.setRightNavButton(navbarLogin);

  navbarLogin.addEventListener('click', function () {
    doLogin(userNameField.value, passwordField.value);
  });
  
  var containerView = Ti.UI.createView({
    top: 0, width: Ti.UI.FILL,
    layout: 'vertical'
  });
  self.add(containerView);

  //
  //  CREATE USERNAME FIELD
  //
  
  /*
  // label
  var userName = Titanium.UI.createLabel({
    color: '#000',
    text: 'Username',
    left:30, top:10,
    width: Ti.UI.SIZE,
    font:{font:'Helvetica',fontSize:13,fontWeight:'bold'}
    
  });
  containerView.add(userName);
  */

  var userNameField = Titanium.UI.createTextField({
    hintText:'Email Address',
    left: 20, top: 20,
    right: 20, height:35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
  });
  containerView.add(userNameField);
  
  userNameField.addEventListener('focus', function () {
    userNameField.value = '';
  });

  userNameField.addEventListener('return', function () {
    doLogin(userNameField.value, passwordField.value);
  });  

  //
  //  CREATE PASSWORD FIELD
  //
  
  /*
  // label
  var password = Titanium.UI.createLabel({
    color:'#000',
    text:'Password',
    left:30, top: 10,
    font:{font:'HelveticaNeue', fontSize:13, fontWeight:'bold'}
  });
  containerView.add(password);
  */

  // text input
  var passwordField = Titanium.UI.createTextField({
    hintText:'Password',
    left: 20, top:10,
    right: 20, height:35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    returnKeyType:Ti.UI.RETURNKEY_GO,
    passwordMask:true    
  });
  containerView.add(passwordField);
  
  passwordField.addEventListener('focus', function () {
    passwordField.value = '';
  });

  passwordField.addEventListener('return', function()
  {
    doLogin(userNameField.value, passwordField.value);
  });

/*
 *  ----------------- 
 */
  var login = Ti.UI.createButton({
    title: L('Log In'),
    left: 20, top: 20,
    right: 20
  });
  containerView.add(login);
  
  login.addEventListener('click', function() {
    doLogin(userNameField.value, passwordField.value);
  });

  //
  // DISCLAIMER MESSAGE
  //
  var label = Ti.UI.createLabel({
    color: '#000000',
    text: L('disclaimer'),
    bottom: 20, left: 20,
    right: 20, height: Ti.UI.SIZE,
    font: {fontSize:12},
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER    
  });
  self.add(label);

  return self;
}
