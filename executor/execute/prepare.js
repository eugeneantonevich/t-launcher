'use strict';

const _ = require('lodash');

function _prepare(launchers) {
  if (_.isArray(launchers)) {
    return launchers;
  }
  return [launchers];
}

function prepare(launchers) {
  return _.compact(_prepare(launchers));
}

module.exports = prepare;
