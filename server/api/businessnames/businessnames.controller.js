/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/businessnamess              ->  index
 * POST    /api/businessnamess              ->  create
 * GET     /api/businessnamess/:id          ->  show
 * PUT     /api/businessnamess/:id          ->  update
 * DELETE  /api/businessnamess/:id          ->  destroy
 */

'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.search = search;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _businessnamesServiceJs = require('./businessnames.service.js');

var BusinessnamesService = _interopRequireWildcard(_businessnamesServiceJs);

// Gets a single Businessnames from the DB

function search(req, res) {
  return BusinessnamesService.search(req.params.query).then(responseWithResult(res))['catch'](handleError(res));
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    console.error('Error in businessnames controller', err);
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
//# sourceMappingURL=businessnames.controller.js.map
