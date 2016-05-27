/*jshint node:true*/
var utils = require('../utils');

module.exports = {
  description: 'Setup YUI Doc',

  normalizeEntityName: function() {},

  locals: function() {
    return {
      email: utils.runCommand('git config user.email'),
      username: utils.runCommand('git config user.name'),
    };
  }
};
