'use strict';
const _ = require('lodash');

class SimpleResolver {
  static get type() {
    return 'simpleResolver';
  }

  static resolve(launcher, parameters) {
    const inputTemplate = {
      fieldToLaunch: '$.fieldFromInputData'
    };

    const outputTemplate = _.isNil(parameters) || _.isNil(parameters.checkParameters) ? {
      fieldToOutput: '$.fieldFromLauncher'
    } : {
      fieldToOutputResolveWithParametes: '$.fieldFromLauncher'
    };
    return { inFieldsMatch: inputTemplate, outFieldsMatch: outputTemplate };
  }
}

module.exports = SimpleResolver;
