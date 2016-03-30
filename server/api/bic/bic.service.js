


'use strict';


import _ from 'lodash';
import request from 'request-promise';


const INDUSTRIES_URL = `https://api.businessdescription.co.nz/api/industries`;
const DIVISIONS_URL = `https://api.businessdescription.co.nz/api/industries/{{industryId}}/divisions`;
const CLASSES_URL = `https://api.businessdescription.co.nz/api/divisions/{{divisionId}}/classes`;
const BICS_URL = `https://api.businessdescription.co.nz/api/bics`;



export function index(){
  return Promise.resolve()
    .then(() => {

      let bicsRequest = request(getBicsRequest());

      return request(getIndustriesRequest())
        .then(industries => {
          return Promise.all(_(industries).map(industry => {
            return request(getDivisionsRequest(industry.id))
              .then(divisions => {
                return _(divisions).map(division => {
                  division.industryName = industry.name;
                  return division;
                }).value();
              });
          }).value())
          .then(divisions => {
              return Promise.all(_(divisions).flatten().map(division => {
                return request(getClassesRequest(division.id))
                  .then(classes => {
                    return _(classes).map(clazz => {
                      clazz.divisionName = division.name;
                      clazz.industryName = division.industryName;
                      clazz.industryId = division.industryId;
                      return clazz;
                    }).value();
                  });
              }).value())
              .then(classes => {
                  return bicsRequest.then(bics => {
                    return _(classes).flatten().map(clazz => {
                      clazz.className = clazz.name;
                      clazz.classId = clazz.id;
                      return clazz;
                    }).map(clazz => {
                      let bic = _.find(bics, _.matchesProperty('classId', clazz.classId));
                      return _.merge({}, clazz, bic);
                    })
                      .map(clazz => {
                      return _.omit(clazz, 'id', 'name', 'anzsicId', 'cuId', 'definition', 'important', 'lastUpdateDate', 'lastUpdateUserId');
                    }).value();
                  });
                })
                .then(bics => {
                  // TODO save and cache to filesystem / database / seed

                  return bics;
                });
          });
        })
    });
}


function getIndustriesRequest(){
  return _.merge({ uri: getIndustriesUrl() }, getBaseRequest());
}

function getDivisionsRequest(industryId){
  return _.merge({ uri: getDivisionsUrl(industryId) }, getBaseRequest());
}

function getClassesRequest(divisionId){
  return _.merge({ uri: getClassesUrl(divisionId) }, getBaseRequest());
}
function getBicsRequest(){
  return _.merge({ uri: getBicsUrl() }, getBaseRequest());
}

function getBaseRequest(){
  return {
    rejectUnauthorized: false,
    requestCert: true,
    json: true
  }
}

function getIndustriesUrl(){
  return INDUSTRIES_URL;
}

function getBicsUrl(){
  return BICS_URL;
}

function getDivisionsUrl(industryId){
  if(!industryId){ throw new Error('No industry id passed')}
  return DIVISIONS_URL.replace('{{industryId}}', industryId);
}

function getClassesUrl(divisionId){
  if(!divisionId){ throw new Error('No division id passed')}
  return CLASSES_URL.replace('{{divisionId}}', divisionId);
}
