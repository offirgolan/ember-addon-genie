/*jshint node:true*/

var utils      = require('../../lib/utils/utils');
var EOL     = require('os').EOL;

module.exports = {
  description: 'Genie Github Pages',

  normalizeEntityName: function() {},

  beforeInstall: function() {
    return this.addAddonToProject('ember-cli-github-pages');
  },

  afterInstall: function() {
    var self = this;

    var ghPagesBranchExists = utils.runCommand('git branch -a').indexOf('gh-pages') !== -1;

    if(!ghPagesBranchExists) {
      var currentBranch = utils.runCommand('git rev-parse --abbrev-ref HEAD');

      this.ui.writeLine('[Genie] Creating missing gh-pages branch...');

      utils.runCommand('git checkout --orphan gh-pages');
      utils.runCommand('rm -rf `bash -c "ls -a | grep -vE \'\\.gitignore|\\.git|node_modules|bower_components|(^[.]{1,2}/?$)\'"`');
      utils.runCommand('git add -A && git commit -m "initial gh-pages commit"');
      utils.runCommand('git push origin gh-pages && git checkout ' + currentBranch);

      this.ui.writeLine('[Genie] gh-pages branch created successfuly.');
    }

    return this.insertIntoFile('config/release.js',
      'var publishToGhPages = require(\'ember-addon-genie/lib/tasks/publish-to-gh-pages\');',
      { after: '/* jshint node:true */' + EOL })
    .then(function() {
      return self.insertIntoFile('config/release.js',
        '  afterPush: publishToGhPages,',
        { after: 'module.exports = {' + EOL });
    });
  }
};
