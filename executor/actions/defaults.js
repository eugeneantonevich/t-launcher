'use strict';

const _ = require('lodash');
const utils = require('../../common/utils');

/**
 * Fill and return fields values with input default values
 * @param {Object} defaultvalues - object of rules default values
 * @param {Object} values - input fields values
 * @return {Object} - processed fields values
 */

function propagateValues(defValues, values) {
  if (_.isNil(values)) {
    return;
  }
  if (_.isArray(values)) {
    _.forEach(values, value => propagateValues(defValues, value));
    return;
  }
  _.forEach(defValues, (value, name) => {
    if (_.isObject(value)) {
      return propagateValues(value, values[name]);
    }

    if (_.isNil(values[name])) {
      values[name] = value;
    }
  });
  return values;
}

function defaults(action, values) {
  return utils.toPromise(propagateValues(action, values));
}

module.exports = defaults;
