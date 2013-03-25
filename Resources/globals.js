
/* Defined like this so we can use ENDPOINT in the declaration below */

//var ENDPOINT = 'http://hellssatans.us/';
var ENDPOINT = 'http://localhost:8000/';
//var ENDPOINT = 'http://10.0.1.17:8000/'; // wireless
//var ENDPOINT = 'http://10.0.1.20:8000/';   // wired

var GLOBALS = {

  lastEntry: {
    id: null,
    media: null,
    type: null
  },

  currentEntryId: null,

  currentMedia: null,
  currentMediaType: null,
  currentMediaId: null,

  layout: 'handheld',

  api: {

    ENDPOINT: ENDPOINT,
    
    STATUS_RESOURCE: ENDPOINT + 'api/status/',
    
    LOGIN_RESOURCE: ENDPOINT + 'api/login',
    LOGOUT_RESOURCE: ENDPOINT + 'api/logout',
    
    USER_RESOURCE: ENDPOINT + 'api/users/',
    
    IMAGES_RESOURCE: ENDPOINT + 'api/users/self/images/',
    
    CLASSES_RESOURCE: ENDPOINT + 'api/classes/',

    SERVICES_RESOURCE: ENDPOINT + 'api/users/self/services/',
    SERVICE_RESOURCE: ENDPOINT + 'api/users/self/services/%service_type%/',
    
    ENTRIES_RESOURCE: ENDPOINT + 'api/users/self/entries/',
    ENTRY_RESOURCE: ENDPOINT + 'api/users/self/entries/%entry_id%/'
    
  },

  ui: {
    titleBarColor: '#309'
  }
};

module.exports = GLOBALS;