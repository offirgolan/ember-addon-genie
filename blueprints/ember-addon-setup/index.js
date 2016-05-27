/*jshint node:true*/
var utils = require('../utils');
var PossibleOptions = [
  { name: 'Code Coverage (Blanket + CodeClimate)', value: 'coverage', checked: true },
  { name: 'Release', value: 'release', checked: true },
  { name: 'Github Pages', value: 'ghPages', checked: true },
  { name: 'Docs (YUI)', value: 'docs', checked: true }
];

module.exports = {
  description: 'Blueprint for setting up an addon with a build and code coverage',

  normalizeEntityName: function() {},

  beforeInstall: function() {
    return utils.prompt.call(this, 'checkbox', 'Deselect any features you dont want (enter to continue):', PossibleOptions).then(function(response) {
      var selectedOptions = {};

      response.answer.forEach(function (option) {
        selectedOptions[option] = true;
      });

      var packages = [
        'ember-cli-es5-shim'
      ];

      if(selectedOptions.release) {
        packages.push('ember-cli-release');
      }

      if(selectedOptions.coverage) {
        packages.push('ember-cli-blanket');
      }

      if(selectedOptions.ghPages) {
        packages.push('ember-cli-github-pages');
      }

      if(selectedOptions.docs) {
        packages.push('ember-cli-yuidoc');
      }

      this._selectedOptions = selectedOptions;

      // return this.addAddonsToProject({ packages: packages });
    }.bind(this));
  },

  afterInstall: function() {
    var selectedOptions = this._selectedOptions;

    if(selectedOptions.coverage) {
      // return utils.loadBlueprint.call(this, 'addon-setup-coverage');
      utils.runCommand('ember generate addon-setup-coverage');
    }

    // modifyPackageJson.call(this);
  },

  locals: function() {
    return {
      email: utils.runCommand('git config user.email'),
      username: utils.runCommand('git config user.name'),
    };
  }
};

function modifyPackageJson() {
  var json = utils.getContents.call(this, 'package.json', 'json');
  var locals = this.locals();

  json.repository = {
    'type': 'git',
    'url': 'git@github.com:' + locals.username + '/' + json.name + '.git'
  };

  json.author = locals.username + ' <' + locals.email + '>';

  json['ember-addon'].demoURL = 'http://' + locals.username + '.github.io/' + json.name;

  utils.setContents.call(this, 'package.json', 'json', json);
}
