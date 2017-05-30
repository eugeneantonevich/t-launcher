'use strict';
const transform = require('jsonpath-object-transform');


  /**
    на выходе только те параметры, которые описаны в rules.
  */
function convert(rules, values) {
  try {
    if (!rules || !values) {
      return null;
    }
    return transform(values, rules);
  } catch (e) {
    return null;
  }
}

module.exports = convert;
