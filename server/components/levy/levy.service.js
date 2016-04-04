'use strict';

import _ from 'lodash';
import {PdfReader, Rule} from 'pdfreader';
var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));


const ACC_LEVIES_PDF_2015_2016 = `${__dirname}/../../config/seed/acc_levies_2015_2016.pdf`;
const ACC_LEVIES_JSON_2015_2016 = `${__dirname}/../../config/seed/acc_levies_2015_2016.json`;


export function calculateLevy(){}

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


