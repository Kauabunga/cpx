'use strict';

import _ from 'lodash';
import he from 'he';
import request from 'request-promise';
import cheerio from 'cheerio';
import numeral from 'numeral';
import {PdfReader, Rule} from 'pdfreader';
var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));


const ACC_CPX_CALCULATOR = `https://www.levycalculators.acc.co.nz/cpx.jsp`;
const ACC_LEVIES_PDF_2015_2016 = `${__dirname}/../../config/seed/acc_levies_2015_2016.pdf`;
const ACC_LEVIES_JSON_2015_2016 = `${__dirname}/../../config/seed/acc_levies_2015_2016.json`;



export function calculateLevyExternal({cuCode, earnings, cover}){

  //TODO calculate levies using POST
  return request(getLevyRequest({cuCode, earnings, cover}))
    .then(parseExternalLevyCalculation);
}


export function calculateLevyInteral(){}

export function getLevyRates(){
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

        return new PdfReader().parseFileItems(ACC_LEVIES_PDF_2015_2016, function(err, item){

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


function isCuText(text = ''){
  return text.length === 5 && getCuRegex().test(text);
}

function getCuRegex(){
  return /\b\d{5}\b/g;
}

function getLevyRequest({cuCode, earnings, cover}){
  return {
    uri: ACC_CPX_CALCULATOR,
    method: 'POST',
    form: getBaseExternalCpxForm({cuCode, earnings, cover})
  };
}

function getBaseExternalCpxForm({cuCode, earnings, cover} = {}) {
  return {
    formName: 'cpx',
    name: '',
    levyYear: '2016',
    clientType: 'self',
    employmentStatus: 'fullTime',
    employmentStartDate: '01/04/2015',
    earnings: formatSalary(earnings),
    cover: formatSalary(cover),
    coverStartDate: '01/04/2016',
    policyOption: 'standard',
    hsDiscount: '0',
    bicCode: '',
    cuCode: cuCode,
    cuDescription: '',
    cuText: '',
    searchCUCode: '',
    searchCUName: ''
  };
}

function formatSalary(salary = 0){
  return numeral(salary).format('$0,0');
}




function parseExternalLevyCalculation(body){
  try {
    let $ = cheerio.load(body);
    return _($('#levyCalcReport fieldset#onePage > fieldset table tr')).map((row, index) => {
      let $row = $(row);
      if(isCurrencyRow($row)){
        return _($row.find('.money'))
          .map(money => {return _.get(money, 'attribs.value');})
          .tail()
          .reduce((result, value, key)=> {
            //result[getColumnNameFromIndex(key)] = parseFloat(value);
            result[getColumnNameFromIndex(key)] = value;
            return result;
          }, {});
      }
      else {
        return undefined;
      }
    }).filter().reduce((result, value, key) => {
      result[getRowNameFromIndex(key)] = value;
      return result;
    }, {});
  }
  catch(err){
    console.log('error parseExternalLevyCalculation', err);
    throw err;
  }
}


function isCurrencyRow($row){
  return $row.find('.money').length > 0;
}

function getColumnNameFromIndex(index){
  if(index > 2){throw new Error(`Column index larger than expected (${index})`);}
  return {
    0: 'cp',
    1: 'cpx',
    2: 'cpxLlwc'
  }[index];
}

function getRowNameFromIndex(index){
  if(index > 11){throw new Error(`Row index larger than expected (${index})`);}
  return {
    0: 'coverAmount',
    1: 'workLevyCurrent',
    2: 'healthAndSafetyDiscount',
    3: 'netWorkLevyCurrent',
    4: 'earnersLevyCurrent',
    5: 'netTotalWorkLevy',
    6: 'earnersLevyResidual',
    7: 'workingSaferLevy',
    8: 'workLevyResidual',
    9: 'totalOtherLevies',
    10: 'totalWithoutGST',
    11: 'totalWithGST'
  }[index];
}
