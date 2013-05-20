/*
 * 
 */

module.exports = function (win, owner, typeId, labels) {

  "use strict";

  var createSheetView = require('ui/common/sheet_view'),
      sheetView = createSheetView(win /*, owner, typeId*/),
      sheetRect = sheetView.root.getRect(),
      containerWidth = sheetRect.width;
    
  //
  // GRID SETUP
  //
  var gridData = [],
      outIdx, outMax,
      inIdx, inMax,
      padding = 10,
      width = Math.round((sheetView.rootWidth - (padding * 4)) / 3),
      maxCols = 3,
      maxRows,
      maxCells,
      cell,
      label;

  // Determine how many rows will fit in the container's height with approximate padding and
  // adjust cell height to vertical padding is consistent and near horizontal padding
  var exactRows = (sheetView.rootHeight - padding) / (width + padding);
  
  maxRows = Math.floor(exactRows);
  maxCells = (maxRows * maxCols) - 1;

  var contentHeight = sheetView.rootHeight - (maxRows * width) - (padding * maxRows + 1);
  
  var adjustmentHeight = Math.floor(contentHeight / maxRows);

  var height = width + adjustmentHeight;

  var vPadding = Math.floor((sheetView.rootHeight - (height * maxRows)) / (maxRows + 1));

  function createCell(left) {
    var cell = Ti.UI.createView({
      backgroundColor:'#666',
      top: vPadding,
      left: left,
      height: height,
      width: width,
      borderRadius:6
    });
    return cell;
  }

  function createLabel(labelText) {
    var labelView = Ti.UI.createLabel({
      width: Ti.UI.SIZE, height: Ti.UI.SIZE,
      color: '#fff',
      font: {font:'Avenir',fontSize:12,fontWeight:'bold'},
      text: labelText,
      touchEnabled: false,
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    });
    return labelView;
  }
    
  for (outIdx = 0; outIdx < maxRows; outIdx += 1) {

    var row = Ti.UI.createTableViewRow({
      className: 'gridRow', // used to improve table performance
      selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        rowIndex: outIdx // custom property, useful for determining the row during events
    });

    for (inIdx = 0, inMax = 3; inIdx < inMax; inIdx += 1) {

      var left = inIdx * (padding + width) + padding,
          idx = (outIdx * maxCols) + inIdx;

      cell = createCell(left);

      row.add(cell);

      if (idx < maxCells && idx < labels.length) {
        
        cell._cit_id = labels[idx].id;

        cell.add(createLabel(labels[idx].title));
      }
    }

    gridData.push(row);
  }

  // Add "More..." if more labels exist than the palette can display
  //
  if (labels.length >= (maxCols * maxRows)) {
    // Add the 'More...' label to the last cell
    var lastRow = gridData[gridData.length-1];
    var lastCell = lastRow.children[lastRow.children.length-1];
    lastCell.add(createLabel('More...'));
  }

  var tableView = Ti.UI.createTableView({
    data: gridData,
    scrollable: false,
    separatorColor: 'transparent',
    backgroundColor: 'transparent',
    top: 0, height: Ti.UI.SIZE
  });
  sheetView.root.add(tableView);

  tableView.addEventListener('click', function(e) {
    if (e.source._cit_id) {
      sheetView.hide();
      var name = e.source.children[0].getText();
      win.fireEvent(typeId + ':select', {'name': name, 'id': e.source._cit_id});
    }
    else {
      // if it doesn't have a _cit_id property and has no children is must be the "More..." button
      if (e.source.children.length > 0) {
        sheetView.flip();
      }
    }
  });

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
