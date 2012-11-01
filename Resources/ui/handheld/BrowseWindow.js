"use strict";

var jotClient = require('utils/jotclient');
var makeEntryWindow = require('ui/handheld/EntryWindow');

function ApplicationWindow(title) {

	var self = Ti.UI.createWindow({
		title:title,
		barColor: '#006',
//		backgroundImage: '/images/bg_grey_gradient_noise.png',
		backgroundColor: 'white'
	});

/*
	var button = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('newWindow'),
		top:20
	});
	self.add(button);
	
	button.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		self.containingTab.open(Ti.UI.createWindow({
			title: L('openWindow'),
			backgroundColor: 'white'
		}));
	});
*/

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

		//alert(e.rowData.rowIndex);

		entryWindow = makeEntryWindow(e.rowData.rowJSONObj)
		self.containingTab.open(entryWindow);

	});

	function make_row(json_obj, index) {

		var row = Ti.UI.createTableViewRow({
			height: 70,
			rowIndex: json_obj.id,
			rowJSONObj: json_obj,
			className: 'journalEvent',
			//selectedBackgroundColor = '#333',
			clickName: 'row'
		});
		
		var rowView = Ti.UI.createView({
			height:'65',
			width:310,
			backgroundColor:'#fff',
			borderRadius:3
		});
		row.add(rowView);

		var entry = Ti.UI.createLabel({
			color:'#000',
			font:{fontSize:16,fontFamily:'Helvetica Neue'},
			//fontWeight:'bold',
			left:10,
			top:11,
			//width:200,
			clickName:'user',
			text:json_obj.entry_type
		});
		//row.filter = user.text;
		rowView.add(entry); 

		var date = Ti.UI.createLabel({
			color:'#999',
			font:{fontSize:14,fontFamily:'Helvetica Neue'},
			//fontWeight:'bold',
			left:10,
			bottom:11,
			//width:200,
			clickName:'user',
			text: json_obj.entry_time
		});
		rowView.add(date); 

		var hasImage;
		if (json_obj.images && json_obj.images.length > 0) {
			hasImage = true;
		  var image = Ti.UI.createImageView({
				image:json_obj.images[0].image,
				defaultImage:'/images/cloud.png',
				right:10,
		    width:45, height:45
		  });
		  row.add(image);
		}
		else {
			hasImage = false;
		}
		
		var sq = Ti.UI.createView({
			right: (hasImage === true) ? 65 : 10,
			width:15,
			height:15,
			borderRadius:'2px'
		})
		rowView.add(sq);

		return row;
	}

	function reload() {

		jotClient().listEntries({

			success: function(response,xhrResult) {
			  var data = []
				var idx;
				for (idx = 0; idx < response.length; idx=idx+1) {
					var row = make_row(response[idx], idx);
					data.push(row)

				}
				tableView.setData(data);			
			},

			error: function(response, xhrResult) {
	      Ti.UI.createAlertDialog({
	            title:'Create Activity Error',
	            message:'status code: ' + xhrResult.status + ', message: ' + response
	      }).show();										
			}
				
		});

	}

	// Handle entry updated event
	Ti.App.addEventListener("EntryUpdated", function(e) {
		reload();
	});

	Ti.App.addEventListener("entry.updated", function(e) {
		reload();
	});

	Ti.App.fireEvent('EntryUpdated');

	return self;
}


module.exports = ApplicationWindow;
