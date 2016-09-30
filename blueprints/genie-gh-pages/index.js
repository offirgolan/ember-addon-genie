/*jshint node:true*/

var multiline = require('multiline');
var Promise = require('ember-cli/lib/ext/promise');
var EOL     = require('os').EOL;

module.exports = {
  description: 'Genie Github Pages',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return this.insertIntoFile('config/release.js', multiline(function() {/*
  afterPublish: function(project, versions) {
    runCommand('ember github-pages:commit --message "Released ' + versions.next + '"', true);
    runCommand('git push origin gh-pages:gh-pages', true);
  },
    */}), {
      after: 'module.exports = {' + EOL
    });
  }
};
