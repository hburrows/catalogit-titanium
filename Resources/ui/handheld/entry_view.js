/*
 * 
 */

var _ = require('vendor/underscore');
var Backbone = require('vendor/backbone');
var EntryModel = require('lib/entry_model');
var GLOBALS = require('globals');
var createHTTPClient = require('lib/http_client_wrapper');

module.exports = function (entryId, photoMedia) {

  "use strict";

  var entryModel = null,
      controller = null,
      pendingMedia = null;

  var self = Titanium.UI.createWindow({
    backgroundColor: '#eee',
    title: entryId === null ? 'Create Entry' : 'Entry',
    barColor: GLOBALS.ui.titleBarColor,
    orientationModes: [
      Ti.UI.PORTRAIT,
      Ti.UI.LANDSCAPE_LEFT,
      Ti.UI.LANDSCAPE_RIGHT
    ]
  });

  // WELL-KNOWN VIEWS
  var mediaInfoView,
      propertiesView,
      cancelButton,
      backButton,
      editButton,
      doneButton;


  // WINDOW ACTIVITY INDICATOR
  //
  //  make sure the activity indicator is the first view so its position is well know
  //
  var activityIndicator = Ti.UI.createActivityIndicator({
    color: '#000',
    font: {
      fontSize:16,
      fontWeight:'bold'
    },
    message: 'Loading...',
    style: Ti.UI.iPhone.ActivityIndicatorStyle.DARK,
    center: '50%', bottom: '10%',
    height:Ti.UI.SIZE,
    width:Ti.UI.SIZE
  }); 
  self.add(activityIndicator);

  function mediaUploaded(e) {

    if (entryModel) {
      entryModel.subsumeMedia(e.id, e.data, e.schema);
    }
    else {
      pendingMedia = {id: e.id, data: e.data, schema: e.schema};
    }
  }

  // listen for media uploads when the window opens
  self.addEventListener('open', function () {
    Ti.App.addEventListener('media:uploaded', mediaUploaded);
  });

  // stop listening for media uploads when the window closes
  self.addEventListener('close', function () {
    Ti.App.removeEventListener('media:uploaded', mediaUploaded);
  });

  // BACK - NAV BAR BUTTON
  //  back to previous view -- typically a list view
  backButton = Titanium.UI.createButton({
    title: 'Back',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  if (entryId !== null) {
    self.setLeftNavButton(backButton);
  }

  backButton.addEventListener('click', function () {
    self.close();
  });

  // CANCEL - NAV BAR BUTTON
  //  cancel the creation or association flow
  cancelButton = Titanium.UI.createButton({
    title:'Cancel',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  if (entryId === null) {
    self.setLeftNavButton(cancelButton);
  }

  cancelButton.addEventListener('click', function () {
    self.close();
  });

  // DONE - NAV BAR BUTTON
  //  done with the creation or assocation flow
  doneButton = Titanium.UI.createButton({
    title:'Done',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  //self.setRightNavButton(doneButton);
  
  doneButton.addEventListener('click', function (e) {

    if (GLOBALS.uploadPending) {
      alert("Media still uploading.  Try again!");
      return;      
    }

    controller.updateModelFromForm();

    var options = {
      success: function (action, response) {
        if (action === 'create') {
          Ti.App.fireEvent('entry:created', {data: response});
        }
        else {
          Ti.App.fireEvent('entry:updated', {data: response});
        }
        self.close();  
      },
      error: function () {
        alert("error creating/saving entry");
      }
    };

    if (entryModel.id === null) {
      // create
      entryModel.createEntry(options);
    }
    else {
      // update
      entryModel.updateEntry(options);
    }
    
  });

  // EDIT - NAV BAR BUTTON
  //  edit an existing resource
  editButton = Titanium.UI.createButton({
    title:'Edit',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  if (entryId !== null) {
    self.setRightNavButton(editButton);
  }
  
  editButton.addEventListener('click', function (e) {
    //switch to edit mode
    return;
  });



  //
  // -- Constants, shared declarations 
  //
  var padding = 10;
  var PADDING = 10;
  var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;

  //
  // -- CONTAINER VIEW
  //
  
  function getContainerWidth() {
    return Ti.Platform.displayCaps.platformWidth - (PADDING * 2);    
  }

  //
  // SCROLL VIEW
  //
  var scrollView = Ti.UI.createScrollView({
    contentHeight: 'auto',
    scrollType: 'vertical',
    height: '100%',
    width: '100%'
  });
  self.add(scrollView);

  var containerView = Titanium.UI.createView({
    left: PADDING, top: PADDING, right: PADDING,
    height: Ti.UI.SIZE,
    layout: 'vertical'
  });
  scrollView.add(containerView);

  //
  // -- MEDIA INFO VIEW
  //
  var mediaInfoViewTop = 0,
      mediaInfoHeight = 80;
  mediaInfoView = Titanium.UI.createView({
    //left: 0,
    //top: mediaInfoViewTop,
    left: 0, top: 0,
    width: Ti.UI.FILL, height: mediaInfoHeight
  });
  containerView.add(mediaInfoView);
  
  var photoContainer = Titanium.UI.createView({
    top: 0,
    left: 0,
    height: mediaInfoHeight,
    width: mediaInfoHeight
    //borderWidth: 1, borderColor: '#000'
  });
  mediaInfoView.add(photoContainer);

  var photoView = Titanium.UI.createImageView({
    image: photoMedia
  });
  photoContainer.add(photoView);

  var tableData = [ {title: 'Date:'}, {title: 'Location:'} ];

  var mediaInfoPropertiesView = Titanium.UI.createTableView({
    className: 'generalProperties', // used to improve table performance
    font: {
      fontFamily: 'Arial',
      fontSize: defaultFontSize
    },
    data: tableData,   
    top: 0,
    left: mediaInfoHeight + padding,
    width: Titanium.UI.FILL,
    height: Titanium.UI.FILL
  });
  //mediaInfoView.add(mediaInfoPropertiesView);

  //
  // PROPERTIES VIEW CONTAINER
  //
  // this is the container that holds info about properties and is for
  // both editing and viewing
  propertiesView = Titanium.UI.createView({
    left: 0, top: PADDING,
    width: Titanium.UI.FILL, height: Titanium.UI.SIZE
  });
  containerView.add(propertiesView);

  var classPickerBackRendered = false;

  function makeClassPickerMoreRow(name, description, id) {

    var row = Ti.UI.createTableViewRow({
      left: 10, top:0, right: 10,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      rowId: id,
      className: 'classDetailRow',
      //selectedBackgroundColor = '#333',
      clickName: 'row'
    });
    
    var rowView = Ti.UI.createView({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      layout: 'vertical',
      backgroundColor: '#fff'
    });
    row.add(rowView);

    var nameView = Ti.UI.createLabel({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      color: '#000',
      font:{fontSize:16,fontFamily:'Helvetica Neue'},
      clickName: 'user',
      text: name
    });
    rowView.add(nameView); 

    var descriptionView = Ti.UI.createLabel({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      color: '#000',
      font:{fontSize:14,fontFamily:'Helvetica Neue'},
      clickName: 'user',
      text: description
    });
    rowView.add(descriptionView); 

    return row;
  }

  function showClassPickerBack(picker) {

    if (classPickerBackRendered) {
      return;
    }

    // check if the service is responding
    var xhr = createHTTPClient({

      // function called when the response data is available
      onload : function(e) {

        var response = JSON.parse(this.responseText); 

        var max,
            idx,
            itemsPerRow = 3,
            classes = [];

        activityIndicator.hide();

        var back = Ti.UI.createButton({
          height: 44,
          width: '50%',
          title: 'Back',
          top: 20, center: '50%'
        });
        picker.backView.add(back);
      
        back.addEventListener('click', function () {
          picker.flip();      
        });
    
        var tableView = Titanium.UI.createTableView({
          top: 70,
          width: Ti.UI.FILL,
          separatorColor: 'transparent',
          backgroundColor: 'transparent'
        });
        picker.backView.add(tableView);

        for (idx = 0, max = response.length; idx < max; idx += 1) {
          classes.push(makeClassPickerMoreRow(response[idx].name, response[idx].comment, response[idx].id));
        }
 
        tableView.setData(classes);

        tableView.addEventListener('click', function(e) {
          var id = e.rowData.id;
          alert(id);
      
        });

      },

      onerror: function (e) {
        activityIndicator.hide();
        this._cit_handle_error(e);
      },

      timeout: 30000

    });

    xhr.open('GET', GLOBALS.api.USER_CLASSES_RESOURCE);
    xhr.send('');

    return;    
  }

  function showClassPicker() {

      activityIndicator.show();

      // check if the service is responding
      var xhr = createHTTPClient({

        // function called when the response data is available
        onload : function(e) {

          var response = JSON.parse(this.responseText); 

          var max,
              idx,
              itemsPerRow = 3,
              classes = [];

          for (idx = 0, max = response.length; idx < max; idx += 1) {
            classes.push({'title': response[idx].name, 'id': response[idx].id});
          }

          activityIndicator.hide();

          var createPickerView = require('/ui/common/palette_picker');
          var picker = createPickerView(self, self, 'class', classes);

          picker.show();

          picker.frontView.addEventListener('flipToBack', function () {
            showClassPickerBack(picker);
          });

        },

        onerror: function (e) {
          activityIndicator.hide();
          this._cit_handle_error(e);
        },

        timeout: 30000

      });

      xhr.open('GET', GLOBALS.api.USER_CLASSES_RESOURCE);
      xhr.send('');

      return;    
  }
  
  function clearPropertiesView() {
    
    // clear existing contents of propertiesView
    var children = propertiesView.children,
        idx, max;

    for (idx = 0, max = children.length; idx < max; idx += 1) {
      propertiesView.remove(children[idx]);
    }

  }

  function renderEdit(entryModel) {

    clearPropertiesView();

    // set the image if present
    var thumbnail = entryModel.getThumbnail();
    if (thumbnail) {
      photoView.setImage(thumbnail);
    }

    var createPropertiesEditor = require('ui/common/properties_edit');
    
    controller = createPropertiesEditor(self, entryModel);

    propertiesView.add(controller.view);

    self.setRightNavButton(doneButton);
  }
  
  function renderView(entryModel) {
    
    clearPropertiesView();

    // set the image
    photoView.setImage(entryModel.getThumbnail());

    var createPropertiesViewer = require('ui/common/properties_view');
    
    controller = createPropertiesViewer(self, entryModel);

    propertiesView.add(controller.view);

    self.setRightNavButton(editButton);
  }

  function renderSelect() {
    
    clearPropertiesView();

    // ??? is there a better work flow
    showClassPicker();
  }

  //
  // USER DEFINED EVENT LISTENERS
  //

  // NEW CLASS
  //  listen for OWL class selection
  self.addEventListener('class:select', function (selectEvt) {

    activityIndicator.show();
 
    // check if the service is responding
    var xhr = createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {

        var response = JSON.parse(this.responseText);

        activityIndicator.hide();

        if (entryModel) {
          Ti.API.info('Change existing entry class');
          entryModel.setSchema(response);
          renderEdit(entryModel);
          return;
        }
    
        entryModel = new EntryModel({
          schema: response
        });

       if (pendingMedia) {
          // discard or abort request
          entryModel.subsumeMedia(pendingMedia.id, pendingMedia.data, pendingMedia.schema);
          pendingMedia = null;
        }

        renderEdit(entryModel);
       },
      
      onerror: function (e) {
        activityIndicator.hide();
        this._cit_handle_error(e);
      },
      
      timeout: 30000

    });

    xhr.open('GET', GLOBALS.api.CLASSES_RESOURCE + selectEvt.id + '/');
    xhr.send('');
    
  });

  self.addEventListener('class:change', function (selectEvt) {
    showClassPicker();
    return;
  });

  // EXISTING RESOURCE 
  //  listen for existing resource selection
  self.addEventListener('resource:select', function (selectEvt) {
    alert('existing item selected');
  });    


  //
  //  final setup and configuration
  //
  if (entryId === null) {
    renderSelect();
  }
  else {

      //
      // fetch the JSON definition of the entry from the server
      //
      activityIndicator.show();

      // check if the service is responding
      var xhr = createHTTPClient({

        // function called when the response data is available
        onload : function(e) {

          var response = JSON.parse(this.responseText); 

          activityIndicator.hide();

          // sanity check on id
          if (response.id !== entryId) {
            throw "INTERNAL ERROR - assertion failed";
          }

          entryModel = new EntryModel({
            id: response.id,
            data: response.data,
            schema: response.schema
          });

          if (pendingMedia) {
            // discard or cancel request
            //
            pendingMedia = null;
          }

          // update the entry image
          
          //renderView(entryModel);
          renderEdit(entryModel);

        },

        onerror: function (e) {
          activityIndicator.hide();
          this._cit_handle_error(e);
        },

        timeout : 30000  // in milliseconds

      });

      xhr.open('GET', GLOBALS.api.ENTRY_RESOURCE.replace('%entry_id%', entryId));
      xhr.send('');
  }

  return self;
}
