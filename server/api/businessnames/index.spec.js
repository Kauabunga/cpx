'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var businessnamesCtrlStub = {
  search: 'businessnamesCtrl.search'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  'delete': sinon.spy()
};

// require the index with our stubbed out modules
var businessnamesIndex = proxyquire('./index.js', {
  'express': {
    Router: function Router() {
      return routerStub;
    }
  },
  './businessnames.controller': businessnamesCtrlStub
});

describe('Businessnames API Router:', function () {

  it('should return an express router instance', function () {
    businessnamesIndex.should.equal(routerStub);
  });

  describe('GET /api/businessnamess/search', function () {

    it('should route to businessnames.controller.search', function () {
      routerStub.get.withArgs('/:query', 'businessnamesCtrl.search').should.have.been.calledOnce;
    });
  });
});
//# sourceMappingURL=index.spec.js.map
