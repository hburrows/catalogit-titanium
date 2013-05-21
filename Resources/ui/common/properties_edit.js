var _ = require('vendor/underscore');

var defaultFontSize = Ti.Platform.name === 'android' ? 15 : 13;
var LARGE_FONT_SIZE = Ti.Platform.name === 'android' ? 18 : 16;

function createEditorForProperty(rowView, property, obj) {

  "use strict";

  var view = null;

  switch(property.range) {

    case 'http://www.w3.org/2001/XMLSchema#date':

      /*
      view = Ti.UI.createView({
        left: 10, top: 0,
        width: Ti.UI.FILL, height: 20,
        borderWidth: 1, borderColor: '#bbb', borderRadius: 5        
      });
      */
      rowView.setHasChild(true);

      break;

    case 'http://www.w3.org/2001/XMLSchema#decimal':

      var ok = Titanium.UI.createButton({
          title : 'OK',
          style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
      });

      var cancel = Titanium.UI.createButton({
          systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
      });
      
      var flexSpace = Titanium.UI.createButton({
          systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
      });

      view = Ti.UI.createTextField({
        left: 0, top: 0,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        keyboardType: Ti.UI. KEYBOARD_DECIMAL_PAD,
        returnKeyType: Ti.UI.RETURNKEY_DONE,
        keyboardToolbar : [cancel, flexSpace, ok],
        hintText: property.comment,
        font: {fontSize: defaultFontSize}
      });

      if (obj) {
        view.setValue(obj);
      }

      ok.addEventListener('click', function (e) {
        view.blur();   
      });

      cancel.addEventListener('click', function (e) {
        view.blur();   
      });

      break;

    case 'http://www.w3.org/2001/XMLSchema#string':
    default:

      var done = Titanium.UI.createButton({
        systemButton : Titanium.UI.iPhone.SystemButton.DONE
      });
      done.addEventListener('click', function (e) {
      });
      
      var prev = Titanium.UI.createButton({
          title : 'Prev',
          style : Titanium.UI.iPhone.SystemButtonStyle.BAR
      });
      prev.addEventListener('click', function (e) {
      });
      
      var next = Titanium.UI.createButton({
          title : 'Next',
          style : Titanium.UI.iPhone.SystemButtonStyle.BAR
      });      
      next.addEventListener('click', function (e) {
      });
      
      var flexSpace = Titanium.UI.createButton({
        systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
      });
      
      view = Ti.UI.createTextArea({
        left: 0, top: 0,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        borderWidth: 1, borderColor: '#bbb', borderRadius: 5,        
        keyboardType: Ti.UI.KEYBOARD_DEFAULT,
        returnKeyType: Ti.UI.RETURNKEY_DONE,
        keyboardToolbar : [prev, next, flexSpace, done],
        textAlign: 'left',
        hintText: property.comment,
        autocorrect: false,
        font: {
          fontFamily: 'Arial',
          fontSize: 16
        }             
      });

      if (obj) {
        view.setValue(obj);
      }

      break;
  }

  return view;
}

function createEditorForContainer(rowView, property, label) {

  var view = Ti.UI.createLabel({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.SIZE,
    text: 'List of ' + label
  });
  rowView.setHasChild(true);

  return view; 
}

module.exports = function (win, entryModel) {

  "use strict";

  var GLOBALS = require('globals');

  var self = Ti.UI.createView({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.SIZE,
    layout: 'vertical'
  });

  // ENTRY TYPE CAPTION
  //
  var entryType = Ti.UI.createView({
    left:0, top: 5, bottom: 5,
    width: Ti.UI.FILL, height: Ti.UI.SIZE ,
    layout: 'horizontal'   
  });
  self.add(entryType);

  var classValue = Ti.UI.createLabel({
    left: 0, top: 10,
    text: entryModel.getClass().name,
    font: {fontSize: LARGE_FONT_SIZE, fontWeight: 'bold'}
  });
  entryType.add(classValue);

  classValue.addEventListener('click', function () {
    self.fireEvent('class:change');
  });

  // TABLE
  //
  var tableView = Ti.UI.createTableView({
    left: 0, top: 20,
    width: Ti.UI.FILL, height: Ti.UI.SIZE,
    borderWidth: 1, borderColor: '#999', borderRadius: 15,
    scrollable: false
  });
  self.add(tableView);

  var groupIdx, groupMax,
      idx, max,
      groupProperties,
      sections = [],
      rowView, title, description;

  // iterate the class hierarchy
  for (groupIdx = 0, groupMax = entryModel.schema.length; groupIdx < groupMax; groupIdx += 1) {

    var section = Ti.UI.createTableViewSection({
      headerTitle: entryModel.schema[groupIdx].name
    });

    // skip the Entry class since we handle it in a special way.  The Entry
    // class is what holds all the media for an entry, the entry's create and
    // update times, etc.    
    if (entryModel.schema[groupIdx].id === 'http://example.com/rdf/schemas/Entry') {
      continue;
    }

    groupProperties = entryModel.schema[groupIdx].properties;

    // skip if there are no properties and not the last group.  The
    // last groups needs to be present to hold the 'add more properties'
    // control
    if (groupProperties.length === 0 && groupIdx < groupMax - 1) {
      continue;
    }

    // iterate the properties
    for (idx = 0, max = groupProperties.length; idx < max; idx += 1) {

      var label = groupProperties[idx].label,
          pred = groupProperties[idx].property,
          obj = entryModel.getProperty(pred),
          editorView; 

      rowView = Ti.UI.createTableViewRow({
        className: 'propertyRow'
      });

      rowView._cit_property = groupProperties[idx];
      rowView._cit_pred = pred;
      rowView._cit_type = groupProperties[idx].type;
      rowView._cit_range = groupProperties[idx].range;

      var predicateObjectView = Ti.UI.createView({
        left: 10, top: 10, right: 10, bottom:5,
        height: Ti.UI.SIZE, width: Ti.UI.FILL,
        layout: 'vertical'
      });
      rowView.add(predicateObjectView);

      var predicateView = Ti.UI.createLabel({
        left: 0, top: 0,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        text: groupProperties[idx].label
      });
      predicateObjectView.add(predicateView);

      switch(groupProperties[idx].type) {

        case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property':
        case 'http://www.w3.org/2002/07/owl#DatatypeProperty':

          editorView = createEditorForProperty(rowView, groupProperties[idx], obj);
          if (editorView !== null) {
            predicateObjectView.add(editorView);
          }

          break;
        case 'http://www.w3.org/2002/07/owl#ObjectProperty':

          rowView.setHasChild(true);
 
          break;

        case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq':
          editorView = createEditorForContainer(rowView, groupProperties[idx].range, label);
          if (editorView !== null) {
            predicateObjectView.add(editorView);
          }
          break;
          
        default:
          break;
      }

      description = Ti.UI.createLabel({
        left: 0, top: 0,
        text: groupProperties[idx].comment,
        font: {fontSize: 9}
      });
      predicateObjectView.add(description);

      section.add(rowView);
    }
    
    sections.push(section);
 
  }

  //
  // ADD MORE - insert an "add more" item in the last section
  //
  rowView = Ti.UI.createTableViewRow({
    bottom: 10,
    className: 'propertyRow',
    layout: 'vertical'
  });

  predicateObjectView = Ti.UI.createView({
    left: 10, top: 10, right: 10,
    height: Ti.UI.SIZE, width: Ti.UI.FILL,
    layout: 'vertical'
  });
  rowView.add(predicateObjectView);

  predicateView = Ti.UI.createLabel({
    left: 0, top: 0, bottom: 0,
    width: Ti.UI.FILL, height: Ti.UI.SIZE,
    text: 'add field'
  });
  predicateObjectView.add(predicateView);

  sections[sections.length-1].add(rowView);

  tableView.setData(sections);

  tableView.addEventListener('click', function(e) {

    var row = e.row;
    
    var property = row._cit_property;
    var type = row._cit_type;
    var range = row._cit_range;
    var pred = row._cit_pred;

    switch(type) {

      case 'http://www.w3.org/2002/07/owl#DatatypeProperty':

        switch(range) {

          case 'http://www.w3.org/2001/XMLSchema#date':
    
            var createDatePicker = require('ui/common/date_picker'),
                picker = createDatePicker(win, win, null, new Date(), new Date(), { win: win, owner: win, startDate: null, endDate: new Date(), nowDate: new Date()});
    
            picker.show();
                
            break;
            
          case 'http://www.w3.org/2001/XMLSchema#decimal':
            break;

          case 'http://www.w3.org/2001/XMLSchema#string':
            break;
 
          default:
            break;
        }
        break;

      case 'http://www.w3.org/2002/07/owl#ObjectProperty':

        alert('Open editor for picking/creating new ' + property.label + '; type: ' + property.range);
        break;

      case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq':
        alert('Display editor for adding/removing ' + property.label + ' items; type: ' + property.range);
        break;
 
      default:
        break;     
    }
 

  });

  return {

    view: self,
    model: entryModel,

    updateModelFromForm: function() {

      if (GLOBALS.uploadPending) {
        alert("Upload pending.  Please try again later");
        return;
      }

      // for each section
      var sectionIdx, sectionMax;
      for (sectionIdx = 0, sectionMax = tableView.sections.length; sectionIdx < sectionMax; sectionIdx += 1) {

        var section = tableView.sections[sectionIdx];

        var rowIdx, rowMax;
        for (rowIdx = 0, rowMax = section.rows.length; rowIdx < rowMax; rowIdx += 1) {

          var row = section.rows[rowIdx];
          
          var type = row._cit_type;
          var range = row._cit_range;
          var pred = row._cit_pred;

          switch(type) {

            case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property':
            case 'http://www.w3.org/2002/07/owl#DatatypeProperty':
            
              var view = row.children[0].children[1];
                
              switch(range) {
                
                case 'http://www.w3.org/2001/XMLSchema#date':
                  break;

                case 'http://www.w3.org/2001/XMLSchema#decimal':
                case 'http://www.w3.org/2001/XMLSchema#string':
                default:
                  var objectValue = view.getValue();
                  if (objectValue && objectValue.length > 0) {
                    this.model.setProperty(pred, objectValue);
                  }
                  break; 
              }
              break;

            case 'http://www.w3.org/2002/07/owl#ObjectProperty':
              break;
          }
        }
      }
    }
  };
}
