'use strict';
const _ = require('lodash');

/**
 * Fill and return fields values with input default values
 * @param {Object} defaultvalues - object of rules default values
 * @param {Object} fieldsValues - input fields values
 * @return {Object} - processed fields values
 */

function propagateValues(defaults, fieldsValues) {
  if (_.isNil(fieldsValues)) {
    return;
  }
  if (_.isArray(fieldsValues)) {
    _.forEach(fieldsValues, value => propagateValues(defaults, value));
    return;
  }
  _.forEach(defaults, (value, name) => {
    if (_.isObject(value)) {
      return propagateValues(value, fieldsValues[name]);
    }

    if (_.isNil(fieldsValues[name])) {
      fieldsValues[name] = value;
    }
  });
  return fieldsValues;
}

module.exports = propagateValues;
