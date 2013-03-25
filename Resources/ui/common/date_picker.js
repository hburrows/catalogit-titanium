/*
 * 
 */

module.exports = function (win, owner, startDate, endDate, nowDate) {

  "use strict";

  var createSheetView = require('ui/common/sheet_view'),
      sheetView = createSheetView(win, owner, 'datepicker');

  var pickerView = Ti.UI.createPicker({
    left: 0, top: 0,
    width: Ti.UI.FILL,
    type: Ti.UI.PICKER_TYPE_DATE,
    minDate: startDate,
    maxDate: endDate,
    value: nowDate,
    selectionIndicator: true
  });

  sheetView.container.add(pickerView);

  pickerView.addEventListener('change', function(e){
    Ti.API.info("User selected date: " + e.value.toLocaleString());
  });

  return sheetView;
}
