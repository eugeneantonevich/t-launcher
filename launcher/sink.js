'use strict';

const _ = require('lodash');

let launchers = {};

class LauncherSink {

  static get(name) {
    return launchers[name];
  }

  static register(launcher) {
    if (_.isNil(launcher)) {
      throw new Error('Launcher is empty');
    }

    if (_.isNil(launcher.type)) {
      throw new Error('Launcher should contain type');
    }

    if (_.isNil(launcher.process)) {
      throw new Error('Launcher should contain function process');
    }
    launchers[launcher.type] = launcher;
  }

  static resolve(data) {
    return _.transform(data, (result, launcher) => {
      const executor = launchers[launcher.name];
      if (_.isNil(executor)) {
        return;
      }
      result.push(_.assign(_.pick(executor, 'process'), launcher));
    });
  }

  static get count() {
    return _.keys(launchers).length;
  }
}

module.exports = LauncherSink;
