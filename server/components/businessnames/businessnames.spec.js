'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _businessnamesServiceJs = require('./businessnames.service.js');

var BusinessnamesService = _interopRequireWildcard(_businessnamesServiceJs);

describe('Businessnames Service', function () {

  this.timeout(25000);

  it('should return a business name', function (done) {
    return BusinessnamesService.search('solnet').then(function (businessnames) {
      businessnames.length.should.not.equal(0);
      done();
    });
  });

  it('should return solnet', function (done) {
    return BusinessnamesService.search('solnet limited').then(function (businessnames) {

      var solnetBusinessName = 'solnet limited';
      var solnetBusiness = (0, _lodash2['default'])(businessnames).filter(function (businessname) {
        return businessname.name.toLowerCase() === solnetBusinessName;
      }).first();

      solnetBusiness.name.toLowerCase().should.equal(solnetBusinessName);

      done();
    });
  });
});
//# sourceMappingURL=businessnames.spec.js.map
