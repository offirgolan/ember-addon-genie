/*jshint node:true*/
var utils   = require('../utils');
var Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  description: 'Setup coverage',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;
    var travisYaml = utils.getContents.call(this, '.travis.yml', 'yaml');

    return this.insertIntoFile('.gitignore', 'lcov.dat').then(function() {
      travisYaml.addons = travisYaml.addons || {};
      travisYaml.after_script = travisYaml.after_script || [];

      if(!travisYaml.addons.code_climate) {
        travisYaml.before_install.push('npm install -g codeclimate-test-reporter');
        travisYaml.after_script.push('codeclimate-test-reporter < lcov.dat');

        return utils.prompt.call(self, 'input', '[Genie] CodeClimate Repo Token:').then(function(response) {
          var token = response.answer.trim();

          if(token === '') {
            token = '<CODE_CLIMATE_TOKEN_GOES_HERE>';
            self.ui.writeLine('[Genie] No worries! You can always enter it in later in your .travis.yml file');
          }

          travisYaml.addons.code_climate = {
            repo_token: token
          };
        });
      }

      return Promise.resolve();
    }).then(function() {
      utils.setContents.call(self, '.travis.yml', 'yaml', travisYaml);
    });
  },
};
