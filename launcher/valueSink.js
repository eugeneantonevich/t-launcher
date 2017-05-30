'use strict';

const _ = require('lodash');

class Sink {
  constructor(values) {
    this._values = _.isNil(values) ? {} : values;
  }

  insert(values) {
    _.assignIn(this._values, values);
    return this;
  }

  copy() {
    return _.clone(this._values);
  }

  getValues() {
    return this._values;
  }
}

function valuesSink(values) {
  return new Sink(values);
}

module.exports = valuesSink;
