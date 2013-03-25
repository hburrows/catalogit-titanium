var cellWidth = 68;
var cellHeight = 68;
var xSpacer = 10;
var ySpacer = 10;
var xGrid = 4;
var yGrid = 2;

var colors = ['#598FE7','#A7C2F8','#77D2D7','#9AE0BE'];
var labels = ['Camera','Photo','Video','Dictate'];

function recordAudio(view) {
  
  var Win = require('ui/handheld/capture_audio'),
      w = new Win();
      w.title = 'Record Audio';
      w.barColor = 'black';
  
  var b = Titanium.UI.createButton({
        title:'Close',
        style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
      });
  w.setLeftNavButton(b);
  
  b.addEventListener('click',function() {
    w.close();
  });

  w.open({modal:true});

  return;
}

Ti.App.addEventListener("photo:edit", function (e) {

  Ti.API.info("event - photo:edit");

  var GLOBALS = require('globals')

  var media = null;
  if (!e.entry || entry.entry === null) {
    media = GLOBALS.currentMedia;
  }

  var createPhotoEditWindow = require('ui/handheld/entry_view'),
      editor = createPhotoEditWindow(e.entryId, media);
      
  editor.open({
    modal:true,
    transition: Ti.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT
  });

  return;
});

// ===================================
// choose a photo from library
// ===================================


module.exports = function (tabList) {

  "use strict";

  var GLOBALS = require('globals'),
      self,
      lastEntryView,
      imageView,
      captionView,
      captionText,
      instructionsView;

  function setLastEntry(entry) {
    if (entry === null) {
      instructionsView.visible = true;
      imageView.visible = false;
      captionView.visible = false;
    }
    else {
      instructionsView.visible = false;
      imageView.visible = true;
      captionView.visible = true;
     imageView.setImage(entry);
    }
  }

  Ti.App.addEventListener('entry:created', function (e) {
    setLastEntry(GLOBALS.lastEntry.media);
  });

  self = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    backgroundColor: '#fff'
  });

  lastEntryView = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL
  });
  self.add(lastEntryView);

  imageView = Ti.UI.createImageView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL,
    image: '/images/welcome/vase.jpg',
    visble: false    
  });
  lastEntryView.add(imageView);

  var linearGradientView = Ti.UI.createView({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.FILL,
      backgroundGradient: {
          type: 'linear',
          startPoint: { x: '50%', y: '0%' },
          endPoint: { x: '50%', y: '25%' },
          colors: [ { color: 'rgba(255,255,255,1)', offset: 0.0}, { color: 'rgba(255,255,255,0)', offset: 1.0 } ]
      }
  });
  lastEntryView.add(linearGradientView);

  captionView = Ti.UI.createView({
    left: 10, bottom: 10,
    right: 10, height: Ti.UI.SIZE,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#eee',
    visble: false    
  });
  lastEntryView.add(captionView);
  
  captionText = Ti.UI.createLabel({
    left: 10, top: 10,
    right: 10, bottom: 10,
    height: Ti.UI.SIZE,
    text: 'Wedding Vase\n\nType: Pottery\nNotes: and an assortment of other information',
    color: '#fff',
    font:{fontWeight:'bold'},
    opacity: 1.0    
  });
  captionView.add(captionText);

  instructionsView = Ti.UI.createView({
    left: 20, top: '30%',
    right: 20, height: Ti.UI.SIZE,
    visble: false
  });
  lastEntryView.add(instructionsView);
  
  var instructionsText = Ti.UI.createLabel({
    text: 'Start by capturing a photo, video, or audio recording of whatever you want to catalog.  Tap one of the above buttons to get started.',
    textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
  });
  instructionsView.add(instructionsText);

  setLastEntry(null);

  var row = Ti.UI.createTableViewRow({
	      className:'grid',
	      layout:'horizontal',
	      height: cellHeight + ySpacer,
				selectionStyle: 'NONE'
			});

	var j;
  for (j = 0; j < xGrid; j=j+1) {
		var thisView = Ti.UI.createView({

			objName:'grid-view',
			objIndex:j.toString(),
			objActivity:labels[j],

			backgroundColor:colors[j],
			left:ySpacer,
			height:cellHeight,
			width:cellWidth,
			borderRadius:6
		});
 
		var thisLabel = Ti.UI.createLabel({
			color:'#fff',
			font:{font:'Avenir',fontSize:14,fontWeight:'bold'},
			text:labels[j],
			touchEnabled:false,
			textAlign:'TEXT_ALIGNMENT_CENTER'
		});
		thisView.add(thisLabel);

    row.add(thisView);
	}
	
	var tableView = Ti.UI.createTableView({
		data:[row],
		scrollable:false,
		top: 10,
		separatorColor:'transparent',
		backgroundColor:'transparent'
	});
	self.add(tableView);

	tableView.addEventListener('click', function(e) {

		if(e.source.objName) {

			var activity = e.source.objActivity;
			var activityIndex = e.source.objIndex;

			if (activity === "Camera") {
        var pictureCapture = require('ui/handheld/photo_capture');
        pictureCapture();
			}
			else
			if (activity === "Photo") {
        var pictureChoose = require('ui/handheld/photo_existing');
        pictureChoose();
			}
			else
			if (activity === "Dictate") {
				recordAudio(self);
			}
			if (activity === "Video") {
        Ti.UI.createAlertDialog({
          title:'Capture',
          message:'record video'
        }).show();                    
			}

			return;
/*			
			e.source.borderColor = '#fff';
			e.source.borderWidth = 2;
			e.source.backgroundColor = colors[selectedActivity];
					
			showOptionSheetView();
*/
		}

	}); 

	return self;
}

