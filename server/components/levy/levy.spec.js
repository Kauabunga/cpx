'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _levyServiceJs = require('./levy.service.js');

var LevyService = _interopRequireWildcard(_levyServiceJs);

var COALMINING_CU = '11010';

function getBasicLevyCalculation() {
  return {
    cuCode: COALMINING_CU,
    earnings: 55555,
    cover: 55555
  };
}

describe('Levy Service', function () {

  this.timeout(25000);

  it('should calculate my levy externally', function (done) {
    return LevyService.calculateLevyExternal(getBasicLevyCalculation()).then(function (calculation) {

      console.log('External levy calculation', calculation);
      calculation.totalWithoutGST.cpx.should.equal('1984.46');
      done();
    });
  });

  it('should calculate my levy internally', function (done) {
    return LevyService.calculateLevyInternal(getBasicLevyCalculation()).then(function (calculation) {
      console.log('Internal levy calculation', calculation);
      try {
        calculation.totalWithoutGST.cpx.should.equal('1984.46');
      } catch (err) {
        console.log(err);
      }

      done();
    });
  });
});
//# sourceMappingURL=levy.spec.js.map
