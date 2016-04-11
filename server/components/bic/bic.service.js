
'use strict';


import _ from 'lodash';
import elasticlunr from 'elasticlunr';
import request from 'request-promise';
import FuzzySet from 'fuzzyset.js';
var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));

let bicIndex, createBicIndex, bicStore = {}, createFuzzyIndex, fuzzyIndex;

const INDUSTRIES_URL = `https://api.businessdescription.co.nz/api/industries`;
const DIVISIONS_URL = `https://api.businessdescription.co.nz/api/industries/{{industryId}}/divisions`;
const CLASSES_URL = `https://api.businessdescription.co.nz/api/divisions/{{divisionId}}/classes`;
const BICS_URL = `https://api.businessdescription.co.nz/api/bics?filter[include]=cu&filter[include]=anzsic&filter[include]=bicrefs&filter[include]=historyBic`;
const BICS_SEED_FILENAME =`${__dirname}/../../config/seed/bic.json`;


export function search(query){
  return Promise.all([
    getIndex(),
    getFuzzy()
  ])
    .then(([index, fuzzy]) => {

      //TODO break up query with fuzzy tokens

      let tokens = getQueryTokens(query);
      let expandedQuery = _(tokens).map(token => {
        let matches = fuzzy.get(token);
        return _((matches || []).concat([1, token]))
          .map(match => { console.log(match); return match[0] >= 0.75 ? match[1] : undefined; })
          .filter()
          .uniq()
          .value()
          .join(' ');

      }).value().join(' ');

      console.log('Bic search query', query, expandedQuery);

      return _(index.search(expandedQuery)).map(result => {
        return bicStore[result.ref];
      }).value();
    })
    .then(bics => {
      return _(bics).map(bic => {
        return _.omit(bic, 'refs', 'keywords', 'bicrefs', 'definitionPlainText', 'anzsic', 'divisionName', 'divisionId', 'industryId',
        'industryName', 'classId', 'className', 'keywordsFlattened', 'code');
      }).value();
    });
}

function getIndex(){
  return bicIndex ? Promise.resolve(bicIndex) : generateIndex();
}

function getFuzzy(){
  return fuzzyIndex ? Promise.resolve(fuzzyIndex) : generateFuzzy();
}

function generateFuzzy() {

  return createFuzzyIndex ? createFuzzyIndex :
    createFuzzyIndex = index()
    .then(bics => {

      let bicDescriptions = _(bics).map(function (bic) {
        bic.keywordsFlattened = bic.keywords && bic.keywords.join(' ') || '';
        return (`${bic.desc} ${bic.keywordsFlattened} ${bic.industryName} ${bic.divisionName} ${bic.definitionPlainText}`).split(' ');
      })
      .flatten()
      .map(word => word.replace(/\.|\(|\)|\\|'|,|:/gi, ' ').split(' '))
      .flatten()
      .map(word => word && word.toLowerCase().trim())
      .filter()
      .uniq()
      .filter(word => elasticlunr.stopWordFilter(word))
      .filter(word => ! /^\d+$/.test(word))
      .filter(word => word.length >= 3)
      .filter(word => word !== '-')
      .value();

      return FuzzySet(bicDescriptions);
    });
}


function generateIndex(){
  return createBicIndex ? createBicIndex  :
    createBicIndex = index()
      .then(bics => {

        console.log('Generating bic index');

        //elasticlunr.Configuration({fields: {}});

        var idx = elasticlunr(function() {
          this.setRef('code');

          this.addField('code');
          this.addField('desc');

          this.addField('industryName');
          this.addField('divisionName');
          this.addField('className');
          this.addField('cu');
          this.addField('anzsic');

          this.addField('keywordsFlattened');
          this.addField('definitionPlainText');

          this.saveDocument(false);
        });

        idx.pipeline.add(
          elasticlunr.trimmer,
          elasticlunr.stopWordFilter,
          elasticlunr.stemmer
        );

        //TODO promise this as to not halt event que?

        bicStore = {};

        return delay(1000).then(()=> {
          return Promise.all(_.map(bics, (bic, index) => {
            return delay(index).then(() => {
              bic.keywordsFlattened = bic.keywords && bic.keywords.join(' ') || '';
              idx.addDoc(bic);
              bicStore[bic.code.toString()] = bic;
            });
          }));
        })
        .then(bics => {
            return bicIndex = idx; //jshint ignore:line
          });

      });

}


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
                          return _.omit(bic, 'id', 'name', 'anzsicId', 'cuId', 'definition', 'important',
                            'lastUpdateDate', 'lastUpdateUserId');
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

function delay(time = 0){
  return new Promise(resolve => setTimeout(resolve, time));
}

function getQueryTokens(query = ''){
  return _(query.split(/\b|\./)).filter().map(token => token.trim()).filter().value();
}
