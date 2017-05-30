'use strict';
const _ = require('lodash');
const convert = require('./convert');

function postprocess(laucher, values) {
  const rules = laucher.outFieldsMatch;
  if (_.isNil(rules)) {
    return values;
  }
  return convert(rules, values);
}

module.exports = postprocess;
