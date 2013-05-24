/**
 * @author Howard Burrows
 */

module.exports = (function() {

  "use strict";

  var GLOBALS = require('globals'),
      DEFAULT_BORDER_RADIUS = 3;

  return {
    
    createLiteralEditor: function (property, data, options) {

      var view = null,
          done, flexSpace;

       switch(property.range) {
    
        case 'http://www.w3.org/2001/XMLSchema#dateTime':
  
          // convert obj in to datetime string if exists  
          view = Ti.UI.createTextField({
            left: 0, top: 0, bottom: 2,
            width: Ti.UI.FILL, height: Ti.UI.SIZE,
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            hintText: property.comment,
            font: {fontSize: GLOBALS.DEFAULT_FONT_SIZE},
            value: data ? new Date(parseInt(data, 10) * 1000).toLocaleString() : '',
            enabled: false
          });

          if (options && options.row) {
            options.row.setHasChild(true);
          }
    
          break;
    
        case 'http://www.w3.org/2001/XMLSchema#integer':

          done = Titanium.UI.createButton({
              title : 'Done',
              style : Titanium.UI.iPhone.SystemButtonStyle.DONE
          });
    
          flexSpace = Titanium.UI.createButton({
              systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
          });
    
          view = Ti.UI.createTextField({
            left: 0, top: 0, bottom: 2,
            width: Ti.UI.FILL, height: Ti.UI.SIZE,
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            keyboardType: Ti.UI. KEYBOARD_NUMBER_PAD,
            returnKeyType: Ti.UI.RETURNKEY_DONE,
            keyboardToolbar : [flexSpace, done],
            hintText: property.comment,
            font: {fontSize: GLOBALS.DEFAULT_FONT_SIZE},
            value: data || ''
          });
    
          done.addEventListener('click', function (e) {
            view.blur();   
          });
    
          break;

        case 'http://www.w3.org/2001/XMLSchema#decimal':
    
          done = Titanium.UI.createButton({
              title : 'Done',
              style : Titanium.UI.iPhone.SystemButtonStyle.DONE
          });
    
          flexSpace = Titanium.UI.createButton({
              systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
          });
    
          view = Ti.UI.createTextField({
            left: 0, top: 0, bottom: 2,
            width: Ti.UI.FILL, height: Ti.UI.SIZE,
            borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
            keyboardType: Ti.UI. KEYBOARD_DECIMAL_PAD,
            returnKeyType: Ti.UI.RETURNKEY_DONE,
            keyboardToolbar : [flexSpace, done],
            hintText: property.comment,
            font: {fontSize: GLOBALS.DEFAULT_FONT_SIZE},
            value: data || ''
          });
    
          done.addEventListener('click', function (e) {
            view.blur();   
          });
    
          break;
    
        case 'http://www.w3.org/2001/XMLSchema#string':
        default:
    
          done = Titanium.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.DONE
          });
     
          var prev = Titanium.UI.createButton({
              title : 'Prev',
              style : Titanium.UI.iPhone.SystemButtonStyle.BAR
          });
    
          var next = Titanium.UI.createButton({
              title : 'Next',
              style : Titanium.UI.iPhone.SystemButtonStyle.BAR
          });      
    
          flexSpace = Titanium.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
          });
          
          if (property.oneOf) {

            view = Ti.UI.createTextField({
              left: 0, top: 0, bottom: 2,
              width: Ti.UI.FILL, height: Ti.UI.SIZE,
              borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
              hintText: property.comment,
              font: {fontSize: GLOBALS.DEFAULT_FONT_SIZE},
              value: data || '',
              enabled: false
            });

            if (options && options.row) {
              options.row.setHasChild(true);
            }
          }
          else {
            view = Ti.UI.createView({
              left: 0, top: 0, bottom: 2,
              width: Ti.UI.FILL, height: Ti.UI.SIZE,
              layout: 'vertical'
            });

            var textAreaView = Ti.UI.createTextArea({
              left: 0, top: 0, bottom: 0,
              width: Ti.UI.FILL, height: Ti.UI.SIZE,
              borderWidth: 1, borderColor: '#bbb', borderRadius: DEFAULT_BORDER_RADIUS,        
              keyboardType: Ti.UI.KEYBOARD_DEFAULT,
              returnKeyType: Ti.UI.RETURNKEY_DONE,
              keyboardToolbar : [prev, next, flexSpace, done],
              textAlign: 'left',
              hintText: property.comment,
              autocorrect: false,
              font: {fontSize: GLOBALS.DEFAULT_FONT_SIZE},
              value: data || ''             
            });
            view.add(textAreaView);
            
            var hintTextView = Ti.UI.createLabel({
              left: 0, top: 0, bottom: 0,
              width: Ti.UI.FILL, height: Ti.UI.SIZE,
              font: {fontSize: GLOBALS.SMALL_FONT_SIZE},
              color: '#999',
              text: property.comment        
            });
            view.add(hintTextView);
          }
          
          done.addEventListener('click', function (e) {
            textAreaView.blur();
          });
    
          prev.addEventListener('click', function (e) {
          });
          
          next.addEventListener('click', function (e) {
          });
    
          break;
      }

      return view;
    },
  
    createObjectEditor: function (property, data, options) {

      var view = Ti.UI.createTextField({
        left: 0, top: 0, bottom: 2,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        hintText: property.comment,
        font: {fontSize: GLOBALS.DEFAULT_FONT_SIZE},
        value: data ? 'Object ID: ' + data.id : '',
        enabled: false
      });

      if (options && options.row) {
        options.row.setHasChild(true);
      }

      return view;      
    },
  
    createSeqEditor: function (property, data, options) {

      var view = Ti.UI.createTextField({
        left: 0, top: 0, bottom: 2,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        hintText: property.comment,
        font: {fontSize: GLOBALS.DEFAULT_FONT_SIZE},
        value: data ? 'List of values' : '',
        enabled: false
      });

      if (options && options.row) {
        options.row.setHasChild(true);
      }

      return view;   
    },

    createEditorForProperty: function (property, data, options) {

      var view = null,
          comment = property.comment,
          range = property.range,
          predicate = property.property,
          classId = property.type,
          label = property.label;
 
      switch(property.type) {

        case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property':
        case 'http://www.w3.org/2002/07/owl#DatatypeProperty':
          view = this.createLiteralEditor(property, data);
          break;
          
        case 'http://www.w3.org/2002/07/owl#ObjectProperty':
          view = this.createObjectEditor(property, data);
          break;

        case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq':
          view = this.createSeqEditor(property, data);
          break;
          
        default:
          break;
      }

      return view;
    }
 
  };

}());
