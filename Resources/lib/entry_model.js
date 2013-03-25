

var _ = require('vendor/underscore');
var Backbone = require('vendor/backbone');
var createHTTPClient = require('lib/http_client_wrapper');
var GLOBALS = require('globals');

/*
var json_layout = {
  uri: '<<uri for entry>>',
  values: [{predicate: '', object: ''}, ...],
  schema: [
    {name:'', comment:'', classUri:'', properties: [{...}]}
  ]
}
*/

var PredicateObjectModel = Backbone.Model.extend({
});

var PredicateObjectCollection = Backbone.Collection.extend({

  model: PredicateObjectModel,

  initialize: function (models, options) {
  }

});

module.exports = function (uri, values, schema) {

  "use strict";

  if (!schema) {
    throw "missing required schema";
  }

  return {

    uri: uri,
    values: values || [],
    schema: schema,

    getClassUri: function () {
      return _.last(this.schema).classUri;
    },

    getClass: function () {
      return _.last(this.schema);      
    },

    toJSON: function () {
      var jsonStr = JSON.stringify({uri:this.uri, values: this.values});
      return jsonStr;
    },

    addProperty: function(predicate, object) {

      // check if value already exists
      var matches = _.where(this.values, {predicate: predicate});
      if (matches.length > 0) {
        matches = _.where(matches, {object: object});
        if (matches.length > 0) {
          throw "duplicate predicate/object pair";
        }
      }

      this.values.push({predicate: predicate, object: object});

      return;
    },

    updateProperty: function(predicate, object) {
      var match = _.findWhere(this.values, {predicate: predicate, object: object});
      if (match) {
        match.object = object;
      } else {
        throw "predicate/object pair not found";
      }

    },

    setProperty: function(predicate, object) {
      var match = _.findWhere(this.values, {predicate: predicate, object: object});
      if (match) {
        match.object = object;
      } else {
        this.values.push({predicate: predicate, object: object});
      }
    },

    removeProperty: function(predicate, object) {

      var matches = _.where(this.values, {predicate: predicate, object: object});
      if (matches.length !== 1) {
        throw "predicate/object pair not found";
      }
      
    },

    createEntry: function (options) {

      if (this.uri !== null) {
        throw "create: entry has already been created";
      }

      // set the typeof property for this entry
      this.setProperty('http://www.w3.org/1999/02/22-rdf-syntax-ns#type', this.getClassUri());
 
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
      xhr.send(this.toJSON());  

    },

    updateEntry: function (options) {
      if (this.uri === null) {
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
  
      xhr.open('PUT', GLOBALS.api.ENTRIES_RESOURCE.replace('%entry_id%', this.uri));
      xhr.send(this.toJSON());  
    },

    deleteEntry: function (options) {
      if (this.uri === null) {
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
  
      xhr.open('DELETE', GLOBALS.api.ENTRIES_RESOURCE.replace('%entry_id%', this.uri));
      xhr.send();  
    }

  };
};