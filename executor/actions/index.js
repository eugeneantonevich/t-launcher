'use strict';

const _ = require('lodash');
const defaults = require('./defaults');
const mapping = require('./mapping');

let actionSink = {};
actionSink['mapping'] = mapping;
actionSink['defaults'] = defaults;

function _processOne(name, actions, values, parameters) {
  const action = actionSink[name];
  if (_.isNil(action)) {
    return Promise.resolve(null);
  }
  return action(actions[name], values, parameters);
}

function _process(names, actions, values, parameters) {
  if (!names.length) {
    return Promise.resolve(values);
  }
  const name = _.head(names);
  return _processOne(name, actions, values, parameters)
    .then(result => {
      return _process(_.drop(names), actions, _.assignIn(values, result), parameters);
    })
}

function processActions(actions, values, parameters) {
  if (_.isNil(actions)) {
    return Promise.resolve(values);
  }
  return _process(_.keys(actions), actions, values, parameters);
}

module.exports = processActions;
