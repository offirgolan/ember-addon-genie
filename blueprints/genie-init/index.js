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
    this.modifyPackageJson();
  },

  locals: function() {
    return utils.getGitUserInfo();
  },

  modifyPackageJson: function() {
    var json = utils.getContents.call(this, 'package.json', 'json');
    var locals = this.locals();

    if(json.repository === '') {
      json.repository = {
        'type': 'git',
        'url': 'git@github.com:' + locals.username + '/' + json.name + '.git'
      };
    }

    if(json.author === '') {
      json.author = locals.username + ' <' + locals.email + '>';
    }

    if(this._selectedOptions.ghPages && !json['ember-addon'].demoURL) {
      json['ember-addon'].demoURL = 'http://' + locals.username + '.github.io/' + json.name;
    }

    utils.setContents.call(this, 'package.json', 'json', json);
  }

};
