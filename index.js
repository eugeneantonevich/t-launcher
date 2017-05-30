'use strict';
// const _ = require('lodash');


const launcher = require('./launcher');
const mapping = require('./mapping');

let root = {};

root.mapping = {};
root.mapping.resolvers.register = mapping.sink.register;

root.execute = launcher.execute;

root.launchers = {};
root.launchers.register = launcher.sink.register;

module.exports = root;
