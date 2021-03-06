
'use strict';

import _ from 'lodash';
import * as BicService from '../../components/bic/bic.service.js';


export function index(req, res) {
  return BicService.index()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

export function search(req, res) {
  if(! req.params.query ){return res.status(400).send();}
  return BicService.search(req.params.query)
    .then(responseWithResult(res))
    .catch(handleError(res));
}



function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.error('Bic controller error', err);
    return res.status(statusCode).send();
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
