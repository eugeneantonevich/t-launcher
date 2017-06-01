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

  resolve(data) {
    return _.transform(data, (result, launcher) => {
      const executor = this.launchers[launcher.name];
      if (_.isNil(executor)) {
        return;
      }
      result.push(_.assign(_.pick(executor, ['process', 'requiredFields', 'outputFields']), launcher));
    });
  }

  get count() {
    return _.keys(this.launchers).length;
  }
}

function factory() {
  return new LauncherContainer;
}

module.exports = factory;
