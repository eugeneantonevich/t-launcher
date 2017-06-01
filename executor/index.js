'use strict';

const execute = require('./execute');
const _ = require('lodash');

function factory(containers) {
  return _.bind(execute, { containers });
}

module.exports = factory;
