/*jshint node:true*/

var fs          = require('fs-extra');
var path        = require('path');
var readYaml    = require('yamljs');
var writeYaml   = require('write-yaml');
var merge       = require('lodash.merge');
var runCommand  = require('./run-command');
var Promise     = require('ember-cli/lib/ext/promise');
var Blueprint   = require('ember-cli/lib/models/blueprint');

module.exports = {
  runCommand: runCommand,

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
    var bluePrint = Blueprint.lookup(name, {
      paths: [ path.resolve(this.path, '../') ]
    });

    Object.keys(extras || {}).forEach(function(k) {
      bluePrint[k] = extras[k];
    });

    return Promise.resolve().then(function() {
       return bluePrint[type](merge({}, options));
     });
  },

  insert: function(type, content, str, contentToInsert) {
    if(content.indexOf(contentToInsert) !== -1) {
      return content;
    }

    var indexToInsert = content.indexOf(str);

    if(type === 'after') {
      indexToInsert += str.length;
    }

    return content.substr(0, indexToInsert) + contentToInsert + content.substr(indexToInsert);
  },

  getGitUserInfo: function() {
    var gitUrl = this.runCommand('git config --get remote.origin.url');
    var username;

    if(gitUrl && gitUrl !== '') {
      username = gitUrl.split(':')[1].split('/')[0];
    } else {
      username = this.runCommand('git config user.name');
    }

    return {
      email: this.runCommand('git config user.email'),
      username: username,
    };
  }
};
