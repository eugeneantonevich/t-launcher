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
      return null;
    }
    return transform(values, rules);
  } catch (e) {
    return null;
  }
}

function _mapping(action, values, parameters) {
  if (_.isNil(action)) {
    return values;
  }

  if (action.rules) {
    return convert(action.rules, values);
  }

  if (_.isNil(action.resolver) || _.isNil(this.containers) || _.isNil(this.containers.resolvers)) {
    return values;
  }

  const resolver = this.containers.resolvers.get(action.resolver);

  if (_.isNil(resolver)) {
    return values;
  }

  return utils.toPromise(resolver.resolve(resolver, _.assign(parameters, { action: 'mapping' })))
    .then(rules => {
      const converted = convert(rules, values);
      return _.isNil(converted) ? values : merge(values, converted);
    });
}

function mapping(action, values, parameters) {
  return _mapping.call(this, action, values, parameters);
}

module.exports = mapping;
