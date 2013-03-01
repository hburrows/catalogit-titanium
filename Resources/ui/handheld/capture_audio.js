module.exports = function () {

  "use strict";

  Titanium.Media.audioSessionMode = Ti.Media.AUDIO_SESSION_MODE_PLAY_AND_RECORD;
  var recorder = Ti.Media.createAudioRecorder({
    success:function(event) {
      Ti.UI.createAlertDialog({
        title:'Audio Recording',
        message:'Success!!!'
      }).show();                    
      return; 
    }   
  });
  
  var recording = null;
    
  var win = Titanium.UI.createWindow({
    backgroundColor:'#336699'
  });

  // initialize to all modes
  win.orientationModes = [
    Titanium.UI.PORTRAIT,
    Titanium.UI.LANDSCAPE_LEFT,
    Titanium.UI.LANDSCAPE_RIGHT
  ];

  var b1 = Titanium.UI.createButton({
    title:'Close',
    height:40,
    width:300,
    bottom:10
  });
  
  win.add(b1);
  
  b1.addEventListener('click', function () {
    win.close();
  });

  var start = Titanium.UI.createButton({
    title:'Start Recording',
    height:40,
    width:300,
    top:10
  });
  win.add(start);
 
  start.addEventListener('click', function () {
    recorder.start();
  });
  
  var stop = Titanium.UI.createButton({
    title:'Stop Recording',
    height:40,
    width:300,
    top:60
  });
  win.add(stop);
 
  stop.addEventListener('click', function () {
    recording = recorder.stop();
  });

  var playback = Titanium.UI.createButton({
    title:'Playback Recording',
    height:40,
    width:300,
    top:110
  });
  win.add(playback);
 
  stop.addEventListener('click', function () {
    recording = recorder.stop();
    if (recording) {
      
    }
  });

  return win;
};
