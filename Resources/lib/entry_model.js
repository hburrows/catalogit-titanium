"use strict";

var _ = require('vendor/underscore');
var Backbone = require('vendor/backbone');
var createHTTPClient = require('lib/http_client_wrapper');
var GLOBALS = require('globals');

/*
var json_layout = {
  id: '<<uri for entry>>',
  type: '<<uri for type>>',   // optional if schema is present
  data: [{predicate: '', object: ''}, ...],
  schema: [
    {name:'', comment:'', classUri:'', properties: [{...}]}
  ]
}
*/

/*
 * Utility classes
 */

/*
 * ObjectModel represents entities that consist of
 *  id
 *  type
 *  data - a dictionary of predicate/object objects.  Multiple predicate values are stored in a list
 *  schema - full schema describing the type
 * 
 * ObjectModels store ObjectModels
 * 
 * Type and schema are the same.  However, type is simple and lightweight whereas schema
 * is heavy and expensive.  When posting data to server and getting lists of data the
 * schema attribute is usually null. 
 */
module.exports = Backbone.Model.extend({

  initialize: function (options) {

    this.id = options.id || null;     // unique iri (i.e. identifier) for instance
    this.data = options.data || {}; // predicate/object data for instance

    this.schema = options.schema;     // list of class definitions transitively connected by subClassOf property

    // ensure that a schema exists and it has a RDF['type'] property
    if (!this.schema) {
      throw "Missing required schema";
    }

    // get the type from the schema
    this.type = _.last(this.schema).classUri;
    if (!this.type) {
      throw "Missing required schema classUri";
    }

    // get the type from the data.  If it doesn't exist set it to the 
    // schemas type; otherwise confirm a match
    var val = this.data['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'];
    if (!val) {
      this.addProperty('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', this.type);
    }
    else {
      // confirm the schema and object type are aligned
      if (val !== this.type) {
        throw "Object type and schema mismatch";
      }
    }

    this.media = [];
  },
 
  toJSON: function () {
    return {
      id: this.id,
      data: this.data
    };
  },

  // The schema is a list of type definitions linked via the subClassOf property.  The
  // last item in the list represents the type of the instance
  
  getClassURI: function () {
    return _.last(this.schema).classUri;
  },
  
  getClass: function () {
    return _.last(this.schema);      
  },

  subsumeMedia: function (media_json) {
    this.media.push(media_json);
  },

  // predicate/object pair must not already exist; otherwise
  // the pair is added.  Will add multiple values for given predicate
  addProperty: function(predicate, object) {

    var val = this.data[predicate];
    if (val) {
      if (_.isArray(val) && val._pred_obj_array) {
        if (_.contains(val,object)) {
          throw "duplicate predicate/object pair";
        }
      }
      else {
        val = [val];
        val._pred_obj_array = true;
      }
      val.push(object);
    }
    else {
      this.data[predicate] = object;
    }

    return;
  },

  // assumes the predicate is only represented once.  If there
  // are more then one value for the predicte will throw an error
  setProperty: function(predicate, object) {

    var val = this.data[predicate];
    
    if (val) {
      if (_.isArray(val) && val._pred_obj_array) {
        throw 'setProperty - mutiple values exist for predicate';
      }
    }

    this.data[predicate] = object;

    return;
  },

  // remove predicate/object pair from dictionary.  No error
  // if pair doesn't exist
  removeProperty: function(predicate, object) {

    var val = this.data[predicate];
    if (val) {
      if (val === object) {
        delete this.data[predicate];
      }
      else {
        if (_.isArray(val) && val._pred_obj_array) {
          if (_.contains(val,object)) {
            val = _.without(val, object);
          }
        }
      }
    }
    
  },

  _createStillImage: function (image) {
    return {
      type: 'http://example.com/rdf/schemas/StillImage',
      data: {
        'http://example.com/rdf/schemas/location': {
          type: 'http://www.w3.org/2003/01/geo/wgs84_pos#Point',
          data: {
            'http://www.w3.org/2003/01/geo/wgs84_pos#lat': 0,
            'http://www.w3.org/2003/01/geo/wgs84_pos#long': 0
          }
        },
        'http://example.com/rdf/schemas/images': {
          type: 'http://example.com/rdf/schemas/StillImageSeq',
          data: [
            {
              type: 'http://purl.org/dc/dcmitype/StillImage',
              data: {
                'http://example.com/rdf/schemas/stillImageType': 'original',
                'http://example.com/rdf/schemas/stillImageURL': image.original.url,
                'http://example.com/rdf/schemas/stillImageWidth': image.original.width,
                'http://example.com/rdf/schemas/stillImageHeight': image.original.height
              }
            }, 
            {
              type: 'http://purl.org/dc/dcmitype/StillImage',
              data: {
                'http://example.com/rdf/schemas/stillImageType': 'thumbnail',
                'http://example.com/rdf/schemas/stillImageURL': image.thumbnail.url,
                'http://example.com/rdf/schemas/stillImageWidth': image.thumbnail.width,
                'http://example.com/rdf/schemas/stillImageHeight': image.thumbnail.height
              }
            }
          ]
        }            
      }
    };
  },

  _packageMedia: function () {

    var mediaData = [];

    // for each image
    var idx, idxMax;
    for (idx = 0, idxMax = this.media.length; idx < idxMax; idx += 1) {

      var media = this.media[idx],
          el = null;

      switch(media.type) {
        case "stillImage":
          el = this._createStillImage(media);
          break;
        default:
          break;
      }

      if (el) {
        mediaData.push(el);
      }
    }

    this.setProperty('http://example.com/rdf/schemas/media', {type: 'type: http://example.com/rdf/schemas/MediaContainer', data: mediaData});    
  },

  createEntry: function (options) {

    if (this.id !== null) {
      throw "create: entry has already been created";
    }

    this._packageMedia();

    var xhr = createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {

        var response = JSON.parse(this.responseText);

        if (options && options.success) {
          options.success('create', response);
        }
      },
      
      onerror: function (e) {

        if (this._cit_handle_error) {
          this._cit_handle_error(e);
        }

        if (options && options.error) {
          options.error('create');
        }
      },
      

      timeout : 30000  // in milliseconds

    });

    xhr.open('POST', GLOBALS.api.ENTRIES_RESOURCE);
    xhr.send(JSON.stringify(this.toJSON()));  

  },

  updateEntry: function (options) {

    if (this.id === null) {
      throw "update: entry has not been created";
    }

    var xhr = createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {

        var response = JSON.parse(this.responseText);

        if (options && options.success) {
          options.success('update', response);
        }
      },
      
      onerror: function (e) {
        this.__cit_handle_error(e);
        if (options && options.error) {
          options.error('create');
        }
      },
      

      timeout : 30000  // in milliseconds

    });

    xhr.open('PUT', GLOBALS.api.ENTRIES_RESOURCE.replace('%entry_id%', this.id));
    xhr.send(JSON.stringify(this.toJSON()));  
  },

  deleteEntry: function (options) {
    if (this.id === null) {
      throw "delete: entry has not been created";
    }

    var xhr = createHTTPClient({
      
      // function called when the response data is available
      onload : function(e) {
        if (options && options.success) {
          options.success('delete');
        }
      },
      
      onerror: function (e) {
        this.__cit_handle_error(e);
        if (options && options.error) {
          options.error('create');
        }
      },
      

      timeout : 30000  // in milliseconds

    });

    xhr.open('DELETE', GLOBALS.api.ENTRIES_RESOURCE.replace('%entry_id%', this.id));
    xhr.send();  
  }

});
