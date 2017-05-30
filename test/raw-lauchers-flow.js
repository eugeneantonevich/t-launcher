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
    expect(launcher.sink.register).to.be.a('function');
    done();
  });

  it('Register should throw with empty launcher', function (done) {
    expect(() => launcher.sink.register(null)).to.throw();
    done();
  });

  it('Success register', function (done) {
    expect(() => launcher.sink.register(TestLauncher)).to.not.throw();
    done();
  });

  it('Check registered launchers', function (done) {
    expect(launcher.sink.count).to.eq(1);
    done();
  });

  it('Process test launcher as object', function () {
    return launcher.execute({ name: 'test' })
      .then(responce => {
        expect(responce).to.be.like({ responce: 'value' });
      })
  });

  it('Process test launcher as object with input values', function () {
    return launcher.execute({ name: 'test' }, { additional: 'values2' })
      .then(responce => {
        expect(responce).to.be.like({ responce: 'value', additional: 'values2' });
      })
  });

});
