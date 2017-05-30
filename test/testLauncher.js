'use strict';

class TestLauncher {

  static get type() {
    return 'test';
  }

  static process() {
    return { responce: 'value' }
  }
}

module.exports = TestLauncher;
