var Promise  = require('bespin:promise').Promise;
var group    = require('bespin:promise').group;

exports.CompositeFileSource = function(defaultSource) {
  this.sources = [defaultSource];
  this.defaultSource = defaultSource;
};

exports.CompositeFileSource.prototype = {
  files: [],

  loadAll: function() {
    var files = this.files;

    var pr = group(this.sources.map(function(src){
      return src.loadAll().chainPromise(function(result){
        files.push([src, result]);
        return result;
      });
    }));

    return pr.chainPromise(function(results){
      return results.reduce(function(previousValue, currentValue){
        return previousValue.concat(currentValue);
      }, []);
    });
  },
    
  loadContents: function(path) {
    return this._sourceForPath(path).loadContents(path);
  },
    
  saveContents: function(path, contents) {
    return this._sourceForPath(path).saveContents(path, contents);
  },
    
  remove: function(path) {
    return this._sourceForPath(path).remove(path);
  },
    
  makeDirectory: function(path) {
    return this._sourceForPath(path).makeDirectory(path);
  },

  addSource: function(source, isDefault) {
    this.sources.push(source);
    if (typeof isDefault !== 'undefined' && isDefault)
      this.defaultSource = source;
  },

  _sourceForPath: function(path){
    var idx = path.indexOf('/');
    var targetSource = this.defaultSource;
    if (idx > 0) {
      var dirname = path.substring(0, idx) + '/';
      for (var i=0; i<this.files.length; i++) {
        for (var j=0; j<this.files[i][1].length; j++) {
          if (this.files[i][1][j].indexOf(dirname) == 0)
            return this.files[i][0];
        }
      }
    }
    return targetSource;
  }
};
