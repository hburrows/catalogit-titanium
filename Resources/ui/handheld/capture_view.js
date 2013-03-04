var cellWidth = 68;
var cellHeight = 68;
var xSpacer = 10;
var ySpacer = 10;
var xGrid = 4;
var yGrid = 2;

var colors = ['#598FE7','#A7C2F8','#77D2D7','#9AE0BE'];
var labels = ['Camera','Photo','Video','Dictate'];

var jotClient = require('utils/jotclient');
var makeSheetView = require('/ui/handheld/SheetView');

function CaptureView(tabList) {

  "use strict";

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
	
	var self = Ti.UI.createView({
		width: 'auto',
		height: 'auto'
	});

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
				takePhoto();
			}
			else
			if (activity === "Photo") {
				choosePhoto();
			}
			else
			if (activity === "Dictate") {
				recordAudio(self);
			}
			if (activity === "Video") {
				recordVideo();
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

	var sheetView = makeSheetView(view);
	sheetView.show();
	return;

			
	return;	
}

function recordVideo() {
	Ti.UI.createAlertDialog({
		title:'Capture',
		message:'record video'
	}).show();										
	return;	
}

function takePhoto() {
  var pictureCapture = require('ui/handheld/photo_capture');
  pictureCapture();
  return;
}

// Handle successful login
Ti.App.addEventListener("EntryCreated", function (e) {
  
  var makePhotoEditWindow = require('ui/common/photo_edit'),
      w = makePhotoEditWindow(e.entry_id);
      
  w.open({modal:true});

  return;
});

/*  
	Ti.Media.showCamera({

		allowEditing: true,
//		mediaTypes: [Ti.Media.MEDIA_TYPE_PHOTO]

		//saveToPhotoGallery:true,
		//overlay:overlay,
	
		success:function(event) {
	
			// create a jotclient object; create a new entry and attach a photo to it
			var client = jotClient();

			client.createEntry({

				entry_type: "photo",
				attributes: {},

				// create activity success
				success: function(response,xhrResult) {

					Ti.App.fireEvent('EntryUpdated');
							
					var entry_id = response.id;

					client.uploadImage({

						entry_id: entry_id,
						media: event.media,
						mediaType: event.mediaType,
						cropRect: event.cropRect,
			
						// upload image success
						success: function(response,xhrResult) {
							Ti.App.fireEvent('EntryUpdated');							
						},
						error: function(response, xhrResult) {
			        Ti.UI.createAlertDialog({
			              title:'Upload Error',
			              message:'status code: ' + xhrResult.status + ', message: ' + response
			        }).show();										
						}
		
					});

				},

				error: function(response, xhrResult) {
	        Ti.UI.createAlertDialog({
	              title:'Create Activity Error',
	              message:'status code: ' + xhrResult.status + ', message: ' + response
	        }).show();										
				}

			});
	
		},

		cancel: function() {
			// user cancel -- ignore
		},

		error:function(error) {
			//win.close();
			alert(error);
		}
	});
}
*/

// ===================================
// choose a photo from library
// ===================================

function choosePhoto() {
  var pictureChoose = require('ui/handheld/photo_existing');
  pictureChoose();
  return;

}

module.exports = CaptureView;
