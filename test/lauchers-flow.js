let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../launcher');
const testProcessor = require('./testLauncher');

chai.use(dirtyChai);
chai.use(like);

describe('Data processor path suite:', function () {

  before(function (done) {
    done();
  });

  it('1. root object should contain registrator launcher function', function (done) {
    expect(launcher.sink.register('test', null)).to.throw();
    done();
  });

});
