'use strict';
const _ = require('lodash');

class SimpleResolver2 {
  static get type() {
    return 'simpleResolver2';
  }

  static resolve(launcher, parameters) {
    switch (parameters.state) {
      case 'preprocess':
        return {
          fieldToLaunch: '$.fieldFromInputData'
        };
      case 'defaults':
        return '$.testDefName';
      default:
        return '';
    }
  }
}

module.exports = SimpleResolver2;
