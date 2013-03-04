module.exports = function (entry_id) {

  "use strict";
    
  var win = Titanium.UI.createWindow({
    backgroundColor:'#fff'
  });

  win.title = 'Picture Details';
  win.barColor = 'black';

  // initialize to all modes
  win.orientationModes = [
    Titanium.UI.PORTRAIT,
    Titanium.UI.LANDSCAPE_LEFT,
    Titanium.UI.LANDSCAPE_RIGHT
  ];

  // CANCEL
  var cancelButton = Titanium.UI.createButton({
    title:'Cancel',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  win.setLeftNavButton(cancelButton);

  cancelButton.addEventListener('click', function () {
    win.close();
  });
  
  // DONE
  var doneButton = Titanium.UI.createButton({
    title:'Done',
    style:Titanium.UI.iPhone.SystemButtonStyle.PLAIN
  });
  win.setRightNavButton(doneButton);
  
  doneButton.addEventListener('click', function () {
    w.close();
  });


  //
  // -- 
  //
  var padding = 10;

  //
  // -- MEDIA INFO VIEW
  //
  var mediaInfoViewTop = 20,
      mediaInfoHeight = 50;
  var mediaInfoView = Titanium.UI.createView({
    left: '3%',
    right: '3%',
    top: '3%',
    height: '25%',
    borderColor: '#999',
    borderWidth: 1
  });
  win.add(mediaInfoView);

  var photoView = Titanium.UI.createImageView({
    left: 0,
    width: '25%',
    height: '25%',
  });
  mediaInfoView.add(photoView);

  //
  // -- SUBJECT IDENTIFIER VIEW
  //
  var subjectIdentifierTop = mediaInfoViewTop + mediaInfoHeight + padding,
      subjectIdentifierHeight = 30;
  var subjectIdentifierView = Titanium.UI.createView({
    left: '3%',
    right: '3%',
    top: '31%',
    height: '10%',
  });
  win.add(subjectIdentifierView);

  var newSubjectButton = Titanium.UI.createButton({
    title: 'New',
    left: 0,
    width: '49%',
    height: 'auto',
  });
  subjectIdentifierView.add(newSubjectButton);

  newSubjectButton.addEventListener('click', function (e) {
    alert('create new subject');
  })
  
  var existingSubjectButton = Titanium.UI.createButton({
    title: 'Existing',
    left: '51%',
    width: '49%',
    height: 'auto',    
  });
  subjectIdentifierView.add(existingSubjectButton);

  existingSubjectButton.addEventListener('click', function (e) {
    alert('pick existing subject');
  })

  //
  // -- PREDICATE EDITOR VIEW
  //
  var predicateEditorTop = subjectIdentifierTop + subjectIdentifierHeight + padding;
      predicateEditorHeight = 100;
  var predicateEditorView = Titanium.UI.createView({
    left: '3%',
    right: '3%',
    top: '44%',
    height: 'auto',
    borderColor: '#999',
    borderWidth: 1
  });
  win.add(predicateEditorView);

/*
  var close = Titanium.UI.createButton({
    title:'Close',
    height:40,
    width:300,
    bottom:10
  });
  win.add(close);
 
  close.addEventListener('click', function () {
    win.close();
  });
*/

  return win;
};
