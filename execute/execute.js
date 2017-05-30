'use strict';
const _ = require('lodash');
const processorsSink = require('./processors/index');
const postprocess = require('./postprocess');
const preprocess = require('./preprocess');

function _processOne(launchData, values) {
  const processor = processorsSink.get(launchData.name);
  if (!processor) {
    return Promise.resolve(null);
  }

  let preprocessed = preprocess.preprocessValues(launchData, values);

  let preparedData = preprocess.prepareValuesToLaunch(preprocessed, processor.inputFields);

  if (!preprocess.validate(preparedData, processor.inputFields)) {
    return Promise.resolve(null);
  }
  return Promise.resolve(processor.process(preparedData, launchData.parameters))
    .then(result => {
      return postprocess(launchData, result);
    }, () => {
      return null;
    });
}

function _process(processorsInfo, data) {
  if (!processorsInfo.length) {
    return Promise.resolve(data);
  }
  const actualProcessors = _.head(processorsInfo);
  return Promise.all(_.map(actualProcessors, laucher => _processOne(laucher, data)))
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
  if (_.isArray(launchers)) {
    return _process(launchers, values)
      .then(result => { return _.assign(values, result); })
      .catch(() => { return values; });
  }
  return _processOne(launchers, values);
}

module.exports = execute;
