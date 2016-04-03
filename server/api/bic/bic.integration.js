'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _supertest = require('supertest');

var _supertest2 = _interopRequireDefault(_supertest);

var app = require('../..');

describe('Bic API:', function () {

  describe('GET /api/bics', function () {
    var bics;

    beforeEach(function (done) {
      (0, _supertest2['default'])(app).get('/api/bics').expect(200).expect('Content-Type', /json/).end(function (err, res) {
        if (err) {
          return done(err);
        }
        bics = res.body;
        done();
      });
    });

    it('should respond with JSON array', function () {
      bics.should.be.instanceOf(Array);
    });
  });
});
//# sourceMappingURL=bic.integration.js.map
