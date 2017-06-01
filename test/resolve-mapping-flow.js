let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../');
const SimpleResolver  = require('./resolvers/simpleResolver');
const TestLauncher  = require('./launchers/testLauncher');
const TestLauncher2  = require('./launchers/testLauncher2');

chai.use(dirtyChai);
chai.use(like);

describe('Resolve launcher mapping flow:', function () {

  before(function (done) {
    this.root = launcher();
    this.root.containers.launchers.register(TestLauncher);
    this.root.containers.launchers.register(TestLauncher2);
    done();
  });

  it('Static should have containers object', function (done) {
    expect(launcher.static.containers).to.be.a('object');
    done();
  });

  it('Static containers should resolvers object', function (done) {
    expect(launcher.static.containers.resolvers).to.be.a('object');
    done();
  });

  it('Register resolver', function (done) {
    expect(() => this.root.containers.resolvers.register(SimpleResolver)).to.not.throw();
    expect(this.root.containers.resolvers.all.length).to.be.eq(1);
    done();
  });

  it('Process test launcher as object with input values', function () {
    return this.root.execute(
      {
        name: 'test2',
        preprocess: {
          mapping: {
            rules: {
              fieldToLaunch: '$.fieldFromInputData'
            }
          }
        },
        postprocess: {
          mapping: {
            resolver: 'simpleResolver'
          }
        }
      },
      {
        fieldFromInputData: 'testValue'
      })
      .then(responce => {
        expect(responce).to.be.like({ fieldToOutput: 'testValue' });
      })
  });

  it('Process test launcher as object with input values', function () {
    return this.root.execute(
      {
        name: 'test2',
        preprocess: {
          mapping: {
            rules: {
              fieldToLaunch: '$.fieldFromInputData'
            }
          }
        },
        postprocess: {
          mapping: {
            resolver: 'simpleResolver'
          }
        }
      },
      {
        fieldFromInputData: 'testValue'
      })
      .then(responce => {
        expect(responce).to.be.like({ fieldToOutput: 'testValue' });
      })
  });

  it('Process test launcher. resolve work with parameters', function () {
    return this.root.execute(
      {
        name: 'test2',
        preprocess: {
          mapping: {
            resolver: 'simpleResolver'
          }
        },
        postprocess: {
          mapping: {
            resolver: 'simpleResolver'
          }
        }
      },
      {
        fieldFromInputData: 'testValue'
      },
      {
        checkParameters: true
      })
      .then(responce => {
        expect(responce).to.be.like({ fieldToOutputResolveWithParametes: 'testValue' });
      })
  });

});
