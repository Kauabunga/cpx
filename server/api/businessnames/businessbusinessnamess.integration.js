'use strict';

var app = require('../..');
import request from 'supertest';

var newBusinessnames;

describe('Businessnames API:', function() {

  describe('GET /api/businessnamess', function() {
    var businessnamess;

    beforeEach(function(done) {
      request(app)
        .get('/api/businessnamess')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          businessnamess = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      businessnamess.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/businessnamess', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/businessnamess')
        .send({
          name: 'New Businessnames',
          info: 'This is the brand new businessnames!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newBusinessnames = res.body;
          done();
        });
    });

    it('should respond with the newly created businessnames', function() {
      newBusinessnames.name.should.equal('New Businessnames');
      newBusinessnames.info.should.equal('This is the brand new businessnames!!!');
    });

  });

  describe('GET /api/businessnamess/:id', function() {
    var businessnames;

    beforeEach(function(done) {
      request(app)
        .get('/api/businessnamess/' + newBusinessnames._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          businessnames = res.body;
          done();
        });
    });

    afterEach(function() {
      businessnames = {};
    });

    it('should respond with the requested businessnames', function() {
      businessnames.name.should.equal('New Businessnames');
      businessnames.info.should.equal('This is the brand new businessnames!!!');
    });

  });

  describe('PUT /api/businessnamess/:id', function() {
    var updatedBusinessnames;

    beforeEach(function(done) {
      request(app)
        .put('/api/businessnamess/' + newBusinessnames._id)
        .send({
          name: 'Updated Businessnames',
          info: 'This is the updated businessnames!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedBusinessnames = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedBusinessnames = {};
    });

    it('should respond with the updated businessnames', function() {
      updatedBusinessnames.name.should.equal('Updated Businessnames');
      updatedBusinessnames.info.should.equal('This is the updated businessnames!!!');
    });

  });

  describe('DELETE /api/businessnamess/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/businessnamess/' + newBusinessnames._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when businessnames does not exist', function(done) {
      request(app)
        .delete('/api/businessnamess/' + newBusinessnames._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
