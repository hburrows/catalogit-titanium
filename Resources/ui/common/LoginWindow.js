function ApplicationWindow() {

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
	self.add(label);
	
	var gridRowData = [];
	
	/*
	var logo = Ti.UI.createImageView({
		image:'../images/logo_login.png',
		width:120,
		height:44,
		top:65
	});
	win.add(logo); */
	
	// email
	var email = Ti.UI.createTableViewRow({
		height:50,
		selectionStyle:'NONE'
	});
	 
	var emailLabel = Titanium.UI.createLabel({
		text:L('username'),
		//font:{fontSize:14,fontFamily:'MilanBold'},
		left:10
	});
	 
	email.add(emailLabel);
	 
	var emailTextField = Ti.UI.createTextField({
		left:90,
		hintText: 'username',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE,
		autocapitalization: Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE
	});
	
	emailTextField.addEventListener('focus',function()
	{
		emailTextField.value = '';
	});
	
	email.add(emailTextField);
	
	gridRowData.push(email);
	
	
	
	// password
	var password = Ti.UI.createTableViewRow({
		height:40,
		selectionStyle:'NONE'
	});
	 
	var passwordLabel = Titanium.UI.createLabel({
		text:L('password'),
		//font:{fontSize:14,fontFamily:'MilanBold'},
		left:10
	});
	 
	password.add(passwordLabel);
	 
	var passwordTextField = Ti.UI.createTextField({
		left:90,
		hintText: 'password',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_NONE,
		returnKeyType:Ti.UI.RETURNKEY_GO,
		passwordMask:true
	});
	
	passwordTextField.addEventListener('focus',function()
	{
		passwordTextField.value = '';
	});
	
	password.add(passwordTextField);
	
	gridRowData.push(password);
	
	
	// setup listeners for posting
	//
	emailTextField.addEventListener('return', function()
	{
		doLogin(emailTextField.value, passwordTextField.value);
	});
	
	
	passwordTextField.addEventListener('return', function()
	{
		doLogin(emailTextField.value, passwordTextField.value);
	});
	
	
	// create table and add row data
	var table = Ti.UI.createTableView({
		data:gridRowData,
		style:Ti.UI.iPhone.TableViewStyle.GROUPED,
		top:135,
		backgroundColor:'transparent',
		rowBackgroundColor:'white'
	});
	loginWin.add(table);
	
	var signup = Ti.UI.createButton({
		height:44,
		width:250,
		title:L('signup'),
		top: 300
	});
	loginWin.add(signup);
	
	signup.addEventListener('click', function() {
		var signupWindow = require('ui/common/SignupWindow');
		nav.open(signupWindow(), {animated:true});
	});

	// Close window and entire navigation group an successful login
	Ti.App.addEventListener("LoginSuccess", function(e){
		// open tab group
		self.close();
	});

	return self;
};

module.exports = ApplicationWindow;
