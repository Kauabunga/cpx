
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.calculate = calculate;
exports.index = index;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _componentsLevyLevyServiceJs = require('../../components/levy/levy.service.js');

var LevyService = _interopRequireWildcard(_componentsLevyLevyServiceJs);

function calculate(req, res) {
  var cuCode = req.params.cuCode;
  var earnings = req.params.earnings;
  var cover = req.params.cover;

  if (!cuCode || !earnings || !cover) {
    return res.status(400).send();
  }

  return LevyService.calculate({ cuCode: cuCode, earnings: earnings, cover: cover }).then(responseWithResult(res))['catch'](handleError(res));
}

function index(req, res) {
  return LevyService.getLevyRates().then(responseWithResult(res))['catch'](handleError(res));
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.error('Error in levy controller', err);
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}
//# sourceMappingURL=levy.controller.js.map
