'use strict';
const _ = require('lodash');
const postprocess = require('./postprocess');
const preprocess = require('./preprocess');

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

function _process(processorsInfo, data) {
  if (!processorsInfo.length) {
    return Promise.resolve(data);
  }
  const actualProcessors = _.head(processorsInfo);
  return Promise.all(_.map(actualProcessors, launcher => _processOne(launcher, data)))
  .then(responce => {
    return _.transform(responce, (result, values) => {
      _.assignIn(result, values);
    }, {});
  })
  .then(values => {
    return _process(_.drop(processorsInfo), _.assign(data, values));
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
  return _process(launchers, values)
    .then(result => { return _.assign(values, result); })
    .catch(() => { return values; });
}

module.exports = execute;
