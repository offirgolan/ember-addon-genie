/*jshint node:true*/

var runCommand = require('../utils/run-command');

module.exports = function(project, versions) {
  runCommand('ember github-pages:commit --message "Released ' + versions.next + '"', true);
  runCommand('git push origin gh-pages:gh-pages', true);
};
