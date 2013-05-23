/*
 * 
 */

var _ = require('vendor/underscore'),
    Backbone = require('vendor/backbone');

module.exports = function (parent) {

  "use strict";

    var viewObj,
    
        t = Titanium.UI.create2DMatrix(),
        washView, containerView, frontView, backView, closeView, previousView,
 
        containingRect = parent.getRect(),
  
        stdBorderRadius = 8,
        stdZIndex = 10001,
        padding = 20,
        width = containingRect.width - (padding * 2),
        height = containingRect.height - (padding * 2),

        closeWidth = 22,
        halfCloseWidth = Math.round(closeWidth * 0.5),
        
        previousWidth = 22,        
        halfPreviousWidth = Math.round(previousWidth * 0.5);

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
      borderRadius: stdBorderRadius,
      zIndex: stdZIndex
    });
    containerView.add(frontView);

    backView = Ti.UI.createView({
      left: 0, top: 0,
      width: width, height: height,
      backgroundColor: '#fff',
      borderRadius: stdBorderRadius,
      zIndex: stdZIndex
    });

    closeView = Ti.UI.createImageView({
      width: closeWidth, height: closeWidth,
      top: padding-halfCloseWidth, left: padding-halfCloseWidth,
      image: '/images/close_x_22X22.png',
      opacity: 0,
      zIndex: 10002
    });
    parent.add(closeView);

    previousView = Ti.UI.createImageView({
      width: previousWidth, height: previousWidth,
      right: padding - halfPreviousWidth, top: padding - halfPreviousWidth,
      image: '/images/previous_20X20.png',
      opacity: 0,
      zIndex: 10003
    });
    parent.add(previousView);


  return {

    root: frontView,
    
    frontView: frontView,
    backView: backView,

    rootWidth: width,
    rootHeight: height,

    frontVisible: undefined,
    currentView: undefined,

    // stack of views the 
    viewStack: [],

    show: function () {
      
      var that = this;

      function close() {
        that.hide();
      }
      washView.addEventListener('click', close);
      closeView.addEventListener('click', close);

      previousView.addEventListener('click', function () { that.pop(); });

      this.frontVisible = true;
      this.currentView = frontView;
 
      // 1. create first transform to go beyond normal size
      var t1 = Titanium.UI.create2DMatrix();
      t1 = t1.scale(1.1);
      var a = Titanium.UI.createAnimation();
      a.transform = t1;
      a.duration = 200;

      function animation2Complete() {
        a.removeEventListener('complete', animation2Complete);
      }

      function animation1Complete() {

        a.removeEventListener('complete', animation1Complete);

        // animate the containerView to normal size
        var t2 = Titanium.UI.create2DMatrix();
        t2 = t2.scale(1.0);
        containerView.animate({transform: t2, duration: 200}, animation2Complete);

        // animate the close and back button to full opacity        
        closeView.animate({opacity: 1, duration: 400});
        //previousView.animate({opacity: 1, duration: 400});
        
      }

      // 2. when this animation completes, scale to normal size
      a.addEventListener('complete', animation1Complete);
 
      frontView.fireEvent('opened');

      containerView.animate(a);

      washView.animate({opacity: 0.70, duration: 200});

    },

    hide: function () {
      
      //washView.removeEventListener('click');
      //closeView.removeEventListener('click');
      //previousView.removeEventListener('click');
 
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
      parent.remove(previousView);
      
    },

    flip: function () {

      var that = this;

      frontView.fireEvent(this.frontVisible ? 'flipToBack' : 'flipToFront');

      closeView.animate({opacity: 0, duration: 200});
      if (this.currentView !== this.frontView) {
        previousView.animate({opacity: 0, duration: 200});
      }

      this.frontVisible = !this.frontVisible;
      this.currentView = this.currentView === this.frontView ? this.backView : this.frontView; 

      containerView.animate({
        view: this.frontVisible ? frontView : backView,
        transition: this.frontVisible ? Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT : Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
       }, function () {
        closeView.animate({opacity: 1, duration: 200});
        if (that.currentView !== that.frontView) {
          previousView.animate({opacity: 1, duration: 200});
        }
      });
    },

    newStackView: function () {

      view = Ti.UI.createView({
        left: 0, top: 0,
        width: width, height: height,
        backgroundColor: '#fff',
        borderRadius: stdBorderRadius,
        zIndex: stdZIndex
      });

      return view;
    },

    push: function (stackView) {
      containerView.add(stackView);
      this.viewStack.push(stackView);
    },

    pop: function () {
      this.flip();
      return;
      var stackView = this.viewStack.pop();
      containerView.remove(stackView);
    }

  };
}
