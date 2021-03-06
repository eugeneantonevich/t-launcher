'using strict';
const _ = require('lodash');
const transform = require('jsonpath-object-transform');
const utils = require('../../common/utils');
const merge = require('deepmerge');

/**
  на выходе только те параметры, которые описаны в rules.
*/
function convert(rules, values) {
  try {
    if (!rules || !values) {
      return Promise.reject(new Error('rules or values is absent'));
    }
    return Promise.resolve(merge(values, transform(values, rules)));
  } catch (e) {
    return Promise.reject(e);
  }
}

function _mapping(action, values, parameters) {
  if (_.isNil(action)) {
    return Promise.reject(new Error('action is absent'));
  }

  if (action.rules) {
    return convert(action.rules, values);
  }

  if (_.isNil(action.resolver) || _.isNil(this.containers) || _.isNil(this.containers.resolvers)) {
    return Promise.reject(new Error('resolver name is absent or there are no registered resolvers'));
  }

  const resolver = this.containers.resolvers.get(action.resolver);
  if (_.isNil(resolver)) {
    return Promise.reject('resolver '.concat(action.resolver).concat(' is absent'));
  }

  return utils.toPromise(resolver.resolve(resolver, _.assign(parameters, { action: 'mapping' })))
    .then(rules => {
      return convert(rules, values);
    });
}

/**
  * @param {Object} action - action information
  * @param {Object} values - input processing values
  * @param {Object} parameters - additional parameters
  * @return {Promise} - result values = source values assign with converted values
*/

function mapping(action, values, parameters) {
  return _mapping.call(this, action, values, parameters);
}

module.exports = mapping;
