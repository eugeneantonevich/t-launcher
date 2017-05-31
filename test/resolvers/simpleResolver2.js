'use strict';
const _ = require('lodash');

class SimpleResolver2 {
  static get type() {
    return 'simpleResolver2';
  }

  static resolve(launcher) {
    const inputTemplate = {
      fieldToLaunch: '$.fieldFromInputData'
    };

    const outputTemplate = {
      fieldToOutput: '$.fieldFromLauncher',
      defValueToOutput: '$.testDefName'
    };
    return { inFieldsMatch: inputTemplate, outFieldsMatch: outputTemplate, inFieldsDefault: { testDefName: 'defValue' } };
  }

}

module.exports = SimpleResolver2;
