'use strict';
const _ = require('lodash');

class SimpleResolver {

  static resolve(launcher, parameters) {
    const inputTemplate = {
      fieldToLaunch: '$.fieldFromInputData'
    };
    const outputTemplate = {
      fieldToOutput: '$.fieldFromLauncher'
    };
    return { inFieldsMatch: inputTemplate, outFieldsMatch: outputTemplate };
  }
}

module.exports = SimpleResolver;
