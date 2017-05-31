'use strict';
const _ = require('lodash');

class TestLauncher3 {

  static get type() {
    return 'test3';
  }

  static get requiredFields() {
    return [{ name: 'fieldToLaunch' }, { name: 'testDefName' }];
  }

  static process(input) {
    return _.assign({ fieldFromLauncher: input.fieldToLaunch }, input);
  }
}

module.exports = TestLauncher3;
