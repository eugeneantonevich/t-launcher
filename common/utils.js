'use strict';

const _ = require('lodash');
const transform = require('jsonpath-object-transform');


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


  /**
    на выходе только те параметры, которые описаны в rules.
  */
function convert(rules, values) {
  try {
    if (!rules || !values) {
      return null;
    }
    return transform(values, rules);
  } catch (e) {
    return null;
  }
}

/**
  [ { procesor1 .. priority: 1.. }, { ..processor2.. priority: 2... } { ..processor3.. priority: 1... } ] =>
   [[{ procesor1.. priority: 1.. }, { procesor3.. priority: 1.. }], [{ .. priority: 2... }]]
*/
function chunkByPriority(launchers) {
  return _.transform(launchers, (chunk, launcher) => {
    const priority = _.isNumber(launcher.priority) ? launcher.priority : 0;
    if (_.isNil(chunk[priority])) {
      chunk[priority] = [launcher];
    } else {
      chunk[priority].push(launcher);
    }
  }, []);
}

module.exports = {
  chunkByPriority,
  convert,
  propagateValues
};
