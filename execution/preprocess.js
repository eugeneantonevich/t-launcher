'use strict';
const _ = require('lodash');
const utils = require('../common/utils');
const merge = require('deepmerge');

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

let preprocess = {};

preprocess.getRequieredValues = function(launcher, values) {
  return _prepareData(values, launcher.requiredFields);
};

preprocess.preprocessValues = function(launcher, values) {
  let matched = utils.convert(launcher.inFieldsMatch, _.clone(values));
  matched = _.isNil(matched) ? values : merge(values, matched);
  return utils.propagateValues(launcher.inFieldsDefault, matched);
};

preprocess.validate = function(values, launcher) {
  const template = launcher.requiredFields;
  if (_.isArray(values)) {
    return _.every(values, v => {
      return preprocess.validate(v, template);
    });
  }
  return _validate(values, template) ?
     _.every(template, t => { return t.fields ? preprocess.validate(values[t.name], t.fields) : true; })
    : false;
};

module.exports = preprocess;
