module.exports = function () {

  // create the window to hold all the "sub" windows in the navigation group
	var self = Titanium.UI.createWindow();
	
	var loginWin = Ti.UI.createWindow({
		title:L('login'),
		backgroundColor:'gray',
		//backgroundImage: 'images/bg_login.png'
	});

	loginWin.hideNavBar();

	var nav = Titanium.UI.iPhone.createNavigationGroup({
	   window: loginWin
	});
	self.add(nav);
	
	function doLogin(username, password) {
	
		var jotClient = require('utils/jotclient');
	
		var client = jotClient();
	
		client.login({
	
			username: username,
			password: password,
	
			success: function(response, xhr) {
				Ti.App.Properties.setString('username',response.username);
				Ti.App.Properties.setBool('signedin',true);
				Ti.App.fireEvent("LoginSuccess");
	
				loginWin.close();
			},
	
			error: function(response,xhr) {
				alert('Ugh, tiny keyboards, right?\n\nTry entering your username and password again.');
			}
		});	
	}
	
	var label = Ti.UI.createLabel({
		color:'#000000',
		text:L('loginMessage'),
		top: 20,
		height:'auto',
		width:'auto'
	});
	loginWin.add(label);
	
	var gridRowData = [];
	
	/*
	var logo = Ti.UI.createImageView({
		image:'../images/logo_login.png',
		width:120,
		height:44,
		top:65
	});
	win.add(logo); */

  //
  //  CREATE USERNAME FIELD
  //
  var userName = Titanium.UI.createLabel({
    color:'#000',
    text:'Username',
    top:50,
    left:30,
    width:100,
    height:'auto'
  });
  
  loginWin.add(userName);
  
  var userNameField = Titanium.UI.createTextField({
    hintText:'enter username',
    height:35,
    top:75,
    left:30,
    width:250,
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
    top:120,
    left:30,
    width:100,
    height:'auto'
  });
  
  loginWin.add(password);
  
  var passwordField = Titanium.UI.createTextField({
    hintText:'enter password',
    height:35,
    top:145,
    left:30,
    width:250,
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
    height:44,
    width:250,
    title:L('login'),
    top: 210
  });
  loginWin.add(login);
  
  login.addEventListener('click', function() {
    doLogin(userNameField.value, passwordField.value);
  });

	var signup = Ti.UI.createButton({
		height:44,
		width:250,
		title:L('signup'),
		top: 265
	});
	loginWin.add(signup);
	
	signup.addEventListener('click', function() {
		var signupWindow = require('ui/common/signup_window');
		nav.open(signupWindow(), {animated:true});
	});

  // setup listener for successful login and close window 
  // and entire navigation group
	Ti.App.addEventListener("LoginSuccess", function(e){
		// open tab group
		self.close();
	});

	return self;
};

