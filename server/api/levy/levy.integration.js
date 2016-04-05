'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var app = require('../..');

describe('Levy API:', function () {

  describe('GET /api/levys', function () {
    var levys;

    beforeEach(function (done) {
      (0, _supertest2['default'])(app).get('/api/levys').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        levys = res.body;
        done();
      });
    });

    it('should respond with a list of levys', function () {

      (0, _lodash2['default'])(levys).map().value().length > 0;
    });
  });

  describe('GET /api/levys/calculate/:cuCode/:earnings/:cover', function () {

    var calculation;

    beforeEach(function (done) {
      (0, _supertest2['default'])(app).get('/api/levys/calculate/11010/55555/55555').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        calculation = res.body;
        done();
      });
    });

    it('should respond with a calculation', function () {
      calculation.totalWithoutGST.cpx.should.equal('1984.46');
    });
  });
});
//# sourceMappingURL=levy.integration.js.map
