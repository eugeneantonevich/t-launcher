'use strict';

const execute = require('./execute');
const mapping = require('../mapping');
const utils = require('../common/utils');
const _ = require('lodash');

function _validate(data) {
  return _.filter(data, launcher => !_.isNil(launcher.name));
}

function _prepare(launchers) {
  if (_.isArray(launchers)) {
    return launchers;
  }
  return [launchers];
}

function launch(launchers, values, parameters, launcherSink, resolverSink) {
  let prepared = _validate(_prepare(launchers));
  if (!prepared.length) {
    return Promise.resolve(null);
  }
  return mapping.resolve(resolverSink, prepared, parameters)
    .then(resolved => {
      return launcherSink.resolve(resolved);
    })
    .then(executors => {
      if (!executors.length) {
        return null;
      }
      return execute(utils.chunkByPriority(executors), values);
    });
}

module.exports = {
  launch
};
