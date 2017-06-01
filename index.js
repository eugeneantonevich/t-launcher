'use strict';
// const _ = require('lodash');
// const launcher = require('./launcher');
const containers = require('./containers');
const executor = require('./executor');

function instance() {
  let root = {};
  const resolvers = containers.resolvers();
  const launchers = containers.launchers();

  root.containers = {};
  root.containers.resolvers = resolvers;
  root.containers.launchers = launchers;

  root.execute = executor(root.containers);
  return root;
}

instance.static = instance();

module.exports = instance;
