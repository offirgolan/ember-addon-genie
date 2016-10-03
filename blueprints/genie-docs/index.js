/*jshint node:true*/
var utils = require('../../lib/utils/utils');

module.exports = {
  description: 'Setup YUI Doc',

  normalizeEntityName: function() {},

  beforeInstall: function() {
    return this.addAddonToProject('ember-cli-yuidoc');
  },

  locals: function() {
    return utils.getGitUserInfo();
  }
};
