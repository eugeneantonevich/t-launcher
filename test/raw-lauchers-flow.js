let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../launcher');
const TestLauncher  = require('./launchers/testLauncher');

chai.use(dirtyChai);
chai.use(like);

describe('Raw launcher flow:', function () {

  before(function (done) {
    done();
  });

  it('Root object should contain registration sink ', function (done) {
    expect(launcher.sink).to.be.a('function');
    done();
  });

  it('Root launcher sink object should contain register function ', function (done) {
    expect(launcher.sink().register).to.be.a('function');
    done();
  });

});
