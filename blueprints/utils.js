/*jshint node:true*/
var fs = require('fs-extra'),
    path  = require('path'),
    yaml = require('yamljs'),
    execSync = require('child_process').execSync,
    Blueprint = require('ember-cli/lib/models/blueprint');

module.exports = {
  getContents: function(fileName, type) {
    var fullPath = path.join(this.project.root, fileName);

    if(type === 'json') {
      return fs.readJsonSync(fullPath);
    }

    if(type === 'yaml') {
      return yaml.load(fullPath);
    }

    return fs.readFileSync(fullPath, 'utf-8');
  },

  setContents: function(fileName, type, content) {
    var fullPath = path.join(this.project.root, fileName);

    if(type === 'json') {
      return fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + '\n');
    }

    if(type === 'yaml') {
      return fs.writeFileSync(fullPath, yaml.stringify(content, 10, 2));
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

  loadBlueprint: function(name) {
    return Blueprint.load(path.resolve(__dirname, name)).install(this);
  }
};
