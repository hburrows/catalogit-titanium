/*
 * 
 */

module.exports = function (owner, sheetId, renderContentsCallback) {

  "use strict";

  var self = Titanium.UI.createWindow({
    backgroundColor: 'transparent',
    //opacity: 0.70,
    navBarHidden: true,
    orientationModes: [
      Ti.UI.PORTRAIT,
      Ti.UI.LANDSCAPE_LEFT,
      Ti.UI.LANDSCAPE_RIGHT
    ]
  });

	var washView,
			containerView;

  var PADDING = 20;
  var winRect;

  self.addEventListener('open', function (e) {

    winRect = self.getRect();
  
    var containerWidth = winRect.width - (PADDING * 2),
        containerHeight = winRect.height - (PADDING * 2);

    containerView.setTop(winRect.height);
    containerView.setWidth(containerWidth);
    containerView.setHeight(containerHeight);

    renderContentsCallback(containerView, containerWidth, containerHeight);

    containerView.animate({
      top: PADDING,
      duration: 1000,
      curve: Titanium.UI.ANIMATION_CURVE_EASE_IN
    }, function () {
      owner.fireEvent(sheetId + ':opened');      
    });
    
  });

  self.addEventListener('close', function (e) {
    owner.fireEvent(sheetId + ':closed');
  });

  function showSheetView() {
    self.open({modal: true, animated: false});
  }
  
  function hideSheetView() {

    containerView.animate({
        top: winRect.height,
        duration: 1000,
        curve: Titanium.UI.ANIMATION_CURVE_EASE_OUT
      },
      function() {
        self.close();
      }
    );
  }

  self.addEventListener('click', function (e) {
    hideSheetView();
  });

  //
  // CONTAINER VIEW
  //
  containerView = Ti.UI.createView({
    left: PADDING,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#999', borderRadius: 10,
    opacity: 1
  });
  self.add(containerView);

  var closeBtn = Titanium.UI.createButton({
    title:'Close',
    bottom: 10,
    center: '50%'
  });
  containerView.add(closeBtn);

  closeBtn.addEventListener('click',function(e) {
    hideSheetView();
  });


  return {

    show: function () {
      showSheetView();
    },

    hide: function () {
      hideSheetView();
    }
  };

}
