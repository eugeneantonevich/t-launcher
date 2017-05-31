let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../');
const mapping = require('../mapping');
const SimpleResolver  = require('./resolvers/simpleResolver');
const TestLauncher  = require('./launchers/testLauncher');
const TestLauncher2  = require('./launchers/testLauncher2');

chai.use(dirtyChai);
chai.use(like);

describe('Resolve launcher mapping flow:', function () {

  before(function (done) {
    this.root = launcher();
    this.root.launchers.register(TestLauncher);
    this.root.launchers.register(TestLauncher2);
    done();
  });

  it('Static should have mapping object', function (done) {
    expect(launcher.static.mapping).to.be.a('object');
    done();
  });

  it('Static mapping should resolvers object', function (done) {
    expect(launcher.static.mapping.resolvers).to.be.a('object');
    done();
  });

  it('Mapping root should have resolve function', function (done) {
    expect(mapping.resolve).to.be.a('function');
    done();
  });

  it('Register resolver', function (done) {
    expect(() => this.root.mapping.resolvers.register(SimpleResolver)).to.not.throw();
    expect(this.root.mapping.resolvers.all.length).to.be.eq(1);
    done();
  });

  it('Resolve launcher as object', function () {
    return mapping.resolve(this.root.mapping.resolvers, { name: 'test' })
      .then(responce => {
        expect(responce).to.be.like({
          name: 'test',
          inFieldsMatch: { fieldToLaunch: '$.fieldFromInputData' },
          outFieldsMatch: { fieldToOutput: '$.fieldFromLauncher' }
          });
      })
  });

  it('Resolve launcher as array', function () {
    return mapping.resolve(this.root.mapping.resolvers, [{ name: 'test' }])
      .then(responce => {
        expect(responce.length).to.be.eq(1);
        expect(responce[0]).to.be.like({
          name: 'test',
          inFieldsMatch: { fieldToLaunch: '$.fieldFromInputData' },
          outFieldsMatch: { fieldToOutput: '$.fieldFromLauncher' }
          });
      })
  });

  it('Process test launcher as object with input values', function () {
    return this.root.execute({ name: 'test2' }, { fieldFromInputData: 'testValue'})
      .then(responce => {
        expect(responce).to.be.like({ fieldToOutput: 'testValue' });
      })
  });

  it('Process test launcher as object with input values', function () {
    return this.root.execute({ name: 'test2' }, { fieldFromInputData: 'testValue'})
      .then(responce => {
        expect(responce).to.be.like({ fieldToOutput: 'testValue' });
      })
  });

  it('Process test launcher. resolve work with parameters', function () {
    return this.root.execute({ name: 'test2' }, { fieldFromInputData: 'testValue'}, { checkParameters: true })
      .then(responce => {
        expect(responce).to.be.like({ fieldToOutputResolveWithParametes: 'testValue' });
      })
  });

});
