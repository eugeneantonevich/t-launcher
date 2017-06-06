'use strict';
const _ = require('lodash');
const actions = require('../../actions');

function postprocess(launcher, values, parameters) {
  let responce = values;
  if (!_.isNil(launcher.responceFields)) {
    responce = _.transform(launcher.responceFields, (res, field) => {
      if (!_.isNil(values[field.name])) {
        _.assignIn(res, _.pick(values, field.name));
      }
    }, {});
  }
  return actions.call(this, launcher.postprocess, responce, _.assign(parameters, { state: 'postprocess' }));
}

module.exports = postprocess;
