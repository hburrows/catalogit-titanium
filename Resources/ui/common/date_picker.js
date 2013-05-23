/*
 * 
 */

module.exports = function (win, propertyId, startDate, endDate, nowDate) {

  "use strict";

  var createSheetView = require('ui/common/sheet_view'),
      sheetView = createSheetView(win);

  var pickerView = Ti.UI.createPicker({
    left: 0, top: 0,
    width: Ti.UI.FILL,
    type: Ti.UI.PICKER_TYPE_DATE,
    minDate: startDate,
    maxDate: endDate,
    value: nowDate,
    selectionIndicator: true
  });

  sheetView.root.add(pickerView);

  pickerView.addEventListener('change', function(e){
    Ti.API.info("User selected date: " + e.value.toLocaleString());
  });

  // BEGIN throw-away
  var button = Ti.UI.createButton({
    width: '50%', height: 44,
    bottom: 20, center: '50%',
    title: 'Save'
  });
  sheetView.root.add(button);

  button.addEventListener('click', function () {
    sheetView.root.fireEvent('datetime:update', {property: propertyId, value: Math.round(pickerView.getValue().getTime()/1000)});    
    sheetView.hide();
  });
  // END throw-away

  return sheetView;
}
