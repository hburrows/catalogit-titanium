/*
 * 
 */

module.exports = function (win, propertyId, classFilter) {

  "use strict";

  var GLOBALS = require('globals'),
      createSheetView = require('ui/common/sheet_view'),
      createHTTPClient = require('lib/http_client_wrapper'),
      sheetView = createSheetView(win),
      sheetRect = sheetView.root.getRect(),
      containerWidth = sheetRect.width;

  function createSubjectRow(id, title, description) {

    var row = Ti.UI.createTableViewRow({
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      rowId: id,
      className: 'subjectRow'
    });
    
    var rowView = Ti.UI.createView({
      left: 10, right: 10,
      top:10, bottom: 0, 
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      layout: 'vertical',
      backgroundColor: '#fff'
    });
    row.add(rowView);

    var titleView = Ti.UI.createLabel({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      color: '#000',
      font:{
        fontSize:16,
        fontWeight:'bold',
        fontFamily:'Helvetica Neue'},
      text: title
    });
    rowView.add(titleView); 

    if (description) {
      var descriptionView = Ti.UI.createLabel({
        left: 0, top: 0,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        color: '#000',
        font:{
          fontSize:14,
          fontFamily:'Helvetica Neue'},
        text: description
      });
      rowView.add(descriptionView); 
    }

    return row;    
  }

  function renderSubjectTable(response) {

    var max, idx,
        classes = [];
    
    var tableView = Titanium.UI.createTableView({
      left: 10, top: 10, right: 10, bottom: 10,
      separatorColor: 'transparent',
      backgroundColor: 'transparent',
      borderColor: '#000', borderWidth: 1
    });
    sheetView.frontView.add(tableView);

    // build the classes list and add to table
    for (idx = 0, max = response.length; idx < max; idx += 1) {
      classes.push(createSubjectRow(response[idx].id, response[idx].data.title, response[idx].data.description));
    } 
    tableView.setData(classes);

    // setup event listener
    tableView.addEventListener('click', function(e) {
      var id = e.rowData.rowId;
      sheetView.hide();
      sheetView.root.fireEvent('subject:select', {property: propertyId, id: e.rowData.rowId});
    });
    
  }

  var xhr = createHTTPClient({

    // function called when the response data is available
    onload : function(e) {
      var response = JSON.parse(this.responseText);
      renderSubjectTable(response);
    }

  });

  xhr.open('GET', GLOBALS.api.USER_SUBJECTS_RESOURCE.replace('%class_id%', classFilter));
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
