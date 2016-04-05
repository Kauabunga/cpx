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


export function calculateLevyInternal({cuCode, earnings, cover}){

  //TODO implement http://www.acc.co.nz/for-business/tax-agents-accountants-and-advisors/levies-and-invoicing/bus00080

  //TODO do we want to attempt to do this on the client?

  //TODO validate numeric earnings/cover parameters


  return getLevyRates()
    .then(levyRates => {
      let cuLevyRates = levyRates[cuCode];
      const WORKING_SAFER_LEVY = 0.08;


      let hunderedsOfEarnings = Math.ceil(parseFloat(earnings) / 100);
      let hunderedsOfCover = Math.ceil(parseFloat(cover) / 100);


      let currentWorkAccountLevy = cuLevyRates.empOrSep * hunderedsOfCover;
      let residualWorkAccountLevy = (cuLevyRates.rclWs - WORKING_SAFER_LEVY) * hunderedsOfEarnings;

      let currentEarnersAccountLevy = cuLevyRates.cpxStd * hunderedsOfCover * 1.25;
      let residualEarnersAccountLevy = cuLevyRates.cpxStd * hunderedsOfEarnings;

      let workingSaferLevy = WORKING_SAFER_LEVY * hunderedsOfEarnings;


      let cpxLevyRate = currentWorkAccountLevy +
                        //residualWorkAccountLevy +
                        currentEarnersAccountLevy +
                        //residualEarnersAccountLevy +
                        workingSaferLevy;

      return {
        workLevyCurrent: {
          cpx: currentWorkAccountLevy
        },
        earnersLevyCurrent: {
          cpx: currentEarnersAccountLevy
        },
        workingSaferLevy: {
          cpx: workingSaferLevy
        },
        totalWithoutGST: {
          cpx: cpxLevyRate
        }
      }
    });

  //{
  //  coverAmount: {cp: '44444.0', cpx: '55555.0', cpxLlwc: '55555.0'},
////  workLevyCurrent: {cp: '822.21', cpx: '1097.44', cpxLlwc: '1041.73'},
  //  healthAndSafetyDiscount: {cp: '0.0', cpx: '0.0', cpxLlwc: '0.0'},
  //  netWorkLevyCurrent: {cp: '822.21', cpx: '1097.44', cpxLlwc: '1041.73'},
////  earnersLevyCurrent: {cp: '672.22', cpx: '842.58', cpxLlwc: '842.58'},
  //  netTotalWorkLevy: {cp: '1494.43', cpx: '1940.02', cpxLlwc: '1884.31'},
  //  earnersLevyResidual: {cp: '0.0', cpx: '0.0', cpxLlwc: '0.0'},
////  workingSaferLevy: {cp: '44.44', cpx: '44.44', cpxLlwc: '44.44'},
  //  workLevyResidual: {cp: '0.0', cpx: '0.0', cpxLlwc: '0.0'},
  //  totalOtherLevies: {cp: '44.44', cpx: '44.44', cpxLlwc: '44.44'},
  //  totalWithoutGST: {cp: '1538.8700000000001', cpx: '1984.46', cpxLlwc: '1928.75'},
  //  totalWithGST: {cp: '1769.7', cpx: '2282.13', cpxLlwc: '2218.06'}
  //}

  //Levy name
  //What the levy covers
  //How it is calculated

  //The current portion of the Work Account levy
  //Covers medical, rehabilitation and lost earnings compensation costs for injuries that happen at work
  //The classification unit levy rate x each $100 of agreed level of lost earnings cover

  //The residual portion of the Work Account levy
  //Provides funds for the ongoing costs of work injuries that occurred before 1 July 1999 and non-work injuries to earners before 1 July 1992. This levy is spread across all levy payers
  //The classification unit residual portion levy rate x each $100 of liable earnings

  //The current portion of the Earner’s Account levy
  //Covers medical, rehabilitation and lost earnings compensation costs for any injury sustained outside work. This is paid by every employee and self-employed person in New Zealand
  //The Earner’s current portion levy rate x each $100 of agreed level of lost earnings cover x 1.25

  //The residual portion of the Earners’ levy
  //The continuing cost of non-work injuries to earners that happened between 1 July 1992 and 30 June 1999
  //The Earner’s residual portion levy rate x each $100 of liable earnings

  //The Working Safer levy
  //This levy is collected on behalf of the Department Ministry of Business, Innovation and Employment to support the activities of WorkSafe New Zealand.
  //$0.08 x each $100 of liable earnings

}

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

              //We don't care about the description
              if(currentIndex === 1){

              }
              else if(currentIndex === 2){
                currentLevy[currentIndexPropertyMap[currentIndex]] = item.text;
              }
              else {
                currentLevy[currentIndexPropertyMap[currentIndex]] = parseFloat(item.text.replace(/\$/g, ''));
              }
              currentIndex++;

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
