'use strict';

const _ = require('lodash');

class LauncherContainer {

  constructor() {
    this.launchers = {};
  }

  get(name) {
    return this.launchers[name];
  }

  register(launcher) {
    if (_.isNil(launcher)) {
      throw new Error('Launcher is empty');
    }

    if (_.isNil(launcher.type)) {
      throw new Error('Launcher should contain type');
    }

    if (_.isNil(launcher.process)) {
      throw new Error('Launcher should contain function process');
    }
    this.launchers[launcher.type] = launcher;
  }

  _resolve(launcher) {
    const executor = this.launchers[launcher.name];
    if (_.isNil(executor)) {
      return null;
    }
    return _.assign(_.pick(executor, ['process', 'requiredFields', 'responceFields']), launcher);
  }

  resolve(data) {
    if (_.isArray(data)) {
      return _.compact(_.transform(data, (result, launcher) => {
        result.push(this._resolve(launcher));
      }, []));
    }
    return this._resolve(data);
  }

  get count() {
    return _.keys(this.launchers).length;
  }
}

function factory() {
  return new LauncherContainer;
}

module.exports = factory;
