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
  
      var globals = require('globals');
      globals.currentMedia = event.media;
      GLOBALS.currentMediaType = 'photo';
      GLOBALS.currentMediaId = null;
      
      Ti.App.fireEvent('photo:edit');

      // upload the photo.  we can't do anything with the photo regarding using it
      // to create a new entry until it's successfully updated.  The "signal" for 
      // successful update is a non-null currentMediaId
      var xhr = Ti.Network.createHTTPClient({
        
        // function called when the response data is available
        onload : function(e) {
          var response = JSON.parse(this.responseText); 
          GLOBALS.currentMediaId = response.id;
        },
  
        // function called when an error occurs, including a timeout
        onerror : function(e) {
          Ti.API.debug(this.status + ': ' + this.error);
          if (!this.connected && this.status === 0) {
            alert(e.error);
          }
          else {
            alert(this.responseText);
          }
        },
  
        timeout : 30000  // in milliseconds

      });
  
      xhr.open('POST', GLOBALS.api.IMAGES_RESOURCE);
      xhr.send({image: event.media,
                cropRect: null});  

      return;
    },

    error:function(error) {
      //win.close();
      alert(error);
    }
  });
}
