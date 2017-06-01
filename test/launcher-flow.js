let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const root = require('../');
const TestLauncher  = require('./launchers/testLauncher');

chai.use(dirtyChai);
chai.use(like);

describe('External launcher flow:', function () {

  before(function (done) {
    done();
  });
/*
  it('Root object should contain mapping ', function (done) {
    expect(root.static.mapping).to.be.a('object');
    done();
  });

  it('Mapping object should contain resolvers ', function (done) {
    expect(root.static.mapping.resolvers).to.be.a('object');
    done();
  });

  it('Mapping resolvers should contain register method ', function (done) {
    expect(root.static.mapping.resolvers.register).to.be.a('function');
    done();
  });

  it('Root object should contain execute function', function (done) {
    expect(root.static.execute).to.be.a('function');
    done();
  });

  it('Root object should contain launchers sink', function (done) {
    expect(root.static.launchers).to.be.a('object');
    done();
  });

  it('Register should throw with empty launcher', function (done) {
    this.root = root();
    expect(() => this.root.register(null)).to.throw();
    done();
  });

  it('Success register', function (done) {
    expect(() => this.root.launchers.register(TestLauncher)).to.not.throw();
    done();
  });

  it('Check registered launchers', function (done) {
    expect(this.root.launchers.get(TestLauncher.type)).to.not.empty;
    done();
  });

  it('Process test launcher as object', function () {
    return this.root.execute({ name: 'test' })
      .then(responce => {
        expect(responce).to.be.like({ responce: 'value' });
      })
  });

  it('Process test launcher as object with input values', function () {
    return this.root.execute({ name: 'test' }, { additional: 'values2' })
      .then(responce => {
        expect(responce).to.be.like({ responce: 'value', additional: 'values2' });
      })
  });
*/
});
