/*jshint node:true*/
var utils   = require('../utils');
var Promise = require('ember-cli/lib/ext/promise');

var PossibleOptions = [
  { name: 'Code Coverage (Blanket + CodeClimate)', value: 'coverage', checked: true },
  { name: 'Release + Github Pages Publish', value: 'ghPages', checked: true },
  { name: 'Ember Try', value: 'try', checked: true },
  { name: 'Docs (YUI)', value: 'docs', checked: true }
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
      return utils.processBlueprint.call(self, type, 'genie-init', options, { _selectedOptions: selectedOptions }).then(function() {
        var promise = selectedOptions.coverage ? utils.processBlueprint.call(self, type, 'genie-coverage', options, { _selectedOptions: selectedOptions }) : Promise.resolve();

        return promise.then(function() {
          var promise = selectedOptions.ghPages ? utils.processBlueprint.call(self, type, 'genie-gh-pages', options) : Promise.resolve();

          return promise.then(function() {
            var promise = selectedOptions.try ? utils.processBlueprint.call(self, type, 'genie-try', options) : Promise.resolve();

            return promise.then(function() {
              var promise = selectedOptions.docs ? utils.processBlueprint.call(self, type, 'genie-docs', options) : Promise.resolve();

              return promise;
            });
          });
        });
      });
    });
  },

  _getOptions: function(type, options) {
    return Promise.resolve().then(function() {
      return utils.prompt.call(options, 'checkbox', '[Genie] Select components to ' + type + ' (enter to continue):', PossibleOptions).then(function(response) {
        var selectedOptions = {};

        response.answer.forEach(function (option) {
          selectedOptions[option] = true;
        });

        return selectedOptions;
      });
    });
  }
};
