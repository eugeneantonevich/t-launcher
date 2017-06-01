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

  if (action.resolver
    && !_.isNil(this.containers)) {
    const resolver = this.containers.resolves.get(action.resolver);
    return _.isNil(resolver) ? values :
      resolver.resolve(resolver, parameters)
        .then(rules => {
          const converted = convert(rules, values);
          return _.isNil(converted) ? values : merge(values, converted);
        });
  }
  return values;
}

function mapping(action, values, parameters) {
  return utils.toPromise(_mapping(action, values, parameters));
}
/*
function _resolveOne(sink, launcher, parameters) {
  return new Promise((complete, reject) => {
//    if (_.isNil(launcher.name)) {
//      return reject(new Error('Launcher name is empty'));
//    }

    if (!_.isNil(launcher.inFieldsMatch) && !_.isNil(launcher.outFieldsMatch)) {
      return complete(launcher);
    }
    let resolvers = _.isNil(parameters) ? [] : _.compact(_.map(parameters.resolvers, resolver => sink.get(resolver)));

    resolvers = !resolvers.length ? sink.all : resolvers;
    return Promise.all(_.map(resolvers, resolver => resolver.resolve(launcher, parameters)))
      .then(resolved => {
        return _.transform(resolved, (result, r) => {
          result.inFieldsMatch = _.isNil(result.inFieldsMatch) ? r.inFieldsMatch : result.inFieldsMatch;
          result.outFieldsMatch = _.isNil(result.outFieldsMatch) ? r.outFieldsMatch : result.outFieldsMatch;
          result.inFieldsDefault = _.isNil(result.inFieldsDefault) ? r.inFieldsDefault : result.inFieldsDefault;
        }, launcher);
      })
      .then(resolved => complete(resolved))
      .catch(err => reject(err));
  });
}

function resolve(sink, launchers, parameters) {
  if (_.isNil(sink) || _.isNil(launchers)) {
    return Promise.resolve(launchers);
  }

  if (!sink.all.length) {
    return Promise.resolve(launchers);
  }
  if (_.isArray(launchers)) {
    return Promise.all(_.map(launchers, launcher => _resolveOne(sink, launcher, parameters)));
  }
  return _resolveOne(sink, launchers, parameters);
}
*/
module.exports = mapping;
