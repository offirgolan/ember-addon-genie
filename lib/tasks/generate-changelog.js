/*jshint node:true*/

'use strict';

var path = require('path');

module.exports = function generateChangelog(project, versions) {
  var runCommand = require(path.join(project.root, 'node_modules/ember-addon-genie/lib/utils/run-command'));
  var currentBranch = runCommand('git rev-parse --abbrev-ref HEAD');

  project.ui.writeLine('[Genie] Generating changes starting from ' + project.pkg.version + ' to ' + currentBranch);

  runCommand('ember genie:changelog --write=true --branch=' + currentBranch +
    ' --version=' + project.pkg.version +
    ' --new-version=' + versions.next
  );

  return promptForCompletion(project);
};


function promptForCompletion(project) {
  return project.ui.prompt({
    type: 'confirm',
    name: 'answer',
    message: '[Genie] Enter "y" when you have finished making any desired modifications to CHANGELOG.md',
    choices: [
      { key: 'y', name: 'Yes, update', value: 'yes' },
      { key: 'n', name: 'No, cancel', value: 'no' }
    ]
  }).then(function(response) {
    if (!response.answer) {
      return promptForCompletion.call(project);
    }
  });
}
