'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var app = require('../..');

describe.only('Businessnames API:', function () {

  describe('GET /api/businessnamess/solnet', function () {
    var businessnamess;

    this.timeout(10000);

    beforeEach(function (done) {
      (0, _supertest2['default'])(app).get('/api/businessnames/solnet').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        console.log(res.body);
        businessnamess = res.body;
        done();
      });
    });

    it('should respond with JSON array', function () {
      businessnamess.should.be.instanceOf(Array);
    });
  });
});
//# sourceMappingURL=businessnames.integration.js.map
