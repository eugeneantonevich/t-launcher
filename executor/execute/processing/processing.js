'use strict';

const postprocess = require('./postprocess');
const preprocess = require('./preprocess');
const valueSink = require('../../../common/valueSink');


function processOne(launcher, sink, parameters) {
  return preprocess.call(this, launcher, sink.getValues(), parameters)
    .then(preprocessed => {
      return launcher.process(preprocessed);
    })
    .then(result => {
      return postprocess.call(this, launcher, result, parameters);
    })
    .then(values => {
      return valueSink(values);
    });
}

module.exports = processOne;
