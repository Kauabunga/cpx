'use strict';

var app = require('../..');
import request from 'supertest';
import _ from 'lodash';


describe('Levy API:', function() {

  describe('GET /api/levys', function() {
    var levys;

    beforeEach(function(done) {
      request(app)
        .get('/api/levys')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          levys = res.body;
          done();
        });
    });

    it('should respond with a list of levys', function() {

      _(levys).map().value().length > 0;

    });

  });

  describe('GET /api/levys/calculate/:cuCode/:earnings/:cover', function() {

    var calculation;

    beforeEach(function(done) {
      request(app)
        .get('/api/levys/calculate/11010/55555/55555')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          calculation = res.body;
          done();
        });
    });

    it('should respond with a calculation', function() {
      calculation.totalWithoutGST.cpx.should.equal('1984.46');
    });

  });

});
