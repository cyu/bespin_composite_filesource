var pathUtil = require('filesystem:path');

exports.ServerFileSource = function(serverString) {
  if (!serverString.match(/^https?:\/\//))
    serverString = 'http://' + serverString;

  var BespinServer = require('bespin_server').BespinServer;
  this.server = new BespinServer(serverString);
  this.server.protectXhrAgainstCsrf = function(){};
};

exports.ServerFileSource.prototype = {
  loadAll: function() {
    var opts = {
        evalJSON: true
    };
    return this.server.request('GET', '/file/list_all/', null, opts);
  },

  loadContents: function(path) {
    var url = pathUtil.combine('/file/at/', path);
    return this.server.request('GET', url, null);
  },

  saveContents: function(path, contents) {
    var url = pathUtil.combine('/file/at/', path);
    return this.server.request('PUT', url, contents);
  },

  remove: function(path) {
    var url = pathUtil.combine('/file/at/', path);
    var pr = this.server.request('DELETE', url);
    return pr;
  },

  makeDirectory: function(path) {
    var url = pathUtil.combine('/file/at/', path);
    return this.server.request('PUT', url, null);
  }
};
