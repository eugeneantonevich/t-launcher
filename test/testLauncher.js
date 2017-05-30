'use strict';
const _ = require('lodash');

class TestLauncher {

  static get type() {
    return 'test';
  }

  static process(input) {
    return _.assign({ responce: 'value' }, input);
  }
}

module.exports = TestLauncher;
