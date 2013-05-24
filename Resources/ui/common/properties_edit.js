
module.exports = function (win, entryModel) {

  "use strict";

  var _ = require('vendor/underscore'),
      Backbone = require('vendor/backbone'),
      GLOBALS = require('globals'),
      editorFactory = require('ui/common/property_editor_factory');
  
  //
  // Update event handlers for various object types
  //
  function datetimeUpdated(e) {
    entryModel.setProperty(e.property, e.value);        
  }

  function enumerationUpdated(e) {
    entryModel.setProperty(e.property, e.value);        
  }

  function subjectUpdated(e) {
    entryModel.setProperty(e.property, e.value);        
  }

  function bNodeUpdated(e) {
    alert('Change bnode for:\n\n' + e.property + '\n\nto value:\n\n' + e.data);    
  }

  function sequenceUpdated(e) {
    alert('Change sequence for:\n\n' + e.property + '\n\nto value:\n\n' + e.data);    
  }

  // ---------------------------
  //
  // START view definition
  //
  // ---------------------------
  
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
    font: {fontSize: GLOBALS.LARGE_FONT_SIZE, fontWeight: 'bold'}
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
      rowView, title, description,
      containerView, labelView,
      labelFont = {fontSize: GLOBALS.MED_LARGE_FONT_SIZE, fontWeight: 'bold'};

  // iterate the class hierarchy
  for (groupIdx = 0, groupMax = entryModel.schema.length; groupIdx < groupMax; groupIdx += 1) {

    // skip the Entry class since we handle it in a special way.  The Entry
    // class is what holds all the media for an entry, the entry's create and
    // update times, tags, etc - core properties that everything has
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

    var section = Ti.UI.createTableViewSection({
      headerTitle: entryModel.schema[groupIdx].name
    });

    // iterate the properties
    for (idx = 0, max = groupProperties.length; idx < max; idx += 1) {

      var property = groupProperties[idx], 
          predObj = entryModel.getProperty(property.property),
          editorView; 

      if (!property) {
        throw "something is wrong";
      }

      rowView = Ti.UI.createTableViewRow({
        className: 'propertyEditRow',
        _cit_property: property
      });

      containerView = Ti.UI.createView({
        left: 10, top: 10, right: 10, bottom:5,
        height: Ti.UI.SIZE, width: Ti.UI.FILL,
        layout: 'vertical'
      });
      rowView.add(containerView);

      labelView = Ti.UI.createLabel({
        left: 0, top: 0,
        width: Ti.UI.FILL, height: Ti.UI.SIZE,
        font: labelFont,
        text: property.label
      });
      containerView.add(labelView);

      editorView = editorFactory.createEditorForProperty(property, predObj, {row: rowView});
      if (editorView) {
        containerView.add(editorView);
      }

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

  containerView = Ti.UI.createView({
    left: 10, top: 10, right: 10,
    height: Ti.UI.SIZE, width: Ti.UI.FILL,
    layout: 'vertical'
  });
  rowView.add(containerView);

  labelView = Ti.UI.createLabel({
    left: 0, top: 0, bottom: 0,
    width: Ti.UI.FILL, height: Ti.UI.SIZE,
    font: labelFont,
    text: 'Add Other Property'
  });
  containerView.add(labelView);

  sections[sections.length-1].add(rowView);

  tableView.setData(sections);

  tableView.addEventListener('click', function(e) {

    var row = e.row;
    
    var property = row._cit_property;
    if (!property) {
      alert('Add a new, custom property');
      return;
    }

    switch(property.type) {

      case 'http://www.w3.org/2002/07/owl#DatatypeProperty':

        switch(property.range) {

          case 'http://www.w3.org/2001/XMLSchema#dateTime':
    
            var createDatePicker = require('ui/common/date_picker'),
                datePicker = createDatePicker(win, property.property, null, new Date(), new Date());
    
            datePicker.root.addEventListener('datetime:update', datetimeUpdated);

            datePicker.show();
                
            break;
            
          case 'http://www.w3.org/2001/XMLSchema#decimal':
            break;

          case 'http://www.w3.org/2001/XMLSchema#string':
            if (property.oneOf) {
              var createEnumerationPicker = require('/ui/common/enumeration_picker'),
                  enumerationPicker = createEnumerationPicker(win, property.property, property.oneOf);
      
              enumerationPicker.root.addEventListener('enumeration:update', enumerationUpdated);

              enumerationPicker.show();
            }
            break;
 
          default:
            break;
        }
        break;

      case 'http://www.w3.org/2002/07/owl#ObjectProperty':

        if (property.bnode) {
          var createBNodeEditor = require('/ui/common/bnode_editor'),
              bnodeEditor = createBNodeEditor(win, property.property, property.range, {});
  
          bnodeEditor.root.addEventListener('bnode:update', bNodeUpdated);
          
          bnodeEditor.show();
        }
        else {
          var createSubjectPicker = require('/ui/common/subject_picker'),
              subjectPicker = createSubjectPicker(win, property.property, property.range);
          
          subjectPicker.root.addEventListener('subject:update', subjectUpdated);

          subjectPicker.show();          
        }
        break;

      case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq':
        var createSequenceEditor = require('/ui/common/seq_editor'),
            sequenceEditor = createSequenceEditor(win, property.property, property.range, null);

        sequenceEditor.root.addEventListener('sequence:update', sequenceUpdated);
        
        sequenceEditor.show();

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
          
          var property = row._cit_property;
          if (!property) {
            continue;
          }

          switch(property.type) {

            case 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property':
            case 'http://www.w3.org/2002/07/owl#DatatypeProperty':
            
              var view = row.children[0].children[1];
                
              switch(property.range) {
                
                case 'http://www.w3.org/2001/XMLSchema#date':
                  break;

                case 'http://www.w3.org/2001/XMLSchema#decimal':
                  break;

                case 'http://www.w3.org/2001/XMLSchema#string':
                default:

                  // this handles textareas which are wrapped in a container view to
                  // accomodate hintText
                  if (view.children && view.children.length > 0) {
                    view = view.children[0];
                  }

                  var objectValue = view.getValue();
                  if (objectValue && objectValue.length > 0) {
                    this.model.setProperty(property.property, objectValue);
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
