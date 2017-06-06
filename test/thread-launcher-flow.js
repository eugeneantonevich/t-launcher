let chai = require('chai');
let like = require('chai-like');
const _ = require('lodash');

let expect = chai.expect;

const launcher = require('../');
const TestLauncher1  = require('./launchers/testLauncher');
const TestLauncher2  = require('./launchers/testLauncher2');
const TestLauncher3  = require('./launchers/testLauncher3');

chai.use(like);

describe('Launcher threads flow:', function () {

  before(function (done) {
    this.root = launcher();
    this.root.containers.launchers.register(TestLauncher1);
    this.root.containers.launchers.register(TestLauncher2);
    this.root.containers.launchers.register(TestLauncher3);
    done();
  });

  it('Launch one thread. frist laucher is valid', function () {
    return this.root.execute(
      [
        {
          name: 'test'
        },
        {
          name: 'test1'
        },
        {
          name: 'test2'
        }
      ])
      .then(responce => {
        expect(responce).to.be.like({ responce: 'value' });
      })
  });

  it('Launch one thread. One and second launchers are valid', function () {
    return this.root.execute(
      [
        {
          name: 'test'
        },
        {
          name: 'test2'
        },
        {
          name: 'test3'
        }
      ],
    {
      fieldToLaunch: 'somevalue'
    })
      .then(responce => {
        expect(responce).to.be.like({ responce: 'value', fieldFromLauncher: 'somevalue' });
        expect(responce).to.not.have.property('specializeValue');
      })
  });

  it('One thread. All is valid', function () {
    return this.root.execute(
      [
        {
          name: 'test'
        },
        {
          name: 'test2'
        },
        {
          name: 'test3'
        }
      ],
    {
      fieldToLaunch: 'somevalue',
      testDefName: 'somevalue2'
    })
      .then(responce => {
        expect(responce).to.be.like(
          {
            responce: 'value',
            fieldFromLauncher: 'somevalue',
            specializeValue: 'value',
            testDefName: 'somevalue2'
           });
      })
  });

  it('One thread. First launcher should fail', function () {
    return this.root.execute(
      [
        {
          name: 'test2'
        },
        {
          name: 'test1'
        },
        {
          name: 'test3'
        }
      ])
      .then(responce => {
        expect(responce).to.not.have.property('responce');
      })
  });

  it('One thread. First launcher should fail', function () {
    return this.root.execute(
      [
        [
          {
            name: 'test3'
          },
          {
            name: 'test1'
          }
        ],
        {
          name: 'test2'
        }
      ],
    {
      fieldToLaunch: 'testingValue'
    })
      .then(responce => {
        expect(responce).to.be.like(
          {
            fieldToLaunch: 'testingValue',
            fieldFromLauncher: 'testingValue'
          });
      })
  });

});
