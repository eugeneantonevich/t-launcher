'use strict';
const _ = require('lodash');
const actions = require('./actions');

function postprocess(launcher, values, parameters) {
  return actions.call(this, launcher.postprocess, values, _.assign(parameters, { state: 'postprocess' }));
}

module.exports = postprocess;
