/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/businessnamess              ->  index
 * POST    /api/businessnamess              ->  create
 * GET     /api/businessnamess/:id          ->  show
 * PUT     /api/businessnamess/:id          ->  update
 * DELETE  /api/businessnamess/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import * as BusinessnamesService from '../../components/businessnames/businessnames.service.js';



// Gets a single Businessnames from the DB
export function search(req, res) {
  return BusinessnamesService.search(req.params.query)
    .then(responseWithResult(res))
    .catch(handleError(res));
}


function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.error('Error in businessnames controller', err);
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

