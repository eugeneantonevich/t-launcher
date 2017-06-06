'use strict';
const _ = require('lodash');
const actions = require('../../actions');

function postprocess(launcher, values, parameters) {
  return actions.call(this, launcher.postprocess, values, _.assign(parameters, { state: 'postprocess' }))
    .then(result => {
      return _.transform(launcher.responceFields, (res, field) => {
        if (!_.isNil(result[field.name])) {
          _.assignIn(res, _.pick(result, field.name));
        }
      }, {});
    });
}

module.exports = postprocess;
