/*
 * 
 */

module.exports = function (win, propertyId, classId, data) {

  "use strict";

  var createSheetView = require('ui/common/sheet_view'),
      sheetView = createSheetView(win),
      sheetRect = sheetView.root.getRect(),
      containerWidth = sheetRect.width;

  // BEGIN throw-away
  sheetView.root.add(Ti.UI.createLabel({text: 'Not yet implemented\n\nSequence editor to add/remove items of type: ' + classId}));

  var button = Ti.UI.createButton({
    width: '50%', height: 44,
    bottom: 20, center: '50%',
    title: 'Save'
  });
  sheetView.root.add(button);

  button.addEventListener('click', function () {
    sheetView.root.fireEvent('sequence:update', {property: propertyId, data: data});    
    sheetView.hide();
  });
  // END throw-away

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
