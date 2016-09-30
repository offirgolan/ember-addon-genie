/*jshint node:true*/

var EOL     = require('os').EOL;

module.exports = {
  description: 'Genie Changelog',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return this.insertIntoFile('config/release.js',
      'var generateChangelog = require(\'ember-addon-genie/lib/tasks/generate-changelog\');',
      { after: '/* jshint node:true */' + EOL })
    .then(function() {
      return self.insertIntoFile('config/release.js',
        '  beforeCommit: generateChangelog,',
        { after: 'module.exports = {' + EOL });
    });
  }
};
