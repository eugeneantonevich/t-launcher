let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../launcher');
const TestLauncher  = require('./testLauncher');

chai.use(dirtyChai);
chai.use(like);

describe('Data processor path suite:', function () {

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

  it('Process test launcher', function (done) {
    launcher.execute({ name: 'test' })
      .then(responce => console.log(responce))
      .then(() => done())
      .catch(err => {
        done();
      })
  });

});
