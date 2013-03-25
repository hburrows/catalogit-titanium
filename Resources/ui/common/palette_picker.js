/*
 * 
 */

module.exports = function (win, owner, typeId, labels) {

  "use strict";

  var createSheetView = require('ui/common/sheet_view'),
      sheetView = createSheetView(win, owner, typeId);

  //
  // GRID SETUP
  //
  var gridData = [],
      outIdx, outMax,
      inIdx, inMax,
      padding = 10,
      width = Math.round((sheetView.containerWidth - (padding * 4)) / 3);

  var maxRows = 3,
      maxCells = 8,
      cell,
      label;

  for (outIdx = 0, outMax = maxRows; outIdx < outMax; outIdx += 1) {

    var row = Ti.UI.createTableViewRow({
      className: 'gridRow', // used to improve table performance
      selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        rowIndex: outIdx // custom property, useful for determining the row during events
    });

    for (inIdx = 0, inMax = 3; inIdx < inMax; inIdx += 1) {

      var left = inIdx * (padding + width) + padding;

      var idx = (outIdx * maxRows) + inIdx;

      cell = Ti.UI.createView({
        backgroundColor:'#666',
        top: padding,
        left: left,
        height: width,
        width: width,
        borderRadius:6
      });
      row.add(cell);

      if ((outIdx * maxRows) + inIdx < maxCells) {
        
        cell._cit_id = labels[idx].id;

        label = Ti.UI.createLabel({
          color:'#fff',
          font:{font:'Avenir',fontSize:14,fontWeight:'bold'},
          text: labels[idx].title,
          touchEnabled:false,
          textAlign:'TEXT_ALIGNMENT_CENTER'
        });
        cell.add(label);
      }
    }

    gridData.push(row);
  }

  var tableView = Ti.UI.createTableView({
    data: gridData,
    scrollable: false,
    separatorColor: 'transparent',
    backgroundColor: 'transparent',
    top: 0, height: Ti.UI.SIZE
  });
  sheetView.container.add(tableView);

  tableView.addEventListener('click', function(e) {
    if (e.source._cit_id) {
      sheetView.hide();
      var name = e.source.children[0].getText();
      win.fireEvent(typeId + ':select', {'name': name, 'id': e.source._cit_id});
    }
  });

  return sheetView;
}
