'use strict';
const _ = require('lodash');
const postprocess = require('./postprocess');
const preprocess = require('./preprocess');
const valueSink = require('../common/valueSink');
const utils = require('../common/utils');

function _processOne(launcher, values) {
  return preprocess.call({ containers: this.containers }, launcher, values)
    .then(preprocessed => {
      return launcher.process(preprocessed);
    })
    .then(result => {
      return postprocess.call({ containers: this.containers }, launcher, result);
    })
    .catch(() => {
      return null;
    });
}

function _process(launchers, sink) {
  if (!launchers.length) {
    return Promise.resolve(sink.getValues());
  }
  const chunk = _.head(launchers);
  return Promise.all(_.map(chunk, launcher => _processOne.call({ containers: this.containers }, launcher, sink.copy())))
  .then(responce => {
    return _.transform(responce, (result, values) => {
      _.assignIn(result, values);
    }, {});
  })
  .then(values => {
    return _process(_.drop(launchers), sink.insert(values));
  });
}

function _validate(data) {
  return _.filter(data, launcher => !_.isNil(launcher.name));
}

function _prepare(launchers) {
  if (_.isArray(launchers)) {
    return launchers;
  }
  return [launchers];
}

/**
  Public method
  * @param {Array} launchers - called processors data.
                                    format: [ [proc1, proc2], [proc3, proc4] ]
                                    mandatory fields: name
                                    optional: inFieldsMatch, outFieldsMatch, inFieldsDefault
  * @param {Object} values - input fields values
  * @return {Promise} - result fields values
*/

function execute(launchers, values) {
  if (_.isNil(this.containers.launchers)) {
    return Promise.resolve(null);
  }

  let prepared = _validate(_prepare(launchers));
  if (!prepared.length) {
    return Promise.resolve(null);
  }

  let resolvedLaunchers = utils.chunkByPriority(this.containers.launchers.resolve(prepared));

  const sink = valueSink(values);
  return _process.call({ containers: this.containers }, resolvedLaunchers, sink)
    .then(result => { return sink.insert(result).getValues(); })
    .catch(() => { return sink.getValues(); });
}

module.exports = execute;
