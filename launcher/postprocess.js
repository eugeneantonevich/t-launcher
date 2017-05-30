'use strict';
const _ = require('lodash');
const utils = require('../common/utils');

function postprocess(launcher, values) {
  const rules = launcher.outFieldsMatch;
  if (_.isNil(rules)) {
    return values;
  }
  return utils.convert(rules, values);
}

module.exports = postprocess;
