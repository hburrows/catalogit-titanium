/*
 *
 */

var default_handle_error = function (e) {

  "use strict";

  Ti.API.debug(this.status + ': ' + this.error);

  var response;
  var contentType = this.getResponseHeader("Content-Type");
  if (contentType && (contentType.indexOf("application/json") === 0)) {
    response = JSON.parse(this.responseText);
  }
  else
  if (contentType && (contentType.indexOf("text/plain") === 0)) {
    response = '"' + this.responseText + '"';
  }

  if (!this.connected && this.status === 0) {
    alert('No response from the service.\nCheck your network connection.\n\nPlease try again later.' + (response ? '  ' + JSON.stringify(response) : ''));
  }
  else {
    alert(this.responseText);
  }
};

module.exports = function (parameters) {

  "use strict";

  // default timeout to 10 seconds unless specified
  if (!parameters.timeout) {
    parameters.timeout = 10000;
  }

  if (!parameters.onerror) {
    parameters.onerror = default_handle_error;
  }

  var xhr = Ti.Network.createHTTPClient(parameters);

  // augment the xhr with a few helper functions
  //
  xhr._cit_handle_error = default_handle_error;

  return xhr;
}