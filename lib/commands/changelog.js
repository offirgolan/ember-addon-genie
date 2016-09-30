/*jshint node:true*/

'use strict';

var path              = require('path');
var utils             = require('../utils/utils');
var generateChangelog = require('../utils/generate-changelog');
var EOL               = require('os').EOL;

var gitUser = utils.getGitUserInfo();

module.exports = {
  name: 'genie:changelog',
  description: 'Create markdown changelog',
  works: 'insideProject',

  availableOptions: [
    { name: 'user', type: String, default: gitUser.username },
    { name: 'repo', type: String },
    { name: 'version', type: String },
    { name: 'new-version', type: String },
    { name: 'branch', type: String, default: 'master' },
    { name: 'write', type: Boolean, default: false },
    { name: 'file', type: String, default: 'CHANGELOG.md' }
  ],

  run: function(options) {
    var self = this;
    var packageJson = require(path.join(this.project.root, 'package.json'));

    options.repo = options.repo || packageJson.name;
    options.version = options.version || packageJson.version;

    return generateChangelog(options.user, options.repo, options.version, options.branch).then(function(changelog) {
      if(!changelog) {
        return;
      }

      if(options.write) {
        var changelogMd = utils.getContents.call(self, options.file, 'md');

        if(options.newVersion) {
          changelog = '## ' + options.newVersion + EOL + EOL + changelog;
        }

        changelog = EOL + changelog;

        changelogMd = utils.insert('after', changelogMd, '# Changelog' + EOL, changelog);

        utils.setContents.call(self, options.file, 'md', changelogMd);
      } else {
        return self.ui.writeLine(changelog);
      }
      return changelog;
    });
  }
};
