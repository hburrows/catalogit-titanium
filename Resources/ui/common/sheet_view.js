/*
 * 
 */

module.exports = function (win, labels) {

  "use strict";

	var washView,
			containerView,
			sheetView,
			titleView,
			titleLabel,
			parentView = null;

  var winRect = win.getRect();

  var containerPadding = 40,
      containerWidth = winRect.width - (containerPadding * 2),
      containerHeight = winRect.height - (containerPadding * 2);

  function showSheetView(parent) {

    win.add(washView);
    win.add(containerView);

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
        win.remove(containerView);
        win.remove(washView);
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

  //
  // GRID SETUP
  //
  var gridData = [];
  var outIdx, outMax,
      inIdx, inMax;
  var padding = 10,
      width = Math.round((containerWidth - (padding * 4)) / 3);

  var maxRows = 3;

  for (outIdx = 0, outMax = maxRows; outIdx < outMax; outIdx += 1) {

    var row = Ti.UI.createTableViewRow({
      className: 'gridRow', // used to improve table performance
      selectionStyle: Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE,
        rowIndex: outIdx // custom property, useful for determining the row during events
    });

    for (inIdx = 0, inMax = 3; inIdx < inMax; inIdx += 1) {

      var left = inIdx * (padding + width) + padding;

      var cell = Ti.UI.createView({
        backgroundColor:'#666',
        top: padding,
        left: left,
        height: width,
        width: width,
        borderRadius:6
      });
      row.add(cell);

      var label = Ti.UI.createLabel({
        color:'#fff',
        font:{font:'Avenir',fontSize:14,fontWeight:'bold'},
        text: labels[(outIdx * maxRows) + inIdx].title,
        touchEnabled:false,
        textAlign:'TEXT_ALIGNMENT_CENTER'
      });
      cell.add(label);
    }
    
    gridData.push(row);
  }

  var tableView = Ti.UI.createTableView({
    data: gridData,
    scrollable: false,
    separatorColor: 'transparent',
    backgroundColor: 'transparent'
  });
  containerView.add(tableView);

  tableView.addEventListener('click', function(e) {
    hideSheetView();
  });

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
    'show': function (parent, success) {
      showSheetView(parent);
    },
    'hide': function () {
      hideSheetView();
    }
  };

/*
	var showSheetView = function (title, color, view) {

		washView.visible = true;
		
		//sheetView.add();

		titleView.backgroundColor = '#598FE7';
		titleLabel.text = 'Blank Sheet';
		
		containerView.animate({
			top:20,
			duration:250,
			curve:Titanium.UI.ANIMATION_CURVE_EASE_IN
		});
	};

	var hideSheetView = function () {

    washView.visible = false;
  
    optionSheetContainerView.animate({
      top:380,
      duration:250,
      curve:Titanium.UI.ANIMATION_CURVE_EASE_OUT
    },
    function() {
      optionSheetView.remove(optionSheetsAry[selectedActivity]);
      optionSheetContainerView.remove(imageContainerView);
      optionSheetContainerView.remove(paperclipImg);
    });

    activityViews[selectedActivity].borderWidth = 0;
    hasImage = false;
	};

	washView = Ti.UI.createView({
		width: 'auto',
		height: 'auto',
		backgroundColor: '#000',
		visible: false,
		opacity: 0.70
	});
	parent.add(washView);

	containerView = Ti.UI.createView({
		width:320,
		height:330,
		top:380
	});
	parent.add(containerView);			

	sheetView = Ti.UI.createView({
		width:290,
		height:330,
		top:0,
		backgroundColor:'#fff'
	});
	containerView.add(sheetView);

  titleView = Ti.UI.createView({
				width:290,
				height:50,
				top:0
			});
	sheetView.add(titleView);

	titleView.addEventListener('click', function(e) {
		hideSheetView();
	});

	titleLabel = Ti.UI.createLabel({
				color:'#fff',
				font:{font:'Avenir',fontSize:27},
				text: 'Blank Sheet',
				touchEnabled:false
			});
	titleView.add(titleLabel);

	var buttonView = Ti.UI.createView({
		width:290,
		height:62,
		backgroundColor:'#ccc',
		bottom:0
	});
	sheetView.add(buttonView);

	var closeBtn = Titanium.UI.createButton({
		title:'Close',
		color:'#fff',
		backgroundImage:'/images/btn_dark.png',
		backgroundSelectedImage:'/images/btn_dark.png',
		backgroundDisabledImage: '/images/btn_dark.png',
		width:270,
		height:48,
		font:{font:'Avenir', fontSize:18, fontWeight:'bold'}
	});
	buttonView.add(closeBtn);

	closeBtn.addEventListener('click',function(e) {
		hideSheetView();
	});
*/
}
