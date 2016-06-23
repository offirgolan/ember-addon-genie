/*jshint node:true*/
var utils = require('../../lib/utils/utils');

module.exports = {
  description: 'Setup YUI Doc',

  normalizeEntityName: function() {},

  locals: function() {
    return utils.getGitUserInfo();
  }
};
