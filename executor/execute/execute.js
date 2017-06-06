'use strict';
const _ = require('lodash');
const valueSink = require('../../common/valueSink');
const prepare = require('./prepare');
const processing = require('./processing');

function _processThread(launchers, sink, parameters) {
  if (!launchers.length) {
    // there are no more launchers in thread
    return Promise.resolve(sink);
  }
  const launcher = _.head(launchers);
  return processing.call(this, this.containers.launchers.resolve(launcher), sink.copy(), parameters)
    .then(resultSink => {
      return _processThread.call(this, _.drop(launchers), sink.insert(resultSink), parameters);
    }, (/* err */) => {
      // thread complete work by error
      // TODO: somehow send error
      return Promise.resolve(sink);
    });
}

function _process(threads, sink, parameters) {
  if (!threads.length) {
    return Promise.resolve(sink);
  }

  return Promise.all(_.map(threads, thread => _processThread.call(this, thread, sink.copy(), parameters)))
  .then(sinks => {
    // result of theads execution consolidate
    return valueSink.consolidate(sinks);
  });
}


/**
  [ { procesor1 .. thread: 1.. }, { ..processor2.. thread: 1... } { ..processor3.. priority: 2... } ] =>
  [[{ procesor1.. thead: 1.. }, { procesor3.. thread: 1.. }], [{ .. thread: 2... }]]
*/

function _toTheadChunk(launchers) {
  return _.compact(_.transform(launchers, (chunk, data) => {
    if (_.isArray(data)) {
      chunk.push(data);
    } else {
      chunk.push([data]);
    }
  }, []));
}


/**
  Public method
  * @param {Array} launchers - called launchers information.
  * @param {Object} values - input processing values
  * @param {Object} parameters - additional parameters
  * @return {Promise} - result values
*/

function execute(launchers, values, parameters) {
  if (_.isNil(this.containers.launchers)) {
    return Promise.resolve(values);
  }

  let prepared = prepare(launchers);

  if (!prepared.length) {
    return Promise.resolve(values);
  }
  let sink = valueSink(values);

  return _process.call(this, _toTheadChunk(prepared), sink.copy(), parameters)
    .then(result => {
      return sink.insert(result).getValues();
    })
    .catch(() => { return values; });
}

module.exports = execute;
