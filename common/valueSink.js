'use strict';

const _ = require('lodash');

class Sink {
  constructor(values) {
    this._values = _.isNil(values) ? {} : values;
  }

  insert(data) {
    if (data instanceof Sink) {
      _.assignIn(this._values, data.getValues());
    } else {
      _.assignIn(this._values, data);
    }
    return this;
  }

  copy() {
    return valuesSink(_.clone(this._values));
  }

  getValues() {
    return this._values;
  }
}

function valuesSink(values) {
  return new Sink(values);
}

valuesSink.consolidate = function(sinks) {
  return _.transform(sinks, (result, sink) => {
    result.insert(sink);
  }, valuesSink(null));
};

module.exports = valuesSink;
