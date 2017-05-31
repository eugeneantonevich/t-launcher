let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../');
const TestLauncher3  = require('./launchers/testLauncher3');
const SimpleResolver2  = require('./resolvers/simpleResolver2');

chai.use(dirtyChai);
chai.use(like);

describe('Default values flow:', function () {

  before(function (done) {
    this.root = launcher();
    this.root.launchers.register(TestLauncher3);
    this.root.mapping.resolvers.register(SimpleResolver2);
    done();
  });

  it('Launch with default values', function () {
    return this.root.execute({ name: 'test3' }, { fieldFromInputData: 'testValue'})
      .then(responce => {
        expect(responce).to.be.like({ defValueToOutput: 'defValue', fieldToOutput: 'testValue' });
      })
  });

});
