'use strict';
const _ = require('lodash');

class TestLauncher2 {

  static get type() {
    return 'test2';
  }

  static get requiredFields() {
    return [{ name: 'fieldToLaunch' }];
  }

  static process(input) {
    return { fieldFromLauncher: input.fieldToLaunch };
  }
}

module.exports = TestLauncher2;
