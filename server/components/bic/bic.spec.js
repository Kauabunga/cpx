'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bicServiceJs = require('./bic.service.js');

var BicService = _interopRequireWildcard(_bicServiceJs);

describe.only('Bic Service', function () {

  this.timeout(25000);

  it('should perform a fuzzy search', function (done) {
    return BicService.search('farming').then(function (results) {
      if (results.length < 0) {
        throw new Error('Expected at least one result');
      }
      done();
    })['catch'](done);
  });

  it('should perform a fuzzy search', function (done) {
    return BicService.search('farmig').then(function (results) {

      console.log(results);
      if (results.length < 1) {
        throw new Error('Expected at least one result');
      }
      done();
    })['catch'](done);
  });
});
//# sourceMappingURL=bic.spec.js.map
