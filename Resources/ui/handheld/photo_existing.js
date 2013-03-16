module.exports = function (success, error) {

  "use strict";

  var GLOBALS = require('globals');

  Ti.Media.openPhotoGallery({

    allowEditing: false,
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    animated: true,

    success:function(event) {

      GLOBALS.currentMedia = event.media;
      GLOBALS.currentMediaType = 'photo';
      GLOBALS.currentMediaId = null;

      Ti.App.fireEvent('photo:edit');

      // upload the photo.  we can't do anything with the photo regarding using it
      // to create a new entry until it's successfully updated.  The "signal" for 
      // successful update is a non-null currentMediaId
      var createHTTPClient = require('lib/http_client_wrapper');
       
      var xhr = createHTTPClient({
        
        // function called when the response data is available
        onload : function(e) {
          var response = JSON.parse(this.responseText); 
          GLOBALS.currentMediaId = response.id;
        },
  
        timeout : 30000  // in milliseconds

      });
  
      xhr.open('POST', GLOBALS.api.IMAGES_RESOURCE);
      xhr.send({image: event.media, cropRect: null});  
    },

    error:function(error) {
      alert(error);
    }    

  });

}
