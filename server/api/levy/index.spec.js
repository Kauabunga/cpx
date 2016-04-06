'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var levyCtrlStub = {
  index: 'levyCtrl.index',
  calculate: 'levyCtrl.calculate'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  'delete': sinon.spy()
};

// require the index with our stubbed out modules
var levyIndex = proxyquire('./index.js', {
  'express': {
    Router: function Router() {
      return routerStub;
    }
  },
  './levy.controller': levyCtrlStub
});

describe('Levy API Router:', function () {

  it('should return an express router instance', function () {
    levyIndex.should.equal(routerStub);
  });

  describe('GET /api/levys', function () {

    it('should route to levy.controller.index', function () {
      routerStub.get.withArgs('/', 'levyCtrl.index').should.have.been.calledOnce;
    });
  });

  describe('GET /api/levys/calculate/:cuCode/:earnings/:cover', function () {

    it('should route to levy.controller.calculate', function () {
      routerStub.get.withArgs('/calculate/:cuCode/:earnings/:cover', 'levyCtrl.calculate').should.have.been.calledOnce;
    });
  });
});
//# sourceMappingURL=index.spec.js.map
