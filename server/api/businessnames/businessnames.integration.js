'use strict';

var app = require('../..');
import request from 'supertest';

describe.only('Businessnames API:', function() {

  describe('GET /api/businessnamess/solnet', function() {
    var businessnamess;

    this.timeout(10000);

    beforeEach(function(done) {
      request(app)
        .get('/api/businessnames/solnet')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          console.log(res.body);
          businessnamess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      businessnamess.should.be.instanceOf(Array);
    });

  });

});
