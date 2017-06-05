'use strict';

const _ = require('lodash');
const utils = require('../../common/utils');

/**
 * Fill and return fields values with input default values
 * @param {Object} defValues - object of rules default values
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

function _defaults(action, values, parameters) {
  if (_.isNil(action)) {
    return Promise.reject(new Error('action not present'));
  }

  if (action.rules) {
    return propagateValues(action.rules, values);
  }

  if (_.isNil(action.resolver) || _.isNil(this.containers) || _.isNil(this.containers.resolvers)) {
    return Promise.reject(new Error('resolver name is absent'));
  }

  const resolver = this.containers.resolvers.get(action.resolver);
  return _.isNil(resolver) ? values :
    utils.toPromise(resolver.resolve(resolver, _.assign(parameters, { action: 'defaults' })))
      .then(rules => {
        return propagateValues(rules, values);
      });
}

function defaults(action, values, parameters) {
  return _defaults(action, _.clone(values), parameters);
}

module.exports = defaults;
