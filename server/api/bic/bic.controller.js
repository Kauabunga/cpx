
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.index = index;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _componentsBicBicServiceJs = require('../../components/bic/bic.service.js');

var BicService = _interopRequireWildcard(_componentsBicBicServiceJs);

// Gets a list of Bics

function index(req, res) {
  return BicService.index().then(responseWithResult(res))['catch'](handleError(res));
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.error('Bic controller error', err);
    return res.status(statusCode).send();
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

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function (entity) {
    var updated = _lodash2['default'].merge(entity, updates);
    return updated.saveAsync().spread(function (updated) {
      return updated;
    });
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.removeAsync().then(function () {
        res.status(204).end();
      });
    }
  };
}
//# sourceMappingURL=bic.controller.js.map
