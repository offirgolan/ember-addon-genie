/*jshint node:true*/

var multiline = require('multiline');
var Promise = require('ember-cli/lib/ext/promise');
var EOL     = require('os').EOL;

module.exports = {
  description: 'Genie Changelog',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return this.insertIntoFile('config/release.js', multiline(function() {/*
  init: function() {
    this._previousVersion = require('../package.json').version;
  },

  afterPush: function(project, tags) {
    runCommand('ember genie:changelog --write=true --version=' + this._previousVersion +
        ' --new-version=' + tags.next, true);
  },
    */}), {
      after: 'module.exports = {' + EOL
    });
  }
};
