'use strict';
const _ = require('lodash');
const actions = require('../../actions');

function _validate(values, template) {
  const keys = _.keys(values);
  return _.every(template, t => {
    const value = values[t.name];
    return _.includes(keys, t.name) && !_.isNil(value)
      && (!_.isArray(value) || value.length > 0 || !!t.allowEmpty);
  });
}

/**
  prepareData take only required fields for data processor inout values
  and remove values from array if they not valid
*/

function _prepareData(values, template) {
  return _.transform(template, (result, t) => {
    let vls = values[t.name];
    if (_.isArray(vls)) {
      result[t.name] = _.filter(vls, value => _validate(value, t.fields));
    } else {
      _.assignIn(result, _.pick(values, t.name));
    }
  }, {});
}


function _requieredValues (launcher, values) {
  return _.isNil(launcher.requiredFields) ? values : _prepareData(values, launcher.requiredFields);
}

function _checkValue(values, template) {
  if (_.isArray(values)) {
    return _.every(values, v => {
      return _checkValue(v, template);
    });
  }
  return _validate(values, template) ?
     _.every(template, t => { return t.fields ? _checkValue(values[t.name], t.fields) : true; })
    : false;
}

function validate(values, launcher) {
  return _checkValue(values, launcher.requiredFields);
}

function preprocess(launcher, values, parameters) {
  return new Promise((resolve, reject) => {
    if (_.isNil(launcher)) {
      return reject(new Error('launcher is empty'));
    }
    return actions.call(this, launcher.preprocess, values, _.assign(parameters, { state: 'preprocess' }))
      .then(preprocessed => {
        const required = _requieredValues(launcher, preprocessed);
        if (validate(required, launcher)) {
          return resolve(required);
        }
        return reject(new Error('Some required values are absent!'));
      });
  });
}

module.exports = preprocess;
