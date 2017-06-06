'use strict';

const _ = require('lodash');

function _prepare(launchers) {
  if (_.isArray(launchers)) {
    return launchers;
  }
  return [launchers];
}

function filter(launchers) {
  return _.filter(launchers, launcher => !_.isNil(launcher.name));
}

function prepare(launchers) {
  return _.compact(filter(_prepare(launchers)));
}

module.exports = prepare;
