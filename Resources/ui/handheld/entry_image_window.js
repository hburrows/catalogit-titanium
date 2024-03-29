/**
 * @author Howard Burrows
 */

module.exports = function(entryId, entryList) {

  "use strict";

  var GLOBALS = require('globals'),
      EntryModel = require('lib/entry_model'),
      createHTTPClient = require('lib/http_client_wrapper'),
      self,
      entryModel;

  self = Titanium.UI.createWindow({
    backgroundColor: '#fff',
    title: 'Entry',
    barColor: GLOBALS.ui.titleBarColor,
    orientationModes: [
      Ti.UI.PORTRAIT,
      Ti.UI.LANDSCAPE_LEFT,
      Ti.UI.LANDSCAPE_RIGHT
    ]
  });

  // BACK - NAV BAR BUTTON
  var backButton = Titanium.UI.createButton({
    title: 'View All',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  self.setLeftNavButton(backButton);

  backButton.addEventListener('click', function () {
    self.close();
  });

  // EDIT - NAV BAR BUTTON

  var editButton = Titanium.UI.createButton({
    title: 'Edit',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  self.setRightNavButton(editButton);

  editButton.addEventListener('click', function () {
    var createEntryView = require('ui/handheld/entry_view'),
        entryWindow = createEntryView(entryId, null);
    self.containingTab.open(entryWindow);    

  });

  // WINDOW ACTIVITY INDICATOR
  //
  //  make sure the activity indicator is the first view so its position is well know
  //
  var activityIndicator = Ti.UI.createActivityIndicator({
    width:Ti.UI.SIZE, height:Ti.UI.SIZE,
    center: '50%', bottom: '10%',
    color: '#000',
    font: {
      fontSize:16,
      fontWeight:'bold'
    },
    message: 'Loading...',
    style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK
  }); 
  self.add(activityIndicator);

  var containerView = Ti.UI.createView({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.FILL    
  });
  self.add(containerView);

  function renderEntry(entryModel) {
    
    var title = entryModel.getProperty('http://purl.org/dc/elements/1.1/title'),
        description = entryModel.getProperty('http://purl.org/dc/elements/1.1/description');

    containerView.removeAllChildren();

    var imageView = Ti.UI.createImageView({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.FILL,
      image: entryModel.getOriginal()
    });
    containerView.add(imageView);

    var captionView = Ti.UI.createView({
      left: 10, bottom: 10,
      right: 10, height: Ti.UI.SIZE,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderWidth: 1, borderRadius: 15, borderColor: '#eee',
      layout: 'vertical'
    });
    containerView.add(captionView);
    
    var typeView = Ti.UI.createLabel({
      left: 10, top: 10, right: 10, bottom: 10,
      height: Ti.UI.SIZE,
      text: entryModel.getClass().name,
      color: '#fff',
      font:{fontWeight:'bold', fontSize: GLOBALS.LARGE_FONT_SIZE}
    });
    captionView.add(typeView);

    if (title) {
      var titleView = Ti.UI.createLabel({
        left: 10, top: 0, right: 10, bottom: 10,
        height: Ti.UI.SIZE,
        text: title,
        color: '#fff',
        font:{fontSize: GLOBALS.LARGE_FONT_SIZE}
      });
      captionView.add(titleView);
    }

    if (description) {
      var descriptionView = Ti.UI.createLabel({
        left: 10, top: 0, right: 10, bottom: 10,
        height: Ti.UI.SIZE,
        text: description,
        color: '#fff',
        font:{fontSize: GLOBALS.MEDIUM_FONT_SIZE}
      });
      captionView.add(descriptionView);
    }

    return;    
  }

  function load(loadEntryId) {

    activityIndicator.show();
  
    var xhr = createHTTPClient({
  
      // function called when the response data is available
      onload : function(e) {
  
        var response = JSON.parse(this.responseText); 
  
        activityIndicator.hide();
  
        // sanity check on id
        if (response.id !== loadEntryId) {
          throw "INTERNAL ERROR - assertion failed";
        }
  
        entryModel = new EntryModel({
          id: response.id,
          data: response.data,
          schema: response.schema
        });
  
        renderEntry(entryModel);
        entryId = loadEntryId;
      },
  
      onerror: function (e) {
        activityIndicator.hide();
        this._cit_handle_error(e);
      },
  
      timeout : 30000  // in milliseconds
  
    });
  
    xhr.open('GET', GLOBALS.api.ENTRY_RESOURCE.replace('%entry_id%', loadEntryId));
    xhr.send('');
  }

  // listen for event updates
  Ti.App.addEventListener('entry:updated', function (e) {

    var data = e.data;

    if (data.id === entryModel.id) {
      entryModel = new EntryModel({
        id: data.id,
        data: data.data,
        schema: data.schema
      });
      renderEntry(entryModel);      
    }
  });

  // listen for swipe events
  containerView.addEventListener('swipe', function(e){

    var model = entryList.get(entryId),
        idx = entryList.indexOf(model);

    if (e.direction === 'left') {
      // get the next
      if (idx < entryList.length - 1) {
        idx += 1;
      }
      else {
        return;
      }
    }
    else 
    if (e.direction === 'right') {
      // get the previous
      if (idx > 0) {
        idx -= 1;
      }
      else {
        return;
      }
    }
    else {
      // ignore any other swipes
      return;
    }

    var nextEntry = entryList.at(idx);
    load(nextEntry.id);

  });
  
  load(entryId);

  return self;

};
