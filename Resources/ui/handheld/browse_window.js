
var GLOBALS = require('globals');
var createHTTPClient = require('lib/http_client_wrapper');
var createEntryWindow = require('ui/handheld/EntryWindow');

module.exports = function (title) {

  "use strict";

	var self = Ti.UI.createWindow({
		title:title,
		barColor: '#006',
//		backgroundImage: '/images/bg_grey_gradient_noise.png',
		backgroundColor: 'white'
	});

	//
	// create table view (
	//
	var tableView = Titanium.UI.createTableView({
		top:0,
		width:320,
		separatorColor:'transparent',
		backgroundColor:'transparent'
		//filterAttribute:'filter',
		//style:Titanium.UI.iPhone.TableViewStyle.GROUPED,
		//backgroundImage:'../images/bg_linen_dark.png'
	});
	self.add(tableView);

	self.addEventListener('click', function(e) {

		var entryWindow = createEntryWindow(e.rowData.rowJSONObj);
		self.containingTab.open(entryWindow);

	});

	function make_row(json_obj, index) {

		var row = Ti.UI.createTableViewRow({
		  left: 0, top:0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
			rowURI: json_obj.entryURI,
			rowJSONObj: json_obj,
			className: 'journalEvent',
			//selectedBackgroundColor = '#333',
			clickName: 'row'
		});
		
		var rowView = Ti.UI.createView({
		  left: 0, top: 0,
		  width: Ti.UI.FILL, height: Ti.UI.SIZE,
		  layout: 'horizontal',
			backgroundColor: '#fff',
			borderRadius:3
		});
		row.add(rowView);

    var hasImage = json_obj.images && json_obj.images.length > 0;
    if (hasImage) {
      var image = Ti.UI.createImageView({
        image:json_obj.images[0].image,
        defaultImage: '/images/cloud.png',
        left: 10, top: 10,
        width: 45, height: 45
      });
      row.add(image);
    }

    var textView = Ti.UI.createView({
      left: 10, top: 10,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      layout: 'vertical'
    });
    row.add(textView);

		var title = Ti.UI.createLabel({
		  left: 0, top: 0,
		  width: Ti.UI.FILL, height: Ti.UI.SIZE,
			color: '#000',
			font:{fontSize:16,fontFamily:'Helvetica Neue'},
			clickName: 'user',
			text: json_obj.title
		});
		textView.add(title); 

    var description = Ti.UI.createLabel({
      left: 0, top: 10,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      color: '#000',
      font:{fontSize:14,fontFamily:'Helvetica Neue'},
      clickName: 'user',
      text: json_obj.description
    });
    textView.add(description); 

		var date = Ti.UI.createLabel({
		  left: 0, top: 10,
		  width: Ti.UI.FILL, height: Ti.UI.SIZE,
			color:'#999',
			font:{fontSize:14,fontFamily:'Helvetica Neue'},
			clickName: 'user',
			text: new Date(json_obj.create_time)
		});
		textView.add(date); 

		return row;
	}

	function reload() {

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
		reload();
	});

	Ti.App.addEventListener("entry:created", function(e) {
		reload();
	});

  reload();

	return self;
}

