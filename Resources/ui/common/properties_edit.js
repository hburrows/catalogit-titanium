var _ = require('vendor/underscore');

var defaultFontSize = Ti.Platform.name === 'android' ? 15 : 13;
var LARGE_FONT_SIZE = Ti.Platform.name === 'android' ? 18 : 16;

function createEditorForProperty(rowView, property) {

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

      ok.addEventListener('click', function (e) {
        view.blur();   
      });

      cancel.addEventListener('click', function (e) {
        view.blur();   
      });

      break;

    case 'http://www.w3.org/2001/XMLSchema#string':
    default:

      view = Ti.UI.createTextArea({
        left: 0, top: 0,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        borderWidth: 1, borderColor: '#bbb', borderRadius: 5,        
        keyboardType: Ti.UI.KEYBOARD_DEFAULT,
        returnKeyType: Ti.UI.RETURNKEY_DONE,
        textAlign: 'left',
        hintText: property.comment        
      });

      break;
  }

  return view;
}

function createEditorForContainer(rowView, property) {

  var view = Ti.UI.createLabel({
    left: 0, top: 0,
    width: Ti.UI.FILL, height: Ti.UI.SIZE,
    text: 'list, of, tags'
  });
  rowView.setHasChild(true);

  return view; 
}

module.exports = function (win, entryModel) {

  "use strict";

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

  var classLabel = Ti.UI.createLabel({
    left: 0, top: 10,
    text: 'Type: ',
    font: {fontSize: LARGE_FONT_SIZE}
  });
  entryType.add(classLabel);

  var classValue = Ti.UI.createLabel({
    left: 0, top: 10,
    text: entryModel.getClass().name,
    font: {fontSize: LARGE_FONT_SIZE, fontWeight: 'bold'}
  });
  entryType.add(classValue);

  classValue.addEventListener('click', function () {
    this.fireEvent('class:change');
  });

  // TABLE
  //
  var tableView = Ti.UI.createTableView({
    left: 0, top: 10,
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

  // iterate the groups
  for (groupIdx = 0, groupMax = entryModel.schema.length; groupIdx < groupMax; groupIdx += 1) {

    var section = Ti.UI.createTableViewSection({
      headerTitle: entryModel.schema[groupIdx].name
    });

    // skip the Entry class since we handle it in a special way.  The Entry
    // class is what holds all the media for an entry    
    if (entryModel.schema[groupIdx].classUri === 'http%3A//example.com/rdf/schemas/Entry') {
      continue;
    }

    groupProperties = entryModel.schema[groupIdx].properties;

    // skip if there are no properties and not the last group
    if (groupProperties.length === 0 && groupIdx < groupMax - 1) {
      continue;
    }

    // iterate the properties
    for (idx = 0, max = groupProperties.length; idx < max; idx += 1) {

      rowView = Ti.UI.createTableViewRow({
        className: 'propertyRow'
      });

      rowView._cit_property = groupProperties[idx].property
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

          editorView = createEditorForProperty(rowView, groupProperties[idx]);
          if (editorView !== null) {
            predicateObjectView.add(editorView);
          }

          break;
        case 'http://www.w3.org/2002/07/owl#ObjectProperty':

          // check if domain ancestory has a Container
          var containerType = _.contains(groupProperties[idx].ancestors,'http://www.w3.org/2000/01/rdf-schema#Container');
          if (containerType) {
            editorView = createEditorForContainer(rowView, groupProperties[idx].range);
            if (editorView !== null) {
              predicateObjectView.add(editorView);
            }
          }
          else {
            rowView.setHasChild(true);
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
    
    var type = row._cit_type;
    var range = row._cit_range;
    var property = row._cit_property;

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
          default:
            break;
        }
        break;

      case 'http://www.w3.org/2002/07/owl#ObjectProperty':

        alert('open modal for picking/creating new secondary property');
        break;

      default:
        break;     
    }
 

  });

  return {

    view: self,
    model: entryModel,
    
    postEditsToModel: function() {

      // for each section
      var sectionIdx, sectionMax;
      for (sectionIdx = 0, sectionMax = tableView.sections.length-1; sectionIdx < sectionMax; sectionIdx += 1) {

        var section = tableView.sections[sectionIdx];

        var rowIdx, rowMax;
        for (rowIdx = 0, rowMax = section.rows.length; rowIdx < rowMax; rowIdx += 1) {

          var row = section.rows[rowIdx];
          
          var type = row._cit_type;
          var range = row._cit_range;
          var property = row._cit_property;

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
                    this.model.setProperty(property, objectValue);
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
  }
}