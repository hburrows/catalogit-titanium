
module.exports = function (win, entryModel) {

  "use strict";

  var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;

  var self = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.FILL
  });

  //
  // -- PREDICATE EDITOR VIEW
  //
  
  var PREDICATES = [
    { 'namespace': 'thing',
      'predicates': [
      ]
    },
 
    { 'namespace': 'rdf',
      'predicates': [
        {'title': 'type'}
      ]
    },
 
    { 'namespace': 'dc',
      'predicates': [
        {'title': 'dc:creator'},
        {'title': 'dc:date'},
        {'title': 'dc:description'},
        {'title': 'dc:identifier'},
        {'title': 'dc:subject'},
        {'title': 'dc:title'}
      ]
    },
 
    { 'namespace': 'foaf',
      'predicates': [
        {'title': 'foaf:name'},
        {'title': 'foaf:givenName'},
        {'title': 'foaf:homepage'},
        {'title': 'foaf:img'},
        {'title': 'foaf:lastName'},
        {'title': 'foaf:firstName'},
        {'title': 'foaf:gender'},
        {'title': 'foaf:mbox_sha1sum'},
        {'title': 'foaf:nick'},
        {'title': 'foaf:page'},
        {'title': 'foaf:thumbnail'},
        {'title': 'foaf:title'},  /* Mr, Mrs, Ms, Dr. etc */
        {'title': 'foaf:birthday'},
        {'title': 'foaf:page'}
      ]
    }
  ];

  //
  // ONE OF 2 VIEWS - NO SUBJECT, SUBJECT PROPERTIES
  //
  var predicateTableData = [],
      idx,
      max = PREDICATES[3].predicates.length;

  for (idx = 0, max = PREDICATES[3].predicates.length; idx < max; idx += 1) {
    
    var row = Ti.UI.createTableViewRow({
      className: 'predicateRow', // used to improve table performance
      selectedBackgroundColor: 'white',
      hasDetail: true,
      rowIndex: idx // custom property, useful for determining the row during events
    });

    var predicate = Ti.UI.createLabel({
      color:'#576996',
      font:{
        fontFamily:'Arial',
        fontSize: defaultFontSize,
        fontWeight:'bold'
      },
      text: PREDICATES[3].predicates[idx].title + ":",
      left: 10, top: 0,
      width: 200, height: 30
    });
    row.add(predicate);

    var predicateObject = Ti.UI.createLabel({
      color:'#222',
      font:{
        fontFamily: 'Arial',
        fontSize:defaultFontSize,
        fontWeight:'normal'
      },
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
      left: 10, top: 30
    });
    row.add(predicateObject);

    predicateTableData.push(row);
  }

  var table = Ti.UI.createTableView({
    'left': 0, 'top': 0,
    'width': Ti.UI.FILL, height: Ti.UI.SIZE,
    'data': predicateTableData
    //'editing': true
  });
  self.add(table);

  return {
    view: self,
    model: entryModel
  }
}
