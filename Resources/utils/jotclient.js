
module.exports = function() {

  "use strict";

  var GLOBALS = require('globals');
  
	var xhr = Ti.Network.createHTTPClient();

	var that = {

		handleOnLoad: function(args, xhrResult) {
			var response;
			//var cookies = xhrResult.getResponseHeader('Set-Cookie');
			var contentType = xhrResult.getResponseHeader("Content-Type");
			if (contentType.indexOf('application/json') === 0) {
				response = JSON.parse(xhrResult.responseText); }
			else
			if (contentType.indexOf('text/plain') === 0) {
				response = xhrResult.responseText; }
	
			(args.success) ? args.success(response, xhrResult) : Ti.API.debug('Parse Client: Request Successful');			
		},

		handleOnError: function(args, xhrResult, ignoreCodes) {

			if (xhrResult.status !== 200) {
				Ti.API.debug('jotapi Client: Request FAILED with ' + xhrResult.status +' status code and message: ' + xhrResult.responseText);
				alert('Request FAILED with ' + xhrResult.status +' status code and message: ' + xhrResult.responseText);
			}
	
			var response;
			var contentType = xhrResult.getResponseHeader("Content-Type");
			if (contentType && contentType.indexOf("application/json") === 0) {
				response = JSON.parse(xhrResult.responseText); }
			else
			if (contentType && contentType.indexOf("text/plain") === 0) {
				response = xhrResult.responseText; }
	 
			(args.error) ? args.error(response,xhrResult) : Ti.API.error('Request Failed: ' + args.url);
			
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
			
			xhr.open('GET', GLOBALS.api.STATUS_RESOURCE);
			xhr.send('');
		},
		
		login: function(args) {

			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};

			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};
			
			xhr.open('POST', GLOBALS.api.LOGIN_RESOURCE);
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
			
			xhr.open('POST', GLOBALS.api.LOGOUT_RESOURCE);
			xhr.send('');
		},

    userCreate: function (args) {
      
      xhr.onload = function(e) {
        that.handleOnLoad(args, this);
      };

      xhr.onerror = function(e) {
        that.handleOnError(args, this);
      };
      
      xhr.open('POST', GLOBALS.api.USER_RESOURCE);
      xhr.setRequestHeader('Content-Type','application/json');
      xhr.send(JSON.stringify({"username": args.username, "password": args.password}));
      
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

			xhr.open('POST', GLOBALS.api.SERVICES_RESOURCE);
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

			xhr.open('DELETE', GLOBALS.api.SERVICE_RESOURCE.replace('%service_type%',args.service_type));
			xhr.send();

		},

		listEntries: function(args) {
			
			xhr.onload = function(e) {
				that.handleOnLoad(args, this);
			};
			xhr.onerror = function(e) {
				that.handleOnError(args, this);
			};
			
			xhr.open('GET', GLOBALS.api.ENTRIES_RESOURCE);
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

			xhr.open('POST', GLOBALS.api.ENTRIES_RESOURCE);
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

      xhr.open('GET', GLOBALS.api.ENTRY_RESOURCE.replace('%entry_id%',args.entry_id));
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

      xhr.open('POST', GLOBALS.api.ENTRY_IMAGE_RESOURCE.replace('%entry_id%',args.entry_id));
      xhr.send({image: args.media,
								cropRect: args.cropRect});
		}
		
	};
	
};
