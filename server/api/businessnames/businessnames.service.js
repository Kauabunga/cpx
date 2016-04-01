
'use strict';

import _ from 'lodash';
import request from 'request-promise';
import cheerio from 'cheerio';
import he from 'he';

const BUSINESSNAMES_URL = `https://www.business.govt.nz/companies/app/ui/pages/companies/search?q={{query}}&entityTypes=ALL&entityStatusGroups=ALL&incorpFrom=&incorpTo=&addressTypes=ALL&addressKeyword=&start=0&limit=50&sf=&sd=&advancedPanel=false&mode=standard`;


export function search(query){
  return Promise.resolve()
    .then(() => {
      return request(getBusinessnamesRequest(query))
      .then(parseBusinessnamesFromResponse);
    });
}

function parseBusinessnamesFromResponse(response){

  if(!response){throw new Error('No response passed to parse business names');}

  try {
    let $ = cheerio.load(response);

    return _.map($('.dataList > table > tbody > tr'), (element, index) => {
      let $element = $(element);

      let [companyNumber, businessNumber, status] = parseInfo(getHtmlFromElement($, $element, '.entityInfo'));

      return {
        name: getHtmlFromElement($, $element, '.entityName'),
        companyNumber,
        businessNumber,
        status,
        type: getHtmlFromElement($, $element, '.entityType'),
        date: getHtmlFromElement($, $element, '.incorporationDate label'),
        address: getHtmlFromElement($, $element, 'div > div')
      };
    });
  }
  catch(err){
    console.error('Error parsing business names from response', err);
    throw err;
  }
}

function getHtmlFromElement($, $element, cssIdentifier){
  return he.decode(($($element.find(cssIdentifier).get(0)).html() || '').trim());
}

function parseInfo(infoHtml = ''){
  return _(infoHtml.split(/\((\s*)\)|\(NZBN:(\s*)|<span class="entityType">|<\/span>/))
    .filter()
    .map(string => {return string && string.trim().split(/\(|\)/);})
    .flatten()
    .filter()
    .map(string => {return string && string.trim();})
    .filter()
    .value();
}

function getBusinessnamesRequest(query){
  return _.merge({ uri: getBusinessnamesUrl(query) }, getBaseRequest());
}

function getBaseRequest(){
  return {
    rejectUnauthorized: false,
    requestCert: true,
    json: true
  }
}

function getBusinessnamesUrl(query){
  if(!query){throw new Error('No query passed to business names url');}
  return BUSINESSNAMES_URL.replace('{{query}}', query);
}
