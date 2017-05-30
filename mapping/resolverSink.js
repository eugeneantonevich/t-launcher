'use strict';
const _ = require('lodash');

let sink = [];

class ResolverSink {

  static register(resolver) {
    if (_.isNil(resolver.resolve)) {
      throw new Error('Launch resolver should contain function resolve');
    }

    sink.push(resolver);
  }

  static get all() {
    return sink;
  }
}

module.exports = ResolverSink;
