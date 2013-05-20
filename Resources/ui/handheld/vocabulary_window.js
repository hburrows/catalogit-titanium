module.exports = function () {

  "use strict";
  
  var GLOBALS = require('globals'),
      _ = require('vendor/underscore'),
      createHTTPClient = require('lib/http_client_wrapper');

	var self = Ti.UI.createWindow({
		title: 'Vocabularies',
		barColor: '#036',
		backgroundColor: 'white'
	});

  // REFRESH - NAV BAR BUTTON
  refreshButton = Titanium.UI.createButton({
    title: 'Refresh',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  self.setRightNavButton(refreshButton);

  //
  // create table view (
  //
  var tableView = Titanium.UI.createTableView({
    top: 10,
    width: Ti.UI.FILL,
    separatorColor: 'transparent',
    backgroundColor: 'transparent'
  });
  self.add(tableView);

  function make_row(id, label, enabled, index) {

    var row = Ti.UI.createTableViewRow({
      left: 0, top: 5,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      className: 'graphEntry',
      rowId: id,
    });
    
    var rowView = Ti.UI.createView({
      left: 0, top: 0,
      width: Ti.UI.FILL, height: Ti.UI.SIZE,
      layout: 'horizontal',
      backgroundColor: '#fff'
    });
    row.add(rowView);

    var enableSwitch = Ti.UI.createSwitch({
      left: 10,
      value: enabled
    });
    rowView.add(enableSwitch);

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
      text: label
    });
    textView.add(title); 

    return row;
  }

  function reload() {

    var xhr = createHTTPClient({

      // function called when the response data is available
      onload : function(e) {

        var graphs = JSON.parse(this.responseText);
    
        xhr = createHTTPClient({
    
          // function called when the response data is available
          onload : function(e) {
    
            var userGraphs = JSON.parse(this.responseText);
    
            var data = [],
                idx, max;
            for (idx = 0, max = graphs.length; idx < max; idx += 1) {
              
              var graphURI = graphs[idx].graph_uri;

              if (graphURI === 'http://example.com/rdf/schemas/') {
                continue;
              }

              var userGraph = _.find(userGraphs, function (e) {
                return e.graph_uri === graphURI;
              });

              var label = graphURI.substring(graphURI.lastIndexOf('/', graphURI.length-2) + 1, graphURI.length-1);
              
              var row = make_row(graphURI, label, userGraph !== undefined, idx);
              
              data.push(row);
            }
            
            tableView.setData(data);      
          }
            
        });
        
        xhr.open('GET', GLOBALS.api.USER_GRAPHS_RESOURCE);
        xhr.send();
      }

    });
    
    xhr.open('GET', GLOBALS.api.GRAPHS_RESOURCE);
    xhr.send();

  }

  tableView.addEventListener('change', function(e) {

    var xhr = createHTTPClient({
      onload : function(e) {
        // change switch control setting
      }
    });

    var method = e.source.value == 1 ? 'POST' : 'DELETE';
    xhr.open(method, GLOBALS.api.USER_GRAPH_RESOURCE.replace('%graph_id%', e.row.rowId));
    xhr.send();  
    
  });

  refreshButton.addEventListener('click', function () {
    reload();
  });

  reload();

	return self;
}

