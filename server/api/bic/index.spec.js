'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var bicCtrlStub = {
  index: 'bicCtrl.index'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  'delete': sinon.spy()
};

// require the index with our stubbed out modules
var bicIndex = proxyquire('./index.js', {
  'express': {
    Router: function Router() {
      return routerStub;
    }
  },
  './bic.controller': bicCtrlStub
});

describe('Bic API Router:', function () {

  it('should return an express router instance', function () {
    bicIndex.should.equal(routerStub);
  });

  describe('GET /api/bics', function () {

    it('should route to bic.controller.index', function () {
      routerStub.get.withArgs('/', 'bicCtrl.index').should.have.been.calledOnce;
    });
  });
});
//# sourceMappingURL=index.spec.js.map
