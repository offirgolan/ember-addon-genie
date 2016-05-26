/*jshint node:true*/
var fs = require('fs-extra'),
    path  = require('path'),
    execSync = require('child_process').execSync;

module.exports = {
  description: 'Blueprint for setting up an addon with a build and code coverage',

  normalizeEntityName: function() {},

  beforeInstall: function() {
    return this.addAddonsToProject({
      packages: [
        'ember-cli-blanket',
        'ember-cli-github-pages',
        'ember-cli-release',
        'ember-cli-es5-shim'
      ]});
  },

  afterInstall: function() {
    modifyPackageJson.call(this);

    return this.insertIntoFile('.gitignore', 'lcov.dat');
  },

  locals: function() {
    return {
      email: runCommand('git config user.email'),
      username: runCommand('git config user.name'),
    };
  }
};

function modifyPackageJson() {
  var json = getContents.call(this, 'package.json', 'json');
  var locals = this.locals();

  json.repository = {
    'type': 'git',
    'url': 'git@github.com:' + locals.username + '/' + json.name + '.git'
  };

  json.author = locals.username + ' <' + locals.email + '>';

  json['ember-addon'].demoURL = 'http://' + locals.username + '.github.io/' + json.name;

  setContents.call(this, 'package.json', 'json', json);
}

function getContents(fileName, type) {
  var fullPath = path.join(this.project.root, fileName);

  return (type === 'json') ? fs.readJsonSync(fullPath) : fs.readFileSync(fullPath, 'utf-8');
}

function setContents(fileName, type, content) {
  var fullPath = path.join(this.project.root, fileName);

  return (type === 'json') ? fs.writeFileSync(fullPath, JSON.stringify(content, null, 2) + '\n') : fs.writeFileSync(fullPath, content, 'utf8');
}

function runCommand(command) {
  return execSync(command, { encoding: 'utf8' }).toString().trim();
}
