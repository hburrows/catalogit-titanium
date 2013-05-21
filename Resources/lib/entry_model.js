"use strict";

var _ = require('vendor/underscore');
var Backbone = require('vendor/backbone');
var createHTTPClient = require('lib/http_client_wrapper');
var GLOBALS = require('globals');

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

    this.schema = options.schema || null;     // list of class definitions transitively connected by subClassOf property

    // ensure that a schema exists and it has a RDF['type'] property
    if (!this.schema) {
      throw "Missing required schema";
    }

    // get the type from the schema
    this.type = _.last(this.schema).id;
    if (!this.type) {
      throw "Missing required schema";
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
      type: this.data['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],   // not necessary but added for good measure
      data: this.data
    };
  },

  setSchema: function (schema) {
    this.schema = schema;
    this.data['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] = this.getClass().id;
  },

  // The schema is a list of type definitions linked via the subClassOf property.  The
  // last item in the list represents the type of the instance
  
  getClass: function () {
    return _.last(this.schema);      
  },

  subsumeMedia: function (media_id, media_data, media_schema) {
    this.media.push({id: media_id, data: media_data, schema: media_schema});
  },

  getProperty: function(predicate) {
    return this.data[predicate];
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

  getThumbnail: function () {

    var media = this.data['http://example.com/rdf/schemas/media'];
    if (!media || media.length === 0) { return null; }

    // find the first StillImage
    var firstStillImage = _.find(media, function (el) {
      return el.data['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] === 'http://example.com/rdf/schemas/StillImage';
    });
        
    var images = firstStillImage.data['http://example.com/rdf/schemas/images'];
    if (!images || images.length === 0) {
      return null;
    }

    // find the first thumbnail
    var thumbnail = _.find(images, function (el) {
      return el.data['http://example.com/rdf/schemas/stillImageType'] === 'thumbnail';
    });

    return thumbnail.data['http://example.com/rdf/schemas/stillImageURL'];
  },

  _createStillImage: function (image) {
    return {
      data: {
        'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'http://example.com/rdf/schemas/StillImage',
        'http://example.com/rdf/schemas/location': {
          data: {
            'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'http://www.w3.org/2003/01/geo/wgs84_pos#Point',
            'http://www.w3.org/2003/01/geo/wgs84_pos#lat': 0,
            'http://www.w3.org/2003/01/geo/wgs84_pos#long': 0
          }
        },
        'http://example.com/rdf/schemas/images': {
          type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq',
          data: [
            {
              data: {
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'http://purl.org/dc/dcmitype/StillImage',
                'http://example.com/rdf/schemas/stillImageType': 'original',
                'http://example.com/rdf/schemas/stillImageURL': image.original.url,
                'http://example.com/rdf/schemas/stillImageWidth': image.original.width,
                'http://example.com/rdf/schemas/stillImageHeight': image.original.height
              }
            }, 
            {
              data: {
                'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': 'http://purl.org/dc/dcmitype/StillImage',
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
          id = media.id,
          data = media.data,
          schema = media.schema,
          el = null;

      if (id !== null) {
        el = {id: id};
      }
      else {
        switch(data.type) {
          case "http://example.com/rdf/schemas/StillImage":
            el = this._createStillImage(data);
            break;
          default:
            break;
        }
      }

      if (el) {
        mediaData.push(el);
      }
    }

    this.setProperty('http://example.com/rdf/schemas/media', {type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq', data: mediaData});    
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
        this._cit_handle_error(e);
        if (options && options.error) {
          options.error('create');
        }
      },
      

      timeout : 30000  // in milliseconds

    });

    var resource = GLOBALS.api.ENTRY_RESOURCE.replace('%entry_id%', this.id);

    xhr.open('PUT', resource);
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
        this._cit_handle_error(e);
        if (options && options.error) {
          options.error('create');
        }
      },
      

      timeout : 30000  // in milliseconds

    });

    xhr.open('DELETE', GLOBALS.api.ENTRY_RESOURCE.replace('%entry_id%', this.id));
    xhr.send();  
  }

});
