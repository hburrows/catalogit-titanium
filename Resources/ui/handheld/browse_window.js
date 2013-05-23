
var GLOBALS = require('globals');
var createHTTPClient = require('lib/http_client_wrapper');
var createEntryView = require('ui/handheld/entry_view');
var createEntryImageWin = require('ui/handheld/entry_image_window')

module.exports = function (title) {

  "use strict";

	var self = Ti.UI.createWindow({
		title:title,
		barColor: '#006',
//		backgroundImage: '/images/bg_grey_gradient_noise.png',
		backgroundColor: 'white'
	});

  // REFRESH - NAV BAR BUTTON
  refreshButton = Titanium.UI.createButton({
    title: 'Refresh',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  
  self.setRightNavButton(refreshButton);

  refreshButton.addEventListener('click', function () {
    reload();
  });

	//
	// create table view (
	//
	var tableView = Titanium.UI.createTableView({
		top: 0,
		width: Ti.UI.FILL,
		separatorColor: 'transparent',
		backgroundColor: 'transparent'
		//filterAttribute:'filter',
		//style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
		//backgroundImage:'../images/bg_linen_dark.png'
	});
	self.add(tableView);

	self.addEventListener('click', function(e) {

		//var entryWindow = createEntryView(e.rowData.rowJSONObj.id, null);
		var entryWindow = createEntryImageWin(e.rowData.rowJSONObj.id);
    entryWindow.containingTab = self.containingTab;

		self.containingTab.open(entryWindow);

	});

	function make_row(json_obj, index) {

		var row = Ti.UI.createTableViewRow({
		  left: 0, top:0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
			rowId: json_obj.id,
			rowJSONObj: json_obj,
			className: 'journalEvent',
			//selectedBackgroundColor = '#333',
			clickName: 'row'
		});
		
		var rowView = Ti.UI.createView({
		  left: 0, top: 0,
		  width: Ti.UI.FILL, height: Ti.UI.SIZE,
		  layout: 'horizontal',
			backgroundColor: '#fff'
		});
		row.add(rowView);

    var thumbnail = json_obj.data['http://example.com/rdf/schemas/stillImageURL'];
    if (thumbnail) {
      var image = Ti.UI.createImageView({
        image: thumbnail,
        defaultImage: '/images/cloud.png',
        left: 10, top: 10,
        width: 60, height: 60
      });
      rowView.add(image);
    }

    var textView = Ti.UI.createView({
      left: 10, top: 10,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      layout: 'vertical'
    });
    rowView.add(textView);

		var title = Ti.UI.createLabel({
		  left: 0, top: 0,
		  width: Ti.UI.FILL, height: Ti.UI.SIZE,
			color: '#000',
			font:{fontSize:16,fontFamily:'Helvetica Neue'},
			clickName: 'user',
			text: json_obj.data['http://purl.org/dc/elements/1.1/title']
		});
		textView.add(title); 

    var description = Ti.UI.createLabel({
      left: 0, top: 10,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      color: '#000',
      font:{fontSize:14,fontFamily:'Helvetica Neue'},
      clickName: 'user',
      text: json_obj.data['http://purl.org/dc/elements/1.1/description']
    });
    textView.add(description); 

    var milliSecs = parseInt(json_obj.data['http://example.com/rdf/schemas/createTime'], 10) * 1000;

		var date = Ti.UI.createLabel({
		  left: 0, top: 0,
		  width: Ti.UI.FILL, height: Ti.UI.SIZE,
			color:'#666',
			font:{fontSize:14,fontFamily:'Helvetica Neue'},
			clickName: 'user',
			text: new Date(milliSecs).toLocaleString()
		});
		textView.add(date); 

		return row;
	}

	function reload() {

    tableView.setData([]);
 
    var xhr = createHTTPClient({

      // function called when the response data is available
      onload : function(e) {

        var response = JSON.parse(this.responseText);

			  var data = [];
				var idx;
				for (idx = 0; idx < response.length; idx=idx+1) {
					var row = make_row(response[idx], idx);
					data.push(row);
				}
				tableView.setData(data);			
			}
				
		});
		
    xhr.open('GET', GLOBALS.api.ENTRIES_RESOURCE);
    xhr.send('');

	}

	// Handle entry updated event
	Ti.App.addEventListener("entry:updated", function(e) {
	  // find the row with matching id and update it
		//reload();
		Ti.API.log('entry:updated - event received in browse_window')
	});

	Ti.App.addEventListener("entry:created", function(e) {
	  //reload();
    //tableView.insertRowBefore(0, make_row(e.data, 0));
    Ti.API.log('entry:created - event received in browse_window')
	});

  reload();

	return self;
}

