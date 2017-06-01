'use strict';
// const _ = require('lodash');
// const utils = require('../common/utils');
const actions = require('./actions');

function postprocess(launcher, values, parameters) {
  return actions(launcher.postrocess, values, parameters);
}

module.exports = postprocess;
