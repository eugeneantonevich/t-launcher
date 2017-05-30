'using strict';
const _ = require('lodash');
const sink = require('./resolverSink');

function _resolveOne(launcher, parameters) {
  return new Promise((complete, reject) => {
    if (_.isNil(launcher.name)) {
      return reject(new Error('Launcher name is empty'));
    }

    if (!_.isNil(launcher.inFieldsMatch) && !_.isNil(launcher.outFieldsMatch)) {
      return complete(launcher);
    }

    return Promise.all(_.map(sink.all, resolver => resolver.resolve(launcher, parameters)))
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

function resolve(launchers, parameters) {
  if (!sink.all.length) {
    return Promise.resolve(launchers);
  }
  if (_.isArray(launchers)) {
    return Promise.all(_.map(launchers, launcher => _resolveOne(launcher, parameters)));
  }
  return _resolveOne(launchers, parameters);
}

module.exports = resolve;
