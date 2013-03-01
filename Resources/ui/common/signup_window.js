"use strict";

module.exports = function () {

	var self = Ti.UI.createWindow({
		title: L('signup'),
		backgroundColor:'white',
		//backgroundImage: 'images/bg_login.png'
	});
	
	self.showNavBar();

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
				
				self.close();
			},
	
			error: function(response,xhr) {
				alert('Ugh, tiny keyboards, right?\n\nTry entering your username and password again.');
			}
		});	
	}
	
	var gridRowData = [];
	
	/*
	var logo = Ti.UI.createImageView({
		image:'../images/logo_login.png',
		width:120,
		height:44,
		top:65
	});
	self.add(logo); */
	
	var label = Ti.UI.createLabel({
		color:'#000000',
		text:L('signupMessage'),
		top: 20,
		height:'auto',
		width:'auto'
	});
	self.add(label);
	
	// email
	var email = Ti.UI.createTableViewRow({
		height:40,
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
		hintText: 'supersecret',
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
		top:150,
		backgroundColor:'transparent',
		rowBackgroundColor:'white'
	});
	self.add(table);
	
	return self;
}

