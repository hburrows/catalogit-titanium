/*
 * 
 */

module.exports = function (parent) {

  "use strict";

	var washView,
			containerView,
			sheetView,
			titleView,
			titleLabel,
			parentView = null;

  var winRect = parent.getRect();

  var containerPadding = 20,
      containerWidth = winRect.width - (containerPadding * 2),
      containerHeight = winRect.height - (containerPadding * 2);

  function showSheetView() {

    parent.add(washView);
    parent.add(containerView);

    containerView.animate({
      top: containerPadding,
      duration: 250,
      curve: Titanium.UI.ANIMATION_CURVE_EASE_IN
    });
    
  }
  
  function hideSheetView() {

    containerView.animate({
        top: winRect.height,
        duration: 250,
        curve: Titanium.UI.ANIMATION_CURVE_EASE_OUT
      },
      function() {
        parent.remove(containerView);
        parent.remove(washView);
      }
    );

  }

  washView = Ti.UI.createView({
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    backgroundColor: '#000',
    opacity: 0.70
  });

  washView.addEventListener('click', function (e) {
    hideSheetView();
  });

  //
  // CONTAINER VIEW
  //
  containerView = Ti.UI.createView({
    left: containerPadding, top: winRect.height,
    width: containerWidth, height: containerHeight,
    backgroundColor: '#fff',
    borderWidth: 1, borderColor: '#999', borderRadius: 10,
    opacity: 1
  });
  washView.add(containerView);

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

    container: containerView,
    containerWidth: containerWidth,
    containerHeight: containerHeight,

    show: function () {
      showSheetView();
    },

    hide: function () {
      hideSheetView();
    }
  };

}
