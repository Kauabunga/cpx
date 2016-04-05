
'use strict';


import _ from 'lodash';
import request from 'request-promise';
var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));


const INDUSTRIES_URL = `https://api.businessdescription.co.nz/api/industries`;
const DIVISIONS_URL = `https://api.businessdescription.co.nz/api/industries/{{industryId}}/divisions`;
const CLASSES_URL = `https://api.businessdescription.co.nz/api/divisions/{{divisionId}}/classes`;
const BICS_URL = `https://api.businessdescription.co.nz/api/bics?filter[include]=cu&filter[include]=anzsic&filter[include]=bicrefs&filter[include]=historyBic`;
const BICS_SEED_FILENAME =`${__dirname}/../../config/seed/bic.json`;


export function search(query){
  return getIndex()
    .then(index => {
      return index.query(query);
    });
}

function getIndex(){}
function generateIndex(){}


export function index(){
  return Promise.resolve()
    .then(() => {
      //TODO should seed properly and use database
      return jsonfile.readFileAsync(BICS_SEED_FILENAME)
      .catch(err => {return {};})
      .then(bics => {

          if(bics && bics.length > 0) { return bics; }

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

                        console.log('Fetched external /api/bics length', bics.length);

                        let classesFormatted = _(classes).flatten().map(clazz => {
                          clazz.className = clazz.name;
                          clazz.classId = clazz.id;
                          return clazz;
                        }).value();

                        return _(bics).map(bic => {
                          return _.merge({}, bic, _.find(classesFormatted, _.matchesProperty('id', bic.classId)));
                        })
                        .map(bic => {
                          return _.omit(bic, 'id', 'name', 'anzsicId', 'cuId', 'definition', 'important', 'lastUpdateDate', 'lastUpdateUserId');
                        })
                        .map(bic => {
                          bic.cu = bic.cu.code;
                          bic.anzsic = bic.anzsic.code;
                          return bic;
                        })
                        .value();

                      });
                    })
                    .then(bics => {
                      //Cache to seed folder
                      jsonfile.writeFileAsync(BICS_SEED_FILENAME, bics);
                      return bics;
                    });
                });
            });
        })
        .then(bics => {
          console.log('Service bics length', bics.length);
          return bics;
        });
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
