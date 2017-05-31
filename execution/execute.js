'use strict';
const _ = require('lodash');
const postprocess = require('./postprocess');
const preprocess = require('./preprocess');
const valueSink = require('../common/valueSink');

function _processOne(launcher, values) {
  let preprocessed = preprocess.preprocessValues(launcher, values);

  let requiredValues = preprocess.getRequieredValues(launcher, preprocessed);

  if (!preprocess.validate(requiredValues, launcher)) {
    return Promise.resolve(null);
  }
  return Promise.resolve(launcher.process(requiredValues, launcher.parameters))
    .then(result => {
      return postprocess(launcher, result);
    }, () => {
      return null;
    });
}

function _process(processorsInfo, sink) {
  if (!processorsInfo.length) {
    return Promise.resolve(sink.getValues());
  }
  const actualProcessors = _.head(processorsInfo);
  return Promise.all(_.map(actualProcessors, launcher => _processOne(launcher, sink.copy())))
  .then(responce => {
    return _.transform(responce, (result, values) => {
      _.assignIn(result, values);
    }, {});
  })
  .then(values => {
    return _process(_.drop(processorsInfo), sink.insert(values));
  });
}


/**
  Public method
  * @param {Array} launchers - called processors data.
                                    format: [ [proc1, proc2], [proc3, proc4] ]
                                    mandatory fields: name
                                    optional: inFieldsMatch, outFieldsMatch, inFieldsDefault
  * @param {Object} values - input fields values
  * @return {Object} - result fields values
*/

function execute(launchers, values) {
  const sink = valueSink(values);
  return _process(launchers, sink)
    .then(result => { return sink.insert(result).getValues(); })
    .catch(() => { return sink.getValues(); });
}

module.exports = execute;
