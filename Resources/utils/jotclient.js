"use strict";


//var ENDPOINT = 'http://10.0.1.17:8000/';
//var ENDPOINT = 'http://10.0.1.20:8000/';
var ENDPOINT = 'http://localhost:8000/';
//var ENDPOINT = 'http://jotapi.elasticbeanstalk.com/';

var STATUS_RESOURCE = ENDPOINT + 'status/';

var LOGIN_RESOURCE = ENDPOINT + 'login';
var LOGOUT_RESOURCE = ENDPOINT + 'logout';

var SERVICES_RESOURCE = ENDPOINT + 'users/self/services/';
var SERVICE_RESOURCE = ENDPOINT + 'users/self/services/%service_type%/';

var ENTRIES_RESOURCE = ENDPOINT + 'users/self/entries/';
var ENTRY_RESOURCE = ENDPOINT + 'users/self/entries/%entry_id%/';

var ENTRY_IMAGE_RESOURCE = ENDPOINT + 'users/self/entries/%entry_id%/images/';

exports = function() {

	var xhr = Ti.Network.createHTTPClient();

	var that = {

		handleOnLoad: function(args, xhrResult) {
			var response;
			var cookies = xhrResult.getResponseHeader('Set-Cookie');
			var header = xhrResult.getResponseHeader("Content-Type");
			if (header.indexOf('application/json') === 0) {
				response = JSON.parse(xhrResult.responseText); }
			else
			if (header.indexOf('text/plain') === 0) {
				response = xhrResult.responseText; }
	
			(args.success) ? args.success(response, xhrResult) : Ti.API.debug('Parse Client: Request Successful');			
		},

		handleOnError: function(args, xhrResult, ignoreCodes) {

			if (xhrResult.status !== 200) {
				Ti.API.debug('jobapi Client: Request FAILED with ' + xhrResult.status +' status code and message: ' + xhrResult.responseText);
				alert('Request FAILED with ' + xhrResult.status +' status code and message: ' + xhrResult.responseText);
			}
	
			var response;
			var header = xhrResult.getResponseHeader("Content-Type");
			if (header.indexOf("application/json") === 0) {
				response = JSON.parse(xhrResult.responseText); }
			else
			if (header.indexOf("text/plain") === 0) {
				response = xhrResult.responseText; }
	 
			(args.error) ? args.error(response,xhrResult) : Ti.API.error('Parse Client: Request Failed: ' + args.url);
			
		}
	};
		
	return {

		status: function(args) {

			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};

			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};
			
			xhr.open('GET', STATUS_RESOURCE);
			xhr.send('');
		},
		
		login: function(args) {

			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};

			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};
			
			xhr.open('POST', LOGIN_RESOURCE);
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.send(JSON.stringify({"username": args.username, "password": args.password}));
		},
		
		logout: function(args) {

			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};
			
			xhr.open('POST', LOGOUT_RESOURCE);
			xhr.send('');
		},

		addService: function(args) {
			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};

			var service_add_req = {service_type: args.service_type, access_token: args.access_token};
			if (args.access_token_secret) {
				service_add_req.access_token_secret = args.access_token_secret;
			}

			xhr.open('POST', SERVICES_RESOURCE);
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.send(JSON.stringify(service_add_req));
		},

		removeService: function(args) {
			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};

			xhr.open('DELETE', SERVICE_RESOURCE.replace('%service_type%',args.service_type));
			xhr.send();

		},

		listEntries: function(args) {
			
			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};
			
			xhr.open('GET', ENTRIES_RESOURCE);
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.send('');
		},

		createEntry: function(args) {
			
			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};
			
			var create_request = {
				entry_type: args.entry_type,
				entry_time: Math.round(new Date().getTime()/1000),
				attributes: args.attributes
			};

			xhr.open('POST', ENTRIES_RESOURCE);
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.send(JSON.stringify(create_request));
			
		},

		getEntry: function(args) {

			if (!args || !args.entry_id) {
				throw 'invalid number of arguments';
			}

      xhr.onload = function(e) {
				that.handleOnLoad(args, this);
      };
 
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};

      xhr.open('GET', ENTRY_RESOURCE.replace('%entry_id%',args.entry_id));
      xhr.send('');
		},

		uploadImage: function(args) {

			if (!args || !args.entry_id) {
				throw 'invalid number of arguments';
			}

      xhr.onload = function(e) {
				that.handleOnLoad(args, this);
      };
 
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};

      xhr.open('POST', ENTRY_IMAGE_RESOURCE.replace('%entry_id%',args.entry_id));
      xhr.send({image: args.media,
								cropRect: args.cropRect});
		}
		
	};
	
};
