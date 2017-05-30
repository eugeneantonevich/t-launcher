'using strict';
const _ = require('lodash');

let resolverSink = [];

function register(resolver) {
  if (_.isNil(resolver.resolve)) {
    throw new Error('Launch resolver should contain function resolve');
  }

  resolverSink.push(resolver);
}

/**
  * @param {Object} launcher
  * @return {Object}

  laucher.name - processor name
  laucher.inFieldsMatch - input processor field match data
  laucher.outFieldsMatch - output processOne field match data

  inFieldsMatch present in processorInfo => return same object
  outFieldsMatch present in processorInfo => return same object

  inFieldsMatch or outFieldsMatch not present => try get from data base

  return merge input info + data from base.
  there are may be more then one configuration for dataProcessor => resp all
  return input configuration in case no processot was found
*/

function _resolveOne(launcher, parameters) {
  return new Promise((complete, reject) => {
    if (_.isNil(launcher.name)) {
      return complete(null);
    }

    if (!_.isNil(launcher.inFieldsMatch) && !_.isNil(launcher.outFieldsMatch)) {
      return complete(launcher);
    }

    return Promise.all(_.map(resolverSink, resolver => resolver.resolver(launcher, parameters)))
      .then(resolved => {
        return _.transform(resolved, (result, r) => {
          if (_.isNil(result.inFieldsMatch)) {
            result.inFieldsMatch = r.inFieldsMatch;
          }
          if (_.isNil(result.outFieldsMatch)) {
            result.outFieldsMatch = r.outFieldsMatch;
          }
          if (_.isNil(result.inFieldsDefault)) {
            result.inFieldsDefault = r.inFieldsDefault;
          }
        }, launcher);
      })
      .then(resolved => complete(resolved))
      .catch(err => reject(err));
  });
}

function resolve(launchers, parameters) {
  if (_.isArray(launchers)) {
    return Promise.all(_.map(launchers, laucher => _resolveOne(laucher, parameters)))
      .then(chunk => {
        return _.transform(chunk, (res, _processors) => {
          _.map(_processors, proc => res.push(proc));
        }, []);
      });
  }
  return _resolveOne(launchers);
}

module.exports = {
  register,
  resolve
};
