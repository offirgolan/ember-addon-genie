/*jshint node:true*/

var multiline = require('multiline');
var EOL       = require('os').EOL;

module.exports = {
  description: 'Genie Github Pages',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return this.insertIntoFile('config/release.js',
      'var publishToGhPages = require(\'ember-addon-genie/lib/tasks/publish-to-ghpages\');',
      { after: '/* jshint node:true */' + EOL })
    .then(function() {
      return self.insertIntoFile('config/release.js', multiline(function() {/*
  // Auto publish to NPM when running `ember release`
  // If you dont want to publish to NPM, set this to false and
  // change `afterPublish: publishToGhPages` to `afterPush: publishToGhPages`
  publish: true,
  afterPublish: publishToGhPages,
    */}), { after: 'module.exports = {' + EOL });
    });
  }
};
