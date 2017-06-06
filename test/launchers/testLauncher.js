'use strict';
const _ = require('lodash');

class TestLauncher {

  static get type() {
    return 'test';
  }

  static get responceFields() {
    return [
      {
        name: 'responce'
      },
      {
        name: 'additional'
      }
    ];
  }

  static process(input) {
    return _.assign({ responce: 'value' }, input);
  }
}

module.exports = TestLauncher;
