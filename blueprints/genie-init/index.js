/*jshint node:true*/
var utils      = require('../../lib/utils/utils');
var Promise    = require('ember-cli/lib/ext/promise');

module.exports = {
  description: 'Genie Init',

  normalizeEntityName: function() {},

  beforeInstall: function() {
    var selectedOptions = this._selectedOptions || {};
    var packages = [
      'ember-cli-es5-shim'
    ];

    if(selectedOptions.coverage) {
      packages.push('ember-cli-blanket');
    }

    if(selectedOptions.ghPages) {
      packages.push('ember-cli-release');
      packages.push('ember-cli-github-pages');
    }

    if(selectedOptions.docs) {
      packages.push('ember-cli-yuidoc');
    }

    return this.addAddonsToProject({ packages: packages });
  },

  afterInstall: function() {
    modifyPackageJson.call(this);
  },

  locals: function() {
    return utils.getGitUserInfo();
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

  if(this._selectedOptions.ghPages) {
    json['ember-addon'].demoURL = 'http://' + locals.username + '.github.io/' + json.name;
  }

  utils.setContents.call(this, 'package.json', 'json', json);
}
