'use strict';
const _ = require('lodash');

class SimpleResolver {
  static get type() {
    return 'simpleResolver';
  }

  static resolve(launcher, parameters) {
    switch (parameters.state) {
      case 'preprocess':
        return {
          fieldToLaunch: '$.fieldFromInputData'
        };
      case 'postprocess':
        return _.isNil(parameters.checkParameters) ? {
          fieldToOutput: '$.fieldFromLauncher'
        } : {
          fieldToOutputResolveWithParametes: '$.fieldFromLauncher'
        };
      case 'defaults':
        return '$.testDefName';
      default:
        return '';
    }
  }
}

module.exports = SimpleResolver;
