/*jshint node:true*/
var utils   = require('../utils');
var Promise = require('ember-cli/lib/ext/promise');

module.exports = {
  description: 'Setup coverage',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return this._modifyTavisYaml().then(function() {
      return self._modifyTestemJs();
    }).then(function() {
      return self.insertIntoFile('.gitignore', 'lcov.dat');
    });
  },

  _modifyTestemJs: function() {
    var contentToInsert = 'coverage=true&';
    var testemJs = utils.getContents.call(this, 'testem.js', 'js');

    testemJs = utils.insert('after', testemJs, 'tests/index.html?', 'coverage=true&');
    utils.setContents.call(this, 'testem.js', 'js', testemJs);
  },

  _modifyTavisYaml: function() {
    var self = this;
    var travisYaml = utils.getContents.call(this, '.travis.yml', 'yaml');

    travisYaml.addons = travisYaml.addons || {};
    travisYaml.after_script = travisYaml.after_script || [];

    return Promise.resolve().then(function() {
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
  }
};
