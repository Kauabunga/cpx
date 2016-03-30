'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var businessnamesCtrlStub = {
  index: 'businessnamesCtrl.index',
  show: 'businessnamesCtrl.show',
  create: 'businessnamesCtrl.create',
  update: 'businessnamesCtrl.update',
  destroy: 'businessnamesCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var businessnamesIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './businessnames.controller': businessnamesCtrlStub
});

describe('Businessnames API Router:', function() {

  it('should return an express router instance', function() {
    businessnamesIndex.should.equal(routerStub);
  });

  describe('GET /api/businessnamess', function() {

    it('should route to businessnames.controller.index', function() {
      routerStub.get
        .withArgs('/', 'businessnamesCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/businessnamess/:id', function() {

    it('should route to businessnames.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'businessnamesCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/businessnamess', function() {

    it('should route to businessnames.controller.create', function() {
      routerStub.post
        .withArgs('/', 'businessnamesCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/businessnamess/:id', function() {

    it('should route to businessnames.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'businessnamesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/businessnamess/:id', function() {

    it('should route to businessnames.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'businessnamesCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/businessnamess/:id', function() {

    it('should route to businessnames.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'businessnamesCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
