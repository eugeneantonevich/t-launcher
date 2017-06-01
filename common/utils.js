'use strict';

function toPromise(value) {
  return Promise.resolve(value);
}

module.exports = {
  toPromise
};
