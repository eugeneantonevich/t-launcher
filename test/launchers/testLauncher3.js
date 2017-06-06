'use strict';
const _ = require('lodash');

class TestLauncher3 {

  static get type() {
    return 'test3';
  }

  static get requiredFields() {
    return [{ name: 'fieldToLaunch' }, { name: 'testDefName' }];
  }

  static get responceFields() {
    return [
      {
        name: 'specializeValue'
      },
      {
        name: 'defValueToOutput'
      },
      {
        name: 'fieldToOutput'
      }
    ];
  }

  static process(input) {
    return _.assign({ fieldFromLauncher: input.fieldToLaunch, specializeValue: 'value' }, input);
  }
}

module.exports = TestLauncher3;
