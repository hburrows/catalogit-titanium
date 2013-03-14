var cellWidth = 68;
var cellHeight = 68;
var xSpacer = 10;
var ySpacer = 10;
var xGrid = 4;
var yGrid = 2;

var colors = ['#598FE7','#A7C2F8','#77D2D7','#9AE0BE'];
var labels = ['Camera','Photo','Video','Dictate'];

var makeSheetView = require('/ui/handheld/SheetView');

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

// Handle successful login
Ti.App.addEventListener("EntryCreated", function (e) {
  
  var makePhotoEditWindow = require('ui/common/photo_edit'),
      w = makePhotoEditWindow(e.entry_id);
      
  w.open({modal:true});

  return;
});

Ti.App.addEventListener("photo:edit", function (e) {

  Ti.API.info("event - photo:edit");

  var GLOBALS = require('globals')
  var currentMedia = GLOBALS.currentMedia;

  var makePhotoEditWindow = require('ui/common/photo_edit'),
      w = makePhotoEditWindow(currentMedia);
      
  w.open({
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

  var GLOBALS = require('globals');

  Ti.App.addEventListener('entry:created', function (e) {
    alert('new entry created');
    GLOBALS.lastEntry.media = e.media;
  });

  var self = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL
  });

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

