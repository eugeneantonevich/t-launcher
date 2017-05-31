'use strict';
const _ = require('lodash');

class ResolverSink {

  constructor() {
    this.sink = {};
  }

  register(resolver) {
    if (_.isNil(resolver.type)) {
      throw new Error('Launch resolver should contain function type');
    }

    if (_.isNil(resolver.resolve)) {
      throw new Error('Launch resolver should contain function resolve');
    }

    this.sink[resolver.type] = resolver;
  }

  get all() {
    return _.values(this.sink);
  }

  get(name) {
    return this.sink[name];
  }
}

function factory() {
  return new ResolverSink();
}

module.exports = factory;
