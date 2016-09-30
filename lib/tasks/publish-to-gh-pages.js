/*jshint node:true*/

'use strict';

var path = require('path');

module.exports = function publishToGhPages(project, versions) {
  var runCommand = require(path.join(project.root, 'node_modules/ember-addon-genie/lib/utils/run-command'));

  runCommand('ember github-pages:commit --message "Released ' + versions.next + '"', true);
  runCommand('git push origin gh-pages:gh-pages', true);
};
