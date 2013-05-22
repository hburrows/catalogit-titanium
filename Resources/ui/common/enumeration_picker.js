/*
 * 
 */

module.exports = function (win, propertyId, values) {

  "use strict";

  var createSheetView = require('ui/common/sheet_view'),
      sheetView = createSheetView(win),
      sheetRect = sheetView.root.getRect(),
      containerWidth = sheetRect.width;

  function createValueRow(value) {

    var row = Ti.UI.createTableViewRow({
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      className: 'valueRow'
    });
    
    var titleView = Ti.UI.createLabel({
      left: 10, right: 10,
      top:10, bottom: 0, 
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      color: '#000',
      font:{
        fontSize:16,
        fontWeight:'bold',
        fontFamily:'Helvetica Neue'},
      text: value
    });
    row.add(titleView); 

    return row;    
  }

  function renderValuesTable(values) {

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
    for (idx = 0, max = values.length; idx < max; idx += 1) {
      classes.push(createValueRow(values[idx]));
    } 
    tableView.setData(classes);

    // setup event listener
    tableView.addEventListener('click', function(e) {
      var labelView = e.rowData.children[0];
      sheetView.hide();
      sheetView.root.fireEvent('enumeration:select', {property: propertyId, value: labelView.text});
    });    
  }

  renderValuesTable(values);

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
