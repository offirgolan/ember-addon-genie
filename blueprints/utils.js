/*jshint node:true*/
var fs = require('fs-extra'),
    path  = require('path'),
    readYaml = require('yamljs'),
    execSync = require('child_process').execSync,
    merge = require('lodash.merge'),
    Promise    = require('ember-cli/lib/ext/promise'),
    Blueprint = require('ember-cli/lib/models/blueprint'),
    writeYaml = require('write-yaml');


module.exports = {
  getContents: function(fileName, type) {
    var fullPath = path.join(this.project.root, fileName);

    if(type === 'json') {
      return fs.readJsonSync(fullPath);
    }

    if(type === 'yaml') {
      return readYaml.load(fullPath);
    }

    return fs.readFileSync(fullPath, 'utf-8');
  },

  setContents: function(fileName, type, content) {
    var fullPath = path.join(this.project.root, fileName);

    if(type === 'json') {
      return fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + '\n');
    }

    if(type === 'yaml') {
      return writeYaml.sync(fullPath, content);
    }

    return fs.writeFileSync(fullPath, content, 'utf8');
  },

  runCommand: function(command) {
    return execSync(command, { encoding: 'utf8' }).toString().trim();
  },

  prompt: function(type, message, choices) {
    var options = {
      type: type,
      name: 'answer',
      message: message,
      choices: choices
    };

    return this.ui.prompt(options);
  },

  processBlueprint: function(type, name, options, extras) {
    var self = this;
    var bluePrint = Blueprint.lookup(name, {
      paths: [ path.resolve(this.path, '../') ]
    });

    Object.keys(extras || {}).forEach(function(k) {
      bluePrint[k] = extras[k];
    });

    return Promise.resolve().then(function() {
       return bluePrint[type](merge({}, options));
     });
  }
};
