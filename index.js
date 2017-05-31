'use strict';
// const _ = require('lodash');
const launcher = require('./launcher');
const mapping = require('./mapping');
const execution = require('./execution');

function instance() {
  let root = {};
  const resolverSink = mapping.resolvers();
  const launcherSink = launcher.sink();

  root.mapping = {};
  root.mapping.resolvers = resolverSink;

  root.launchers = {};
  root.launchers = launcherSink;

  root.execute = function (launchers, values, parameters) {
    return execution.launch(launchers, values, parameters, launcherSink, resolverSink);
  };

  return root;
}

instance.static = instance();

module.exports = instance;
