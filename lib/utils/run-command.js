/*jshint node:true*/

'use strict';

var execSync = require('child_process').execSync;

module.exports = function runCommand(command, log) {
  log = (log === undefined) ? false : log;

  if(log) {
    console.log('running: ' + command);
  }

  var output = execSync(command, { encoding: 'utf8' }).toString().trim();

  if(log) {
    console.log(output);
  }

  return output;
};
