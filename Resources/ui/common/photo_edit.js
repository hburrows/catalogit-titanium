/*
 * 
 */

module.exports = function (photoMedia) {

  "use strict";

  var win = Titanium.UI.createWindow({
    backgroundColor: '#fff'
  });

  win.title = 'Picture Details';
  win.barColor = 'black';

  // initialize to all modes
  win.orientationModes = [
    Ti.UI.PORTRAIT,
    Ti.UI.LANDSCAPE_LEFT,
    Ti.UI.LANDSCAPE_RIGHT
  ];

  // CANCEL - NAV BAR BUTTON
  var cancelButton = Titanium.UI.createButton({
    title:'Cancel',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  win.setLeftNavButton(cancelButton);

  cancelButton.addEventListener('click', function () {
    win.close();
  });
  
  // DONE - NAV BAR BUTTON
  var doneButton = Titanium.UI.createButton({
    title:'Done',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  win.setRightNavButton(doneButton);
  
  doneButton.addEventListener('click', function (e) {
    Ti.App.fireEvent('entry:created',{ media:photoMedia });
    win.close();
  });


  //
  // -- Constants, shared declarations 
  //
  var padding = 10;
  var PADDING = 10;
  var defaultFontSize = Ti.Platform.name === 'android' ? 16 : 14;

  //
  // -- CONTAINER VIEW
  //
  
  function getContainerWidth() {
    return Ti.Platform.displayCaps.platformWidth - (PADDING * 2);    
  }

  var containerView = Titanium.UI.createView({
    left: PADDING, top: 0,
    right: PADDING, bottom: PADDING,
    layout: 'vertical'
  });
  win.add(containerView);

  //
  // -- MEDIA INFO VIEW
  //
  var mediaInfoViewTop = 0,
      mediaInfoHeight = 100;
  var mediaInfoView = Titanium.UI.createView({
    //left: 0,
    //top: mediaInfoViewTop,
    left: 0, top: 0,
    width: Ti.UI.FILL, height: mediaInfoHeight
  });
  containerView.add(mediaInfoView);
  
  var photoContainer = Titanium.UI.createView({
    top: 0,
    left: 0,
    height: mediaInfoHeight,
    width: mediaInfoHeight
  });
  mediaInfoView.add(photoContainer);

  var photoView = Titanium.UI.createImageView({
    image: photoMedia
  });
  photoContainer.add(photoView);

/*
  var mediaInfoPropertiesView = Titanium.UI.createView({
    top: 0,
    left: mediaInfoHeight + padding,
    width: Titanium.UI.FILL,
    height: Titanium.UI.FILL,
    borderColor: '#999',
    borderWidth: 1
  });
  mediaInfoView.add(mediaInfoPropertiesView)
*/

  var tableData = [ {title: 'Date:'}, {title: 'Location:'} /*, {title: 'Carrots'}, {title: 'Potatoes'} */ ];

  var mediaInfoPropertiesView = Titanium.UI.createTableView({
    className: 'generalProperties', // used to improve table performance
    font: {
      fontFamily: 'Arial',
      fontSize: defaultFontSize
    },
    data: tableData,   
    top: 0,
    left: mediaInfoHeight + padding,
    width: Titanium.UI.FILL,
    height: Titanium.UI.FILL
  });
 //mediaInfoView.add(mediaInfoPropertiesView);


  //
  // -- SUBJECT IDENTIFIER VIEW
  //
  var subjectIdentifierView = Titanium.UI.createView({
    left: 0, top: PADDING,
    width: Titanium.UI.FILL, height: Titanium.UI.SIZE
  });
  containerView.add(subjectIdentifierView);

  var newSubjectButton = Titanium.UI.createButton({
    title: 'New',
    left: 0,
    width: '49%'
  });
  subjectIdentifierView.add(newSubjectButton);

  newSubjectButton.addEventListener('click', function (e) {

    var classes = [
      {title: 'Basket'}, {title: 'Rug'}, {title: 'Pottery'},
      {title: 'Doll'}, {title: 'Cradle Board'}, {title: 'Photo'},
      {title: 'Miniture'}, {title: 'Peace Pipe'}, {title: 'More...'}
    ];

    var makeSheetView = require('/ui/common/sheet_view');
    var sheetView = makeSheetView(win, classes);
    sheetView.show(win, classes);
  
    return;
  });
  
  var existingSubjectButton = Titanium.UI.createButton({
    title: 'Existing',
    left: '51%',
    width: '49%'
  });
  subjectIdentifierView.add(existingSubjectButton);

  existingSubjectButton.addEventListener('click', function (e) {

    var subjects = [
      {title: 'Basket 1'}, {title: 'Navajo Rug 1'}, {title: 'Basket 2'},
      {title: 'Curtis Photo 1'}, {title: 'Curtis Photo 2'}, {title: 'Santa Clara vase'},
      {title: 'Zuni Fetish 1'}, {title: 'Zuni Fetish 2'}, {title: 'More...'}
    ];

    var makeSheetView = require('/ui/common/sheet_view');
    var sheetView = makeSheetView(win, subjects);
    sheetView.show(win, subjects);
  
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

  var predicateEditorView = Titanium.UI.createView({
    left: 0, top: 10,
    width: Titanium.UI.FILL,
    borderColor: '#999',
    borderWidth: 1
  });
  containerView.add(predicateEditorView);

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
  predicateEditorView.add(table);

  return win;
};
