/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/levys              ->  index
 * POST    /api/levys              ->  create
 * GET     /api/levys/:id          ->  show
 * PUT     /api/levys/:id          ->  update
 * DELETE  /api/levys/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import * as LevyService from '../../components/levy/levy.service.js';


/**
 * /calculate/:cuCode/:earnings/:cover
 *
 */
export function calculate(req, res){
  let cuCode = req.params.cuCode;
  let earnings = req.params.earnings;
  let cover = req.params.cover;

  if( ! cuCode || ! earnings || ! cover){ return res.status(400).send();}

  return LevyService.calculate({cuCode, earnings, cover})
    .then(responseWithResult(res))
    .catch(handleError(res));
}

/**
 *
 */
export function index(req, res) {
  return LevyService.getLevyRates()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.error('Error in levy controller', err);
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

