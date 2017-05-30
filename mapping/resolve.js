'using strict';
const _ = require('lodash');
const sink = require('./resolverSink');

/**
  * @param {Object} launcher
  * @return {Object}

  launcher.name - processor name
  launcher.inFieldsMatch - input processor field match data
  launcher.outFieldsMatch - output processOne field match data

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

    return Promise.all(_.map(sink.all, resolver => resolver.resolver(launcher, parameters)))
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
    return Promise.all(_.map(launchers, launcher => _resolveOne(launcher, parameters)))
      .then(chunk => {
        return _.transform(chunk, (res, _processors) => {
          _.map(_processors, proc => res.push(proc));
        }, []);
      });
  }
  return _resolveOne(launchers);
}

module.exports = resolve;
