let chai = require('chai');
let like = require('chai-like');
let dirtyChai = require('dirty-chai');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../launcher');
const mapping = require('../mapping');
const SimpleResolver  = require('./resolvers/simpleResolver');
const TestLauncher  = require('./launchers/testLauncher');
const TestLauncher2  = require('./launchers/testLauncher2');

chai.use(dirtyChai);
chai.use(like);

describe('Resolve launcher mapping flow:', function () {

  before(function (done) {
    launcher.sink.register(TestLauncher);
    launcher.sink.register(TestLauncher2);
    done();
  });

  it('Mapping root should have sink', function (done) {
    expect(mapping.sink).to.be.a('function');
    done();
  });

  it('Mapping root should have resolve function', function (done) {
    expect(mapping.resolve).to.be.a('function');
    done();
  });

  it('Register resolver', function (done) {
    expect(() => mapping.sink.register(SimpleResolver)).to.not.throw();
    expect(mapping.sink.all.length).to.be.eq(1);
    done();
  });

  it('Resolve launcher as object', function () {
    return mapping.resolve({ name: 'test' })
      .then(responce => {
        expect(responce).to.be.like({
          name: 'test',
          inFieldsMatch: { fieldToLaunch: '$.fieldFromInputData' },
          outFieldsMatch: { fieldToOutput: '$.fieldFromLauncher' }
          });
      })
  });

  it('Resolve launcher as array', function () {
    return mapping.resolve([{ name: 'test' }])
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
    return launcher.execute({ name: 'test2' }, { fieldFromInputData: 'ololo'})
      .then(responce => {
        expect(responce).to.be.like({ fieldToOutput: 'ololo' });
      })
  });

});
