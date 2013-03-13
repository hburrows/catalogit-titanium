module.exports = function () {

  "use strict";

  var GLOBALS = require('globals');

  // create the window to hold all the "sub" windows in the navigation group
	var self = Titanium.UI.createWindow();

  // initialize to all modes
  self.orientationModes = [
    Ti.UI.PORTRAIT,
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ];

	var loginWin = Ti.UI.createWindow({
		'title': L('login'),
		'backgroundColor': '#fff',
    'navBarHidden': true,
    'layout': 'vertical'		
		//backgroundImage: 'images/bg_login.png'
	});

  // initialize to all modes
  loginWin.orientationModes = [
    Ti.UI.PORTRAIT,
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ];

	var nav = Titanium.UI.iPhone.createNavigationGroup({
	   window: loginWin
	});
	self.add(nav);
	
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
  
        loginWin.close();
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
	
	var label = Ti.UI.createLabel({
		color:'#000000',
		text:L('loginMessage'),
		left: 30, top: 20,
		right: 30, height: Ti.UI.SIZE,
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER		
	});
	loginWin.add(label);

  //
  //  CREATE USERNAME FIELD
  //
  var userName = Titanium.UI.createLabel({
    color:'#000',
    text:'Username',
    left:30, top:10,
    width: Ti.UI.SIZE
  });
  
  loginWin.add(userName);
  
  var userNameField = Titanium.UI.createTextField({
    hintText:'enter username',
    left: 30, top: 5,
    right: 30, height:35,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
  });

  userNameField.addEventListener('focus', function () {
    userNameField.value = '';
  });

  userNameField.addEventListener('return', function()
  {
    doLogin(userNameField.value, passwordField.value);
  });  

  loginWin.add(userNameField);
  
  //
  //  CREATE PASSWORD FIELD
  //
  var password = Titanium.UI.createLabel({
    color:'#000',
    text:'Password',
    left:30, top: 10,
    width:Ti.UI.Size
  });
  
  loginWin.add(password);
  
  var passwordField = Titanium.UI.createTextField({
    hintText:'enter password',
    height:35,
    left: 30, top:5,
    right: 30, width: Ti.UI.FILL,
    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED,
    autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
    returnKeyType:Ti.UI.RETURNKEY_GO,
    passwordMask:true    
  });
  
  passwordField.addEventListener('focus', function () {
    passwordField.value = '';
  });

  passwordField.addEventListener('return', function()
  {
    doLogin(userNameField.value, passwordField.value);
  });

  loginWin.add(passwordField);
  
/*
 *  ----------------- 
 */
  var login = Ti.UI.createButton({
    title: L('login'),
    left:30, top: 10,
     right:30, height: 45
  });
  loginWin.add(login);
  
  login.addEventListener('click', function() {
    doLogin(userNameField.value, passwordField.value);
  });

	var signup = Ti.UI.createButton({
		title:L('signup'),
		left: 30, top: 10,
		right: 30, height: 45
	});
	loginWin.add(signup);
	
	signup.addEventListener('click', function() {
		var signupWindow = require('ui/common/signup_window');
		nav.open(signupWindow(), {animated:true});
	});

  // setup listener for successful login and close window 
  // and entire navigation group
	Ti.App.addEventListener("authentication:success", function(e){
		// open tab group
		self.close();
	});

	return self;
};

