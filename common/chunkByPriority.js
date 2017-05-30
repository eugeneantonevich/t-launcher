'use strict';

const _ = require('lodash');

/**
  [ { procesor1 .. priority: 1.. }, { ..processor2.. priority: 2... } { ..processor3.. priority: 1... } ] =>
   [[{ procesor1.. priority: 1.. }, { procesor3.. priority: 1.. }], [{ .. priority: 2... }]]
*/
function chunkByPriority(launchers) {
  if (_.isArray(launchers)) {
    return _.transform(launchers, (chunk, launcher) => {
      const priority = _.isNumber(launcher.priority) ? launcher.priority : 0;
      if (_.isNil(chunk[priority])) {
        chunk[priority] = [launcher];
      } else {
        chunk[priority].push(launcher);
      }
    }, []);
  }
  return launchers;
}

module.exports = chunkByPriority;
