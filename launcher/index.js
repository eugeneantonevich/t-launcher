'use strict';

const execute = require('./execute');
const mapping = require('../mapping');
const utils = require('../common/utils');
const laucherSink = require('./sink');
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

function launch(launchers, values) {
  let launchData = _validate(_prepare(launchers));
  if (!launchData.length) {
    return Promise.resolve(null);
  }
  return mapping.resolve(launchData)
    .then(resolved => {
      return laucherSink.resolve(resolved);
    })
    .then(executors => {
      if (!executors.length) {
        return null;
      }
      let chunks = utils.chunkByPriority(executors);
      return execute(chunks, values);
    });
}

module.exports = {
  execute: launch, sink: laucherSink
};
