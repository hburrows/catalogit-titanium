module.exports = function () {

  "use strict";
    
  var win = Titanium.UI.createWindow({
    backgroundColor:'#cccccc'
  });

  // initialize to all modes
  win.orientationModes = [
    Titanium.UI.PORTRAIT,
    Titanium.UI.LANDSCAPE_LEFT,
    Titanium.UI.LANDSCAPE_RIGHT
  ];

  var description = Titanium.UI.createLabel({
    color:'#000',
    text:'This page is for creating and editing the notes and properties of the picture',
    top:50,
    left:30,
    width:'auto',
    height:'auto'
  });
  
  win.add(description);

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

  return win;
};
