
/* Defined like this so we can use ENDPOINT in the declaration below */

//var ENDPOINT = 'http://10.0.1.17:8000/'; // wireless
var ENDPOINT = 'http://10.0.1.20:8000/';   // wired
//var ENDPOINT = 'http://localhost:8000/';
//var ENDPOINT = 'http://jotapi.elasticbeanstalk.com/';

var GLOBALS = {

  lastEntry: {
    id: null,
    media: null
  },

  currentMedia: null,

  layout: 'handheld',

  api: {
    ENDPOINT: ENDPOINT,
    
    STATUS_RESOURCE: ENDPOINT + 'api/status/',
    
    LOGIN_RESOURCE: ENDPOINT + 'api/login',
    LOGOUT_RESOURCE: ENDPOINT + 'api/logout',
    
    USER_RESOURCE: ENDPOINT + 'api/users/',
    
    SERVICES_RESOURCE: ENDPOINT + 'api/users/self/services/',
    SERVICE_RESOURCE: ENDPOINT + 'api/users/self/services/%service_type%/',
    
    ENTRIES_RESOURCE: ENDPOINT + 'api/users/self/entries/',
    ENTRY_RESOURCE: ENDPOINT + 'api/users/self/entries/%entry_id%/',
    
    ENTRY_IMAGE_RESOURCE: ENDPOINT + 'users/self/entries/%entry_id%/images/'
  }
};

module.exports = GLOBALS;