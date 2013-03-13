module.exports = function (success, error) {

  "use strict";

  Ti.Media.openPhotoGallery({

    allowEditing: false,
    mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO],
    animated: true,

    success:function(event) {

      var _globals = require('globals')
      _globals.currentMedia = event.media;

      Ti.App.fireEvent('photo:edit', {
        'media': event.media,
        'mediaType': event.mediaType,
        'cropRect': event.cropRect
      });

      return;
/*
      // create a jotclient object; create a new entry and attach a photo to it
      var jotClient = require('utils/jotclient');
      var client = jotClient();

      client.createEntry({

        entry_type: "photo",
        attributes: {},

        // create activity success
        success: function(response,xhrResult) {

          Ti.App.fireEvent('EntryUpdated');             

          var entry_id = response.id;

          client.uploadImage({

            entry_id: entry_id,
            media: event.media,
            mediaType: event.mediaType,
            cropRect: event.cropRect,
      
            // upload image success
            success: function(response,xhrResult) {
              Ti.App.fireEvent('EntryUpdated');
              Ti.App.fireEvent('EntryCreated', {'entry_id': entry_id});
            },
            error: function(response, xhrResult) {
              Ti.UI.createAlertDialog({
                    title:'Upload Error',
                    message:'status code: ' + xhrResult.status + ', message: ' + response
              }).show();                    
            }
    
          });

        },

        error: function(response, xhrResult) {
          Ti.UI.createAlertDialog({
                title:'Create Activity Error',
                message:'status code: ' + xhrResult.status + ', message: ' + response
          }).show();                    
        }

      });
*/
    },

    error:function(error) {
      alert(error);
    }    

  });

}