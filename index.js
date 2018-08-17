'use strict';

const PLUGIN_NAME = 'gulp-sass-variables';

const PluginError = require('plugin-error');
const through = require('through2');

let globalOptions = {
  allowHexColors: false
};

const getVariablesBuffer = function(sassVariables, file) {
  let str = '';
  
  for(let variable in sassVariables) {
    str += variable + ': ' + printVariable(sassVariables[variable]) + ';\n';
  }

  return new Buffer(str, file);
}

const printVariable = function(variable) {
  if (globalOptions.allowHexColors && isHexColor(variable)) {
    return variable;
  } else {
    return JSON.stringify(variable);
  }
}

const isHexColor = function(variable) {
  return (
    typeof variable === 'string' &&
    (variable.length === 7 || variable.length === 4) &&
    variable[0] === '#'
  );
}

const parseOptions = function(options) {
  if (options.hasOwnProperty('allowHexColors')) {
    globalOptions.allowHexColors = options.allowHexColors;
  }
}

module.exports = function(sassVariables, options) {

  if (typeof options !== 'undefined') {
    parseOptions(options);
  }

  return through.obj(function (file, encoding, cb) {

    if(file.isNull()) {
      return cb(null, file);
    }

    if(file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'));
    }

    if(sassVariables && typeof sassVariables === 'object') {
      let variablesBuffer = getVariablesBuffer(sassVariables, file);
      file.contents = Buffer.concat([variablesBuffer, file.contents], variablesBuffer.length + file.contents.length);
    } else {
      return cb(new PluginError(PLUGIN_NAME, 'Variables object expected'));
    }

    return cb(null, file);

  });
};
