
'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.search = search;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

var BUSINESSNAMES_URL = 'https://www.business.govt.nz/companies/app/ui/pages/companies/search?q={{query}}&entityTypes=ALL&entityStatusGroups=ALL&incorpFrom=&incorpTo=&addressTypes=ALL&addressKeyword=&start=0&limit=50&sf=&sd=&advancedPanel=false&mode=standard';

function search(query) {
  return _Promise.resolve().then(function () {
    return (0, _requestPromise2['default'])(getBusinessnamesRequest(query)).then(parseBusinessnamesFromResponse).then(filterRemovedBusinessnames);
  });
}

function filterRemovedBusinessnames(businessnames) {
  return (0, _lodash2['default'])(businessnames).filter(function (businessname) {
    return businessname.status && businessname.status.toLowerCase() !== 'removed';
  }).value();
}

function parseBusinessnamesFromResponse(response) {

  if (!response) {
    throw new Error('No response passed to parse business names');
  }

  try {
    var _ret = (function () {
      var $ = _cheerio2['default'].load(response);

      return {
        v: _lodash2['default'].map($('.dataList > table > tbody > tr'), function (element, index) {
          var $element = $(element);

          var _parseInfo = parseInfo(getHtmlFromElement($, $element, '.entityInfo'));

          var _parseInfo2 = _slicedToArray(_parseInfo, 3);

          var companyNumber = _parseInfo2[0];
          var businessNumber = _parseInfo2[1];
          var status = _parseInfo2[2];

          return {
            name: getHtmlFromElement($, $element, '.entityName'),
            companyNumber: companyNumber,
            businessNumber: businessNumber,
            status: status,
            type: getHtmlFromElement($, $element, '.entityType'),
            date: getHtmlFromElement($, $element, '.incorporationDate label'),
            address: getHtmlFromElement($, $element, 'div > div')
          };
        })
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  } catch (err) {
    console.error('Error parsing business names from response', err);
    throw err;
  }
}

function getHtmlFromElement($, $element, cssIdentifier) {
  return _he2['default'].decode(($($element.find(cssIdentifier).get(0)).html() || '').trim());
}

function parseInfo() {
  var infoHtml = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return (0, _lodash2['default'])(infoHtml.split(/\((\s*)\)|\(NZBN:(\s*)|<span class="entityType">|<\/span>/)).filter().map(function (string) {
    return string && string.trim().split(/\(|\)/);
  }).flatten().filter().map(function (string) {
    return string && string.trim();
  }).filter().value();
}

function getBusinessnamesRequest(query) {
  return _lodash2['default'].merge({ uri: getBusinessnamesUrl(query) }, getBaseRequest());
}

function getBaseRequest() {
  return {
    rejectUnauthorized: false,
    requestCert: true,
    json: true
  };
}

function getBusinessnamesUrl(query) {
  if (!query) {
    throw new Error('No query passed to business names url');
  }
  return BUSINESSNAMES_URL.replace('{{query}}', query);
}
//# sourceMappingURL=businessnames.service.js.map
