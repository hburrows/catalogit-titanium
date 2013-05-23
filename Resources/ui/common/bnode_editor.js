/*
 * 
 */

module.exports = function (win, propertyId, classId, data) {

  "use strict";

  // fixup arguments
  data = data || {};

  var GLOBALS = require('globals'),
      createHTTPClient = require('lib/http_client_wrapper'),
      createSheetView = require('ui/common/sheet_view'),
      editorFactory = require('ui/common/property_editor_factory'),

      sheetView = createSheetView(win),
      sheetRect = sheetView.root.getRect(),
      containerWidth = sheetRect.width;

  function renderObjectPropertyFields(groups) {

    var outIdx, outMax,
        inIdx, inMax,
        group,
        properties, property,
        sections = [],
        rowView, containerView, labelView;

    for (outIdx = 0, outMax = groups.length; outIdx < outMax; outIdx += 1) {
      
      group = groups[outIdx];
      Ti.API.info(group.name);

      properties = group.properties;

      // skip if there are no properties and not the last group.  The
      // last groups needs to be present to hold the 'add more properties'
      // control
      if (properties.length === 0 && outIdx < (outMax - 1)) {
        continue;
      }

      var sectionView = Ti.UI.createTableViewSection({
        headerTitle: group.name
      });

      for (inIdx = 0, inMax = properties.length; inIdx < inMax; inIdx += 1) {
        
        property = properties[inIdx];
        Ti.API.info('  ' + property.label + '(' + property.comment + ')');

        var predObj = data[property.property],
            view; 

        rowView = Ti.UI.createTableViewRow({
          className: 'bnodePropertyRow',
          _cit_properties: property
        });
  
        containerView = Ti.UI.createView({
          left: 10, top: 10, right: 10, bottom:5,
          height: Ti.UI.SIZE, width: Ti.UI.FILL,
          layout: 'vertical'
        });
        rowView.add(containerView);

        labelView = Ti.UI.createLabel({
          left: 0, top: 0,
          width: Ti.UI.FILL, height: Ti.UI.SIZE,
          text: property.label
        });
        containerView.add(labelView);

        var editorView = editorFactory.createEditorForProperty(property, predObj);
        if (editorView) {
          containerView.add(editorView);
        }

        sectionView.add(rowView);
      }
      
      sections.push(sectionView);
    }

    //
    // ADD MORE - insert an "add more" item in the last section
    //
    rowView = Ti.UI.createTableViewRow({
      bottom: 10,
      className: 'propertyRow',
      layout: 'vertical'
    });
  
    containerView = Ti.UI.createView({
      left: 10, top: 10, right: 10,
      height: Ti.UI.SIZE, width: Ti.UI.FILL,
      layout: 'vertical'
    });
    rowView.add(containerView);
  
    labelView = Ti.UI.createLabel({
      left: 0, top: 0, bottom: 0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      text: 'Add Other Property'
    });
    containerView.add(labelView);
  
    sections[sections.length-1].add(rowView);

    containerView = Ti.UI.createView({
      left: 10, top: 10, right: 10, bottom: 10,
      borderWidth: 1, borderColor: '#000', borderRadius: 5     
    });
    sheetView.root.add(containerView);

    var tableView = Ti.UI.createTableView({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      scrollable: true,
      data: sections      
    });
    containerView.add(tableView);

    return;
  }

  var xhr = createHTTPClient({
    // function called when the response data is available
    onload : function(e) {
      renderObjectPropertyFields(JSON.parse(this.responseText));
    }
  });
  xhr.open('GET', GLOBALS.api.CLASSES_RESOURCE + classId + '/');
  xhr.send('');
  
  sheetView.root.addEventListener('opened', function () {
    Ti.API.info('opened');
    var leftNav = win.getLeftNavButton(),
        rightNav = win.getRightNavButton();

    if (leftNav) {
      leftNav.setEnabled(false);
    }
    if (rightNav) {
      rightNav.setEnabled(false);
    }
  });

  sheetView.root.addEventListener('closed', function () {
    Ti.API.info('closed');
    var leftNav = win.getLeftNavButton(),
        rightNav = win.getRightNavButton();

    if (leftNav) {
      leftNav.setEnabled(true);
    }
    if (rightNav) {
      rightNav.setEnabled(true);
    }
  });

  return sheetView;
}
