module.exports = function () {

  "use strict";

  var social = require('vendor/social');
  
  var jotClient = require('utils/jotclient');

	var twitterClient = social.create({
	    site: 'Twitter',
	    consumerKey: 'iv1azT2UGP6zCUikl0VByQ',
	    consumerSecret: 'sHEkR4pC0MToQW2vL6lmon62vvJ2DpiY2q8WYE85k' 
	});

	var self = Ti.UI.createWindow({
		title: 'Services',
		barColor: '#036',
//		backgroundImage: '/images/bg_grey_gradient_noise.png',
		backgroundColor: 'white'
	});

  var label = Ti.UI.createLabel({
	  color: '#900',
	  font: { fontSize:24 },
//	  shadowColor: '#aaa',
//	  shadowOffset: {x:3, y:3},
	  text: 'Connect to your Services',
	  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	  top: 30,
	  width: 'auto', height: 'auto'
  });
  self.add(label);
 
  var fb = require('facebook');

	var facebook = Ti.UI.createButton({
		height:44,
		width:200,
		title: fb.getLoggedIn() ? 'Disconnect Facebook' : 'Connect Facebook',
		top:100
	});
	self.add(facebook);
	
	var twitter = Ti.UI.createButton({
		height:44,
		width:200,
		title: twitterClient.isAuthorized() ? 'Disconnect Twitter' : "Connect Twitter",
		top:150
	});
	self.add(twitter);

	var instagram = Ti.UI.createButton({
		height:44,
		width:200,
		title:'Instagram',
		top:200
	});
	self.add(instagram);

	var foursquare = Ti.UI.createButton({
		height:44,
		width:200,
		title:'Foursquare',
		top:250
	});
	self.add(foursquare);

	facebook.addEventListener('click', function() {
		if (Ti.Facebook.getLoggedIn()) {
			Ti.Facebook.addEventListener('logout', function(e) {
				// remove service
				jotClient().removeService({
					service_type: 'facebook',
					success: function(response, cookie) {
						alert("SUCCESS - facebook logout");
						facebook.title = 'Connect Facebook';
					},
					error: function(response,xhr) {
					}
				});
			});
			Ti.Facebook.logout();
		}
		else {
			Ti.Facebook.appid = '486185371402693';
			Ti.Facebook.permissions = ['publish_stream']; // Permissions your app needs
			Ti.Facebook.addEventListener('login', function(e) {
			    if (e.success) {
						// send access_token to backend
						jotClient().addService({
							service_type: 'facebook',
							access_token: Ti.Facebook.accessToken,
							success: function(response, cookie) {
								facebook.title = 'Disconnect Facebook';
							},
							error: function(response,xhr) {
								alert("error adding service");
								Ti.Facebook.logout();
							}
						});
			        
			    }
			    else if (e.error) {
						alert(e.error);
			    }
			    else if (e.cancelled) {
						alert("Canceled");
			    }
			});
			Ti.Facebook.authorize();
		}
	});

	twitter.addEventListener('click', function() {

		if (!twitterClient.isAuthorized()) {
			twitterClient.authorize(function() {
        var credentials = twitterClient.getAccessCredentials();
				// send access_token to backend
				jotClient().addService({
					service_type: 'twitter',
					access_token: credentials.access_token,
					access_token_secret: credentials.access_token_secret,
					success: function(response, cookie) {
						twitter.title = 'Disconnect Twitter';
					},
					error: function(response,xhr) {
						alert("Error adding Twitter service.  Could not store credentials.");
						twitterClient.deauthorize();
					}
				});
			});
		}
		else {
			twitterClient.deauthorize();
			// send access_token to backend
			jotClient().removeService({
				service_type: 'twitter',
				success: function(response, cookie) {
					twitter.title = 'Connect Twitter';
				},
				error: function(response,xhr) {
					alert("Error removing Twitter service.  removeService failed.");
				}
			});
		}
    
    return;

	});

	instagram.addEventListener('click', function() {
		Ti.UI.createAlertDialog({
	            title:'Not Yet Implemented',
	            message:'Authenticate the user with Instagram so we can pull their data'
	      }).show();
	});

	foursquare.addEventListener('click', function() {
		Ti.UI.createAlertDialog({
	            title:'Not Yet Implemented',
	            message:'authenticate the user with Foursquare so we can pull their data'
	      }).show();
	});

	return self;
}

