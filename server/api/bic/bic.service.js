
'use strict';


import _ from 'lodash';
import {PdfReader, Rule} from 'pdfreader';
import request from 'request-promise';
var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));


const INDUSTRIES_URL = `https://api.businessdescription.co.nz/api/industries`;
const DIVISIONS_URL = `https://api.businessdescription.co.nz/api/industries/{{industryId}}/divisions`;
const CLASSES_URL = `https://api.businessdescription.co.nz/api/divisions/{{divisionId}}/classes`;
const BICS_URL = `https://api.businessdescription.co.nz/api/bics?filter[include]=cu&filter[include]=anzsic&filter[include]=bicrefs&filter[include]=historyBic`;
const BICS_SEED_FILENAME =`${__dirname}/../../config/seed/bic.json`;
const ACC_LEVIES_PDF_2015_2016 = `${__dirname}/../../config/seed/acc_levies.pdf`;
const ACC_LEVIES_JSON_2015_2016 = `${__dirname}/../../config/seed/acc_levies.json`;


function parseLevies(){
  return jsonfile.readFileAsync(ACC_LEVIES_JSON_2015_2016)
    .catch(err => {return {};})
    .then(levies => {

      if(_(levies).map().value().length > 0){ return levies; }

      return new Promise((resolve, reject) => {

        let cuToLeviesMap = {};

        let currentCu = '';
        let currentLevy = {};

        let currentIndex = -1;
        let currentIndexPropertyMap = {
          1: 'desc',
          2: 'lrg',
          3: 'empOrSep',
          4: 'cpxStd',
          5: 'cpxLlwc',
          6: 'rclWs'
        };

        new PdfReader().parseFileItems(ACC_LEVIES_PDF_2015_2016, function(err, item){

          if(err){ return reject(err); }
          if(! item ) { return resolve(cuToLeviesMap); }
          if(! item.text ){ return; }

          //PDF ITEM:  01110
          //PDF ITEM:  Nursery production
          //PDF ITEM:  010
          //PDF ITEM:  $0.93
          //PDF ITEM:  $1.24
          //PDF ITEM:  $1.17
          //PDF ITEM:  $0.46

          try {
            if (isCuText(item.text)) {
              currentCu = item.text;
              currentLevy = {};
              cuToLeviesMap[currentCu] = currentLevy;
              currentIndex = 1;
            }
            else if (currentIndex > 0 && currentIndex <= 6) {
              currentLevy[currentIndexPropertyMap[currentIndex++]] = item.text;
            }
          }
          catch(err){ reject(err); }
        });

      })
        .then(levies => {
          jsonfile.writeFileAsync(ACC_LEVIES_JSON_2015_2016, levies);
          return levies;
        });

    });
}



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
                        .map(clazz => {
                          return _.omit(clazz, 'id', 'name', 'anzsicId', 'cuId', 'definition', 'important', 'lastUpdateDate', 'lastUpdateUserId');
                        }).value();

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

function isCuText(text = ''){
  return text.length === 5 && getCuRegex().test(text);
}

function getCuRegex(){
  return /\b\d{5}\b/g;
}

