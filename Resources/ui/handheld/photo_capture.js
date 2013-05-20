/*
 * 
 */

module.exports = function (success, error) {

  "use strict";

  var GLOBALS = require('globals');

  Ti.Media.showCamera({

//    allowEditing: true,
//    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]

    //saveToPhotoGallery:true,
    //overlay:overlay,
  
    success:function(event) {
  
      GLOBALS.currentMedia = event.media;
      GLOBALS.currentMediaType = 'photo';
      
      Ti.App.fireEvent('photo:new', {media: event.media, type: 'photo'});

      // upload the photo.  we can't do anything with the photo regarding using it
      // to create a new entry until it's successfully updated.

      var xhr = Ti.Network.createHTTPClient({
        
        // function called when the response data is available
        onload : function(e) {
          
          var response = JSON.parse(this.responseText); 

          GLOBALS.uploadPending = false;
          GLOBALS.uploadXHR = null;

          Ti.App.fireEvent('media:uploaded', response);
        },
  
        onerror: function (e) {
          GLOBALS.uploadPending = false;
          GLOBALS.uploadXHR = null;
          this._cit_handle_error(e);
        },

        timeout : 60000  // in milliseconds

      });
  
      GLOBALS.uploadPending = true;
      GLOBALS.uploadXHR = xhr;

      xhr.open('POST', GLOBALS.api.IMAGES_RESOURCE);
      xhr.send({image: event.media, cropRect: null});  

      return;
    },

    error:function(error) {
      //win.close();
      alert(error);
    }
  });
}
