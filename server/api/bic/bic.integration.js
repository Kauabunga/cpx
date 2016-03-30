'use strict';

var app = require('../..');
import request from 'supertest';

describe.only('Bic API:', function() {

  describe('GET /api/bics', function() {
    var bics;

    beforeEach(function(done) {
      request(app)
        .get('/api/bics')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          bics = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      bics.should.be.instanceOf(Array);
    });

  });

});
