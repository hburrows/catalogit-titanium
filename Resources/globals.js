
/* Defined like this so we can use ENDPOINT in the declaration below */

var ENDPOINT = 'http://hellssatans.us/';
//var ENDPOINT = 'http://localhost:8000/';
//var ENDPOINT = 'http://10.0.1.17:8000/';    // wireless
//var ENDPOINT = 'http://10.0.1.20:8000/';    // wired

var GLOBALS = {

  // flag indicating that media is in process of uploading and
  // XHR handling upload
  uploadPending: false,
  uploadXHR: null,

  currentMedia: null,
  currentMediaType: null,

  layout: 'handheld',

  DEFAULT_FONT_SIZE: Ti.Platform.name === 'android' ? 15 : 13,
  LARGE_FONT_SIZE: Ti.Platform.name === 'android' ? 18 : 16,
  MED_LARGE_FONT_SIZE: Ti.Platform.name === 'android' ? 16 : 14,
  MEDIUM_FONT_SIZE: Ti.Platform.name === 'android' ? 14 : 12,  
  SMALL_FONT_SIZE: Ti.Platform.name === 'android' ? 11 : 9,

  FONT_FAMILY: 'Helvetica Neue',

  api: {

    ENDPOINT: ENDPOINT,
    
    STATUS_RESOURCE: ENDPOINT + 'api/status/',
    
    LOGIN_RESOURCE: ENDPOINT + 'api/login',
    LOGOUT_RESOURCE: ENDPOINT + 'api/logout',
    
    USER_RESOURCE: ENDPOINT + 'api/users/',
    
    GRAPHS_RESOURCE: ENDPOINT + 'api/graphs/',
    
    IMAGES_RESOURCE: ENDPOINT + 'api/users/self/images/',
    
    CLASSES_RESOURCE: ENDPOINT + 'api/classes/',

    USER_GRAPHS_RESOURCE: ENDPOINT + 'api/users/self/graphs/',
    USER_GRAPH_RESOURCE: ENDPOINT + 'api/users/self/graphs/%graph_id%',

    USER_CLASSES_RESOURCE: ENDPOINT + 'api/users/self/classes/',

    USER_SUBJECTS_RESOURCE: ENDPOINT + 'api/users/self/subjects/?filter=%class_id%',

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