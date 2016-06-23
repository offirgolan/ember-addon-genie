/*jshint node:true*/
var utils     = require('../../lib/utils/utils');
var Promise   = require('ember-cli/lib/ext/promise');
var mapSeries = require('promise-map-series');

var PossibleOptions = [
  { name: 'Init', value: 'init', disabled: 'Default', blueprint: 'genie-init' },
  { name: 'Chrome + Travis CI', value: 'chrome', checked: true, blueprint: 'genie-chrome' },
  { name: 'Code Coverage (Blanket + CodeClimate)', value: 'coverage', checked: true, blueprint: 'genie-coverage' },
  { name: 'Release + Github Pages Publish', value: 'ghPages', checked: true, blueprint: 'genie-gh-pages' },
  { name: 'Release + Changelog Publish', value: 'changelog', checked: true, blueprint: 'genie-changelog' },
  { name: 'Ember Try', value: 'try', checked: true, blueprint: 'genie-try'},
  { name: 'Docs (YUI)', value: 'docs', checked: true, blueprint: 'genie-docs' }
];

module.exports = {
  description: 'Blueprint for setting up an addon with a build and code coverage',

  normalizeEntityName: function() {},

  install: function(options) {
    return this._process('install', options);
  },

  uninstall: function(options) {
    return this._process('uninstall', options);
  },

  _process: function(type, options) {
    var self = this;

    return this._getOptions(type, options).then(function(selectedOptions) {
      return mapSeries(PossibleOptions, function(o) {
        if(selectedOptions[o.value] && o.blueprint) {
          return utils.processBlueprint.call(self, type, o.blueprint, options, { _selectedOptions: selectedOptions });
        }
        return Promise.resolve();
      });
    });
  },

  _getOptions: function(type, options) {
    return utils.prompt.call(options, 'checkbox', '[Genie] Select components to ' + type + ' (enter to continue):', PossibleOptions).then(function(response) {
      var answers = response.answer;
      var selectedOptions = {};

      // Add required blueprints
      answers.unshift('init');

      answers.forEach(function (option) {
        selectedOptions[option] = true;
      });

      return selectedOptions;
    });
  }
};
