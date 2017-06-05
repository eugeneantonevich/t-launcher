'use strict';

const _ = require('lodash');
const defaults = require('./defaults');
const mapping = require('./mapping');
const utils = require('../../common/utils');

let actionSink = {};
actionSink['mapping'] = mapping;
actionSink['defaults'] = defaults;

// TODO: resolve rules should be in another component

function _processOne(action, values, parameters) {
  if (_.isNil(action)) {
    return Promise.reject(new Error('logic error: action is absent'));
  }

  const name = action.action;
  if (_.isNil(name)) {
    return Promise.reject(new Error('name is absent'));
  }

  const impl = actionSink[name];
  if (_.isNil(impl)) {
    return Promise.reject(new Error('invalid action'));
  }
  return utils.toPromise(impl.call(this, action, values, parameters));
}

function _process(actions, values, parameters) {
  if (!actions.length) {
    return Promise.resolve(values);
  }
  const action = _.head(actions);
  return _processOne.call(this, action, values, parameters)
    .then(result => {
      return _process.call(this, _.drop(actions), result, parameters);
    }, (/* err */) => {
      return _process.call(this, _.drop(actions), values, parameters);
    });
}

function processActions(actions, values, parameters) {
  if (!_.isArray(actions) || !actions.length) {
    return Promise.resolve(values);
  }
  return _process.call(this, actions, values, parameters);
}

module.exports = processActions;
