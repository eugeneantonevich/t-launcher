'use strict';

const _ = require('lodash');
const defaults = require('./defaults');
const mapping = require('./mapping');
const utils = require('../../common/utils');

let actionSink = {};
actionSink['mapping'] = mapping;
actionSink['defaults'] = defaults;

// TODO: resolve rules should be in another component

function _processOne(name, actions, values, parameters) {
  if (_.isNil(name)) {
    return Promise.resolve(values);
  }

  const action = actionSink[name];
  if (_.isNil(action)) {
    return Promise.resolve(values);
  }
  return utils.toPromise(action.call(this, actions[name], values, parameters));
}

function _process(names, actions, values, parameters) {
  if (!names.length) {
    return Promise.resolve(values);
  }
  const name = _.head(names);
  return _processOne.call(this, name, actions, values, parameters)
    .then(result => {
      return _process.call(this, _.drop(names), actions, _.assign(values, result), parameters);
    });
}

function processActions(actions, values, parameters) {
  if (_.isNil(actions)) {
    return Promise.resolve(values);
  }
  return _process.call(this, _.keys(actions), actions, values, parameters);
}

module.exports = processActions;
