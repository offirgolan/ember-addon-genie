/*jshint node:true*/
var utils = require('../../lib/utils/utils');
var merge = require('object-merge');

module.exports = {
  description: 'Setup Chrome with Travis',

  normalizeEntityName: function() {},

  afterInstall: function() {
    this._setupChromeWithTravis();
  },

  _setupChromeWithTravis: function() {
    var travisYaml = utils.getContents.call(this, '.travis.yml', 'yaml');
    var beforeInstall, i;
    var chromeSetup = {
      sudo: 'required',
      dist: 'trusty',
      addons: {
        apt: {
          sources: [
            'google-chrome'
          ],
          packages: [
            'google-chrome-stable'
          ]
        }
      }
    };

    travisYaml = merge(travisYaml, chromeSetup);

    // Add chrome required setup scripts
    beforeInstall = travisYaml.before_install;
    beforeInstall.unshift('export DISPLAY=:99.0', 'sh -e /etc/init.d/xvfb start');

    // Remove phantomjs script
    var found = false;
    for(i = 0; i < beforeInstall.length; i++) {
      if(beforeInstall[i].indexOf('phantomjs') !== -1) {
        found = true;
        break;
      }
    }

    if(found) {
      beforeInstall.splice(i, 1);
    }

    utils.setContents.call(this, '.travis.yml', 'yaml', travisYaml);
  }
};
