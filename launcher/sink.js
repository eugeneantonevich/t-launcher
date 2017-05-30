'use strict';

let launchers = {};

class LauncherSink {
  static get(name) {
    return launchers[name];
  }

  static register(name, launcher) {
    launchers[name] = launcher;
  }
}

module.exports = LauncherSink;
