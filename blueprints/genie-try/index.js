/*jshint node:true*/
var utils = require('../../lib/utils/utils');
var EOL = require('os').EOL;

module.exports = {
  description: 'Setup Ember Try',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;

    return utils.prompt.call(this, 'input', '[Genie] Which ember-try scenarios should be added (comma seperated):').then(function(response) {
      var scenarios = response.answer.trim();
      scenarios = scenarios === '' ? [] : scenarios.split(',');

      self._addVersionCompatabilityToPackageJson(scenarios);
      self._addScenariosToTravis(scenarios);
    }).then(function() {
      return self.insertIntoFile('tests/dummy/config/environment.js',
        '    ENV.EmberENV.RAISE_ON_DEPRECATION = true;', {
        after: '// ENV.APP.LOG_VIEW_LOOKUPS = true;' + EOL
      });
    }).then(function() {
      return self.insertIntoFile('tests/dummy/config/environment.js',
        '\n    // Deprecations should be treated as errors' +
        '\n    ENV.EmberENV.RAISE_ON_DEPRECATION = !process.env[\'ALLOW_DEPRECATIONS\'];', {
        after: 'ENV.APP.LOG_VIEW_LOOKUPS = false;' + EOL
      });
    });
  },

  _addScenariosToTravis: function(scenarios) {
    var travisYaml = utils.getContents.call(this, '.travis.yml', 'yaml');

    delete travisYaml.env;
    delete travisYaml.matrix.allow_failures;

    travisYaml.script = [
      'COVERAGE=true ember try:each',
    ];

    utils.setContents.call(this, '.travis.yml', 'yaml', travisYaml);
  },

  _addVersionCompatabilityToPackageJson: function(scenarios) {
    var json = utils.getContents.call(this, 'package.json', 'json');

    json['ember-addon'].versionCompatibility = {
      ember: scenarios.join(' || ')
    };

    utils.setContents.call(this, 'package.json', 'json', json);
  }
};
