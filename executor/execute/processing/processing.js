'use strict';

const postprocess = require('./postprocess');
const preprocess = require('./preprocess');
const valueSink = require('../../../common/valueSink');
const _ = require('lodash');

function processOne(launcher, sink, parameters) {
  if (_.isNil(launcher)) {
    return Promise.reject(new Error('Processing launcher is empty'));
  }
  return preprocess.call(this, launcher, sink.getValues(), parameters)
    .then(preprocessed => {
      return launcher.process(preprocessed, parameters);
    })
    .then(result => {
      return postprocess.call(this, launcher, result, parameters);
    })
    .then(values => {
      return valueSink(values);
    });
}

module.exports = processOne;
