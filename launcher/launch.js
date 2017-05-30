'use strict';
const utils = require('./common/utils');
const resolver = require('../resolver/resolver');
const execute = require('../execute/execute');

function launch(launchers, values) {
  let resolved = resolver.resolve(launchers);

  let chunks = utils.chunkByPriority(resolved);

  return execute(chunks, values);
}

module.exports = launch;
