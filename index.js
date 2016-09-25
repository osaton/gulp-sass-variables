'use strict';

const PLUGIN_NAME = 'gulp-sass-variables';

let gutil = require('gulp-util'),
    PluginError = gutil.PluginError,
    through = require('through2');

module.exports = function(settings) {

  return through.obj(function (file, encoding, callback) {

    if(file.isNull()) {

    } else {

    }

    callback(null, file);

  });
};
