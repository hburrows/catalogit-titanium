/*
 * 
 */

module.exports = function (parent) {

  "use strict";

    var viewObj,
        t = Titanium.UI.create2DMatrix(),
        washView, containerView, frontView, backView, closeView,
 
        containingRect = parent.getRect(),
  
        padding = 20,
        width = containingRect.width - (padding * 2),
        height = containingRect.height - (padding * 2),

        closeWidth = 22,
        halfCloseWidth = Math.round(closeWidth * 0.5);        

    t = t.scale(0);
  
    washView = Ti.UI.createView({
      width: Ti.UI.FILL,
      height: Ti.UI.FILL,
      backgroundColor: '#000',
      opacity: 0.0,
      zIndex: 10000
    });
    parent.add(washView);
 
    containerView = Ti.UI.createView({
      left: padding, top: padding,
      width: width, height: height,
      backgroundColor: '#fff',
      borderRadius: 8,
      transform: t,
      zIndex: 10001
    });
    parent.add(containerView);

    frontView = Ti.UI.createView({
      left: 0, top: 0,
      width: width, height: height,
      backgroundColor: '#fff',
      borderRadius: 8,
      zIndex: 10001
    });
    containerView.add(frontView);

    backView = Ti.UI.createView({
      left: 0, top: 0,
      width: width, height: height,
      backgroundColor: '#fff',
      borderRadius: 8,
      zIndex: 10001
    });

    closeView = Ti.UI.createImageView({
      width: closeWidth, height: closeWidth,
      top: padding-halfCloseWidth, left: padding-halfCloseWidth,
      image: '/images/close_x_22X22.png',
      opacity: 0,
      zIndex: 10002
    });
    parent.add(closeView);

    function close() {
      
      washView.removeEventListener('click', close);
      closeView.removeEventListener('click', close);
 
      washView.animate({opacity: 0, duration: 300}, function () {
        parent.remove(washView);
      });

      var t = Ti.UI.create2DMatrix();
      t = t.scale(0);
      containerView.animate({transform:t, duration:300}, function () {
        parent.remove(containerView);
        frontView.fireEvent('closed');
      });      

      parent.remove(closeView);
      
    }

    washView.addEventListener('click', close);
  
    closeView.addEventListener('click', close);

  return {

    root: frontView,
    
    frontView: frontView,
    backView: backView,

    rootWidth: width,
    rootHeight: height,

    frontVisible: undefined,

    show: function () {
      
      var that = this;

      // 1. create first transform to go beyond normal size
      var t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(1.1);
      var a = Titanium.UI.createAnimation();
      a.transform = t1;
      a.duration = 200;

      function phase2Complete() {
        a.removeEventListener('complete', phase2Complete);
      }

      function phase1Complete() {

        a.removeEventListener('complete', phase1Complete);

        // animate the containerView to normal size
        var t2 = Titanium.UI.create2DMatrix();
        t2 = t2.scale(1.0);
        containerView.animate({transform: t2, duration: 200}, phase2Complete);

        // animate the close button to full opacity        
        closeView.animate({opacity: 1, duration: 400});
      }

      // 2. when this animation completes, scale to normal size
      a.addEventListener('complete', phase1Complete);
 
      this.frontVisible = true;
      frontView.fireEvent('opened');

      containerView.animate(a);

      washView.animate({opacity: 0.70, duration: 200});

    },

    hide: function () {
      close();
    },

    flip: function () {

      this.frontVisible = !this.frontVisible;

      frontView.fireEvent(this.frontVisible ? 'flipToFront' : 'flipToBack');

      closeView.animate({opacity: 0, duration: 200});

      containerView.animate({
        view: this.frontVisible ? frontView : backView,
        transition: this.frontVisible ? Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
       }, function () {
        closeView.animate({opacity: 1, duration: 200});
      });
    }

  };
}
