exports = function (parent) {

  "use strict";

  return {
    
  };

	var washView,
			containerView,
			sheetView,
			titleView,
			titleLabel;

	var showSheetView = function (title, color, view) {

		washView.visible = true;
		
		//sheetView.add(/* specific to that sheet */);

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
	
		containerView.animate({
				top:380,
				duration:250,
				curve:Titanium.UI.ANIMATION_CURVE_EASE_OUT
			},
			function () {
			}
		);
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

	return {
		'show': function (title, color, view) {
			showSheetView(title, color, view);
		},
		'hide': function () {
			hideSheetView();
		}
	};
	
}
