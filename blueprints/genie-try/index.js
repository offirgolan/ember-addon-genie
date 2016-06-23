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

      self._generateTryConfig(scenarios);
      self._addScenariosToTravis(scenarios);
    }).then(function() {
      return self.insertIntoFile('tests/dummy/config/environment.js',
        '    ENV.EmberENV.RAISE_ON_DEPRECATION = true;', {
        after: '// ENV.APP.LOG_VIEW_LOOKUPS = true;' + EOL
      });
    }).then(function() {
      return self.insertIntoFile('tests/dummy/config/environment.js',
        '\n    // Deprecations should we treated as errors' +
        '\n    ENV.EmberENV.RAISE_ON_DEPRECATION = !process.env[\'ALLOW_DEPRECATIONS\'];', {
        after: 'ENV.APP.LOG_VIEW_LOOKUPS = false;' + EOL
      });
    });
  },

  _addScenariosToTravis: function(scenarios) {
    var travisYaml = utils.getContents.call(this, '.travis.yml', 'yaml');

    travisYaml.env = ['EMBER_TRY_SCENARIO=default'];

    scenarios.forEach(function(scenario) {
      travisYaml.env.push('EMBER_TRY_SCENARIO=ember-' + getScenarioName(scenario));
    });

    travisYaml.env = travisYaml.env.concat([
      'EMBER_TRY_SCENARIO=ember-release',
      'ALLOW_DEPRECATIONS=true EMBER_TRY_SCENARIO=ember-beta',
      'ALLOW_DEPRECATIONS=true EMBER_TRY_SCENARIO=ember-canary'
    ]);

    travisYaml.matrix.allow_failures = [
      { env: 'ALLOW_DEPRECATIONS=true EMBER_TRY_SCENARIO=ember-beta'},
      { env: 'ALLOW_DEPRECATIONS=true EMBER_TRY_SCENARIO=ember-canary'}
    ];

    travisYaml.script = [
      'ember try:one $EMBER_TRY_SCENARIO --- ember test'
    ];

    utils.setContents.call(this, '.travis.yml', 'yaml', travisYaml);
  },

  _generateTryConfig: function(scenarios) {
    var buffer = '/*jshint node:true*/\n' +
                'module.exports = ';

    var config = {
      command: 'ember test',
      scenarios: [{
        name: 'default',
        bower: {
          dependencies: { }
        }
      }]
    };

    scenarios.forEach(function(scenario) {
      var name = getScenarioName(scenario);
      var version = getScenarioVersion(scenario);

      config.scenarios.push({
        name: 'ember-' + name,
        bower: {
          dependencies: {
            'ember': '~' + version,
            'ember-data': '~' + version
          }
        }
      });
    });

    config.scenarios = config.scenarios.concat([{
      name: 'ember-release',
      bower: {
        dependencies: {
          'ember': 'components/ember#release',
          'ember-data': 'components/ember-data#release'
        },
        resolutions: {
          'ember': 'release',
          'ember-data': 'release'
        }
      }
    }, {
      name: 'ember-beta',
      bower: {
        dependencies: {
          'ember': 'components/ember#beta',
          'ember-data': 'components/ember-data#beta'
        },
        resolutions: {
          'ember': 'beta',
          'ember-data': 'beta'
        }
      }
    }, {
      name: 'ember-canary',
      bower: {
        dependencies: {
          'ember': 'components/ember#canary',
          'ember-data': 'components/ember-data#canary'
        },
        resolutions: {
          'ember': 'canary',
          'ember-data': 'canary'
        }
      }
    }]);

    buffer += JSON.stringify(config, null, 2) + ';\n';

    utils.setContents.call(this, './config/ember-try.js', 'js' ,buffer);
  }
};

function getScenarioName(scenario) {
  return scenario.trim().split('.').slice(0, 2).join('.');
}

function getScenarioVersion(scenario) {
  scenario = scenario.trim();
  return scenario.split('.').length < 3 ? scenario += '.0' : scenario;
}
