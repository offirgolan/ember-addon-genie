/*jshint node:true*/
var utils = require('../utils');

module.exports = {
  description: 'Setup coverage',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var _this = this;
    var travisYaml = utils.getContents.call(_this, '.travis.yml', 'yaml');

    console.log('HERE');

    return this.insertIntoFile('.gitignore', 'lcov.dat').then(function() {
      travisYaml.addons = travisYaml.addons || {};
      travisYaml.after_script = travisYaml.after_script || [];

      travisYaml.before_install.push('npm install -g codeclimate-test-reporter');
      travisYaml.after_script.push('codeclimate-test-reporter < lcov.dat');

      if(!travisYaml.addons.code_climate) {
        return utils.prompt.call(_this, 'input', 'CodeClimate Repo Token:').then(function(response) {
          console.log(response);
          var token = response.answer.trim();

          if(token === '') {
            token = '<CODE_CLIMATE_TOKEN_GOES_HERE>';
            _this.ui.writeLine('No worries! You can always enter it in later in your .travis.yml file');
          }

          travisYaml.addons.code_climate = {
            repo_token: token
          };

          utils.setContents.call(_this, '.travis.yml', 'yaml', travisYaml);
        });
      }
    }).then(function() {
      utils.setContents.call(_this, '.travis.yml', 'yaml', travisYaml);
    });
  },
};
