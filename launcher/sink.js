'use strict';

const _ = require('lodash');

let launchers = {};

class LauncherSink {

  static get(name) {
    return launchers[name];
  }

  static get all() {
    return launchers;
  }

  static register(name, launcher) {
    if (_.isNil(name) || _.isNil(launcher)) {
      throw new Error('Name or launcher is empty');
    }

    if (_.isNil(launcher.process)) {
      throw new Error('launcher should contain function process');
    }
    launchers[name] = launcher;
  }

  static resolve(data) {
    if (_.isArray(data)) {
      return _.compact(_.map(data, launcher => _.assign(launchers[launcher.name], launcher)));
    }
    return _.assign(launchers[data.name], data);
  }
}

module.exports = LauncherSink;
