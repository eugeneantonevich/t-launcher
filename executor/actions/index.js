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
    return Promise.resolve(values);
  }

  const name = action.action;
  if (_.isNil(name)) {
    return Promise.resolve(values);
  }

  const impl = actionSink[name];
  if (_.isNil(impl)) {
    return Promise.resolve(values);
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
      return _process.call(this, _.drop(actions), _.assign(values, result), parameters);
    });
}

function processActions(actions, values, parameters) {
  if (!_.isArray(actions) || !actions.length) {
    return Promise.resolve(values);
  }
  return _process.call(this, actions, values, parameters);
}

module.exports = processActions;
