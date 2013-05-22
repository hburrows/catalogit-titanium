/*
 * 
 */

module.exports = function (win, propertyId, classId, data) {

  "use strict";

  var createSheetView = require('ui/common/sheet_view'),
      sheetView = createSheetView(win),
      sheetRect = sheetView.root.getRect(),
      containerWidth = sheetRect.width;

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
