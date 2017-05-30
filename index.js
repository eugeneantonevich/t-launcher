'use strict';
// const _ = require('lodash');

const resolver = require('./resolver/resolver');
const launch = require('./launcher/launch');
const launcherSink = require('./launcher/launch');

module.exports = {
  registerResolver: resolver.register,
  registerLauncher: launcherSink.register,
  launch
};
