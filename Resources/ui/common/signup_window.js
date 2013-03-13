module.exports = function () {

  "use strict";

  var GLOBALS = require('globals');

	var self = Ti.UI.createWindow({
		'title': L('signup'),
		'backgroundColor': '#fff',
		'layout': 'vertical'
	});
	
  // initialize to all modes
  self.orientationModes = [
    Ti.UI.PORTRAIT,
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ];

	self.showNavBar();

  // DONE - NAV BAR BUTTON
  var doneButton = Titanium.UI.createButton({
    title:'Done',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  self.setRightNavButton(doneButton);
  
  doneButton.addEventListener('click', function () {
    createNewUser(userNameField.value, passwordField.value);
  });

	function createNewUser(username, password) {
	
    var xhr = Ti.Network.createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {

        Ti.API.info(this.status + ": " + this.responseText);

        var login = Ti.Network.createHTTPClient({
          
          // function called when the response data is available
          onload : function(e) {
    
            Ti.API.info(this.status + ": " + this.responseText);
    
            var response,
                contentType = this.getResponseHeader("Content-Type");
    
            // assuming JSON response on 200 response
            
            response = JSON.parse(this.responseText);
    
            Ti.App.Properties.setString('username',response.username);
            Ti.App.Properties.setBool('signedin',true);
            Ti.App.fireEvent("authentication:success");
      
            self.close();
          },
    
          // function called when an error occurs, including a timeout
          onerror : function(e) {
            Ti.API.debug(this.status + ': ' + this.responseText);
            alert('Unable to login as that new user.  Please try again.');
          },
    
          timeout : 5000  // in milliseconds
        });
    
        login.open('POST', GLOBALS.api.LOGIN_RESOURCE);
        login.setRequestHeader('Content-Type','application/json');
        login.send(JSON.stringify({"username": username, "password": password}));
      },

      // function called when an error occurs, including a timeout
      onerror : function(e) {
        Ti.API.debug(this.status + ': ' + this.responseText);
        alert(this.responseText);
      },

      timeout : 5000  // in milliseconds
    });

    xhr.open('POST', GLOBALS.api.USER_RESOURCE);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.send(JSON.stringify({"username": username, "password": password}));
	}
	
  //
  //  CREATE USERNAME FIELD
  //
  var userName = Titanium.UI.createLabel({
    color:'#000',
    text:'Username',
    left:30, top:20,
    width:Ti.UI.SIZE    
  });
  
  self.add(userName);
  
  var userNameField = Titanium.UI.createTextField({
    hintText:'enter username',
    left:30,
    right: 30, height:35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
  });

  userNameField.addEventListener('focus', function () {
    userNameField.value = '';
  });

  userNameField.addEventListener('return', function()
  {
    createNewUser(userNameField.value, passwordField.value);
  });  

  self.add(userNameField);
  
  //
  //  CREATE PASSWORD FIELD
  //
  var password = Titanium.UI.createLabel({
    color:'#000',
    text:'Password',
    left:30, top:10,
    width:Ti.UI.SIZE
  });
  
  self.add(password);
  
  var passwordField = Titanium.UI.createTextField({
    hintText:'enter password',
    left:30,
    right:30, height:35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    returnKeyType:Ti.UI.RETURNKEY_JOIN,
    passwordMask:true    
  });
  
  passwordField.addEventListener('focus', function () {
    passwordField.value = '';
  });

  passwordField.addEventListener('return', function()
  {
    createNewUser(userNameField.value, passwordField.value);
  });

  self.add(passwordField);

  //
  // SIGN UP MESSAGE
  //
  var label = Ti.UI.createLabel({
    color: '#000000',
    text: L('signupMessage'),
    top: 20, left: 30,
    right: 30, height: Ti.UI.SIZE,
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER    
  });
  self.add(label);
  
	return self;
}

