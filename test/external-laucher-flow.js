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

  it('Root object should contain mapping ', function (done) {
    expect(root.mapping).to.be.a('object');
    done();
  });

  it('Mapping object should contain resolvers ', function (done) {
    expect(root.mapping.resolvers).to.be.a('object');
    done();
  });

  it('Mapping resolvers should contain register method ', function (done) {
    expect(root.mapping.resolvers.register).to.be.a('function');
    done();
  });

  it('Root object should contain execute function', function (done) {
    expect(root.execute).to.be.a('function');
    done();
  });

  it('Root object should contain launchers sink', function (done) {
    expect(root.launchers).to.be.a('object');
    done();
  });

  it('Launchers sink should contain register function', function (done) {
    expect(root.launchers.register).to.be.a('function');
    done();
  });

});
