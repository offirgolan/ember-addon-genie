/*jshint node:true*/

'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerate = blueprintHelpers.emberGenerate;

var chai = require('ember-cli-blueprint-test-helpers/chai');
var expect = chai.expect;
var file = chai.file;

describe('Acceptance: ember generate genie-docs', function() {
  setupTestHooks(this);

  it('genie-docs', function() {
    var args = ['genie-docs'];

    // pass any additional command line options in the arguments array
    return emberNew({ target: 'addon' })
    .then(function() {
      return emberGenerate(args);
    })
    .then(() => {
      expect(file('yuidoc.json'))
        .to.exist
        .to.contain('github.com/offirgolan/my-addon');
    });
  });
});
