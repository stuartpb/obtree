var fs = require('fs');
var pathlib = require('path');

function obtree(path, opts, cb) {
  if (typeof opts == "function") {
    cb = opts; opts = {};
  } else if (typeof opts == "string") {
    opts = {encoding: opts};
  } else if (!opts){
    opts = {};
  }
  fs.stat(path, getStat);
  function getStat(err, stat) {
    if (err) return cb(err);
    if (stat && stat.isDirectory()) {
      return fs.readdir(path, getTree);
    } else {
      fs.readFile(path, opts, cb);
    }
  }
  var tree, pending;
  function getTree(err, list) {
    if (err) return cb(err);
    tree = Object.create(null);
    pending = list.length;
    if (!pending) return cb(null, tree);
    return list.forEach(getSubpath);
  }
  var returned = false;
  function getSubpath(name) {
    var subpath = pathlib.resolve(path, name);
    return obtree(subpath, opts, function(err, content) {
      if (!returned) {
        if (err) {
          returned = true; return cb(err);
        }
        tree[name] = content;
        if (!--pending) return cb(null, tree);
      }
    });
  }
}

module.exports = obtree;
