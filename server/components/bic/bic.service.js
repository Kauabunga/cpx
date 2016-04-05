
'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.search = search;
exports.index = index;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));

var INDUSTRIES_URL = 'https://api.businessdescription.co.nz/api/industries';
var DIVISIONS_URL = 'https://api.businessdescription.co.nz/api/industries/{{industryId}}/divisions';
var CLASSES_URL = 'https://api.businessdescription.co.nz/api/divisions/{{divisionId}}/classes';
var BICS_URL = 'https://api.businessdescription.co.nz/api/bics?filter[include]=cu&filter[include]=anzsic&filter[include]=bicrefs&filter[include]=historyBic';
var BICS_SEED_FILENAME = __dirname + '/../../config/seed/bic.json';

function search(query) {
  return getIndex().then(function (index) {
    return index.query(query);
  });
}

function getIndex() {}
function generateIndex() {}

function index() {
  return _Promise.resolve().then(function () {
    //TODO should seed properly and use database
    return jsonfile.readFileAsync(BICS_SEED_FILENAME)['catch'](function (err) {
      return {};
    }).then(function (bics) {

      if (bics && bics.length > 0) {
        return bics;
      }

      var bicsRequest = (0, _requestPromise2['default'])(getBicsRequest());

      return (0, _requestPromise2['default'])(getIndustriesRequest()).then(function (industries) {
        return _Promise.all((0, _lodash2['default'])(industries).map(function (industry) {
          return (0, _requestPromise2['default'])(getDivisionsRequest(industry.id)).then(function (divisions) {
            return (0, _lodash2['default'])(divisions).map(function (division) {
              division.industryName = industry.name;
              return division;
            }).value();
          });
        }).value()).then(function (divisions) {
          return _Promise.all((0, _lodash2['default'])(divisions).flatten().map(function (division) {
            return (0, _requestPromise2['default'])(getClassesRequest(division.id)).then(function (classes) {
              return (0, _lodash2['default'])(classes).map(function (clazz) {
                clazz.divisionName = division.name;
                clazz.industryName = division.industryName;
                clazz.industryId = division.industryId;
                return clazz;
              }).value();
            });
          }).value()).then(function (classes) {
            return bicsRequest.then(function (bics) {

              console.log('Fetched external /api/bics length', bics.length);

              var classesFormatted = (0, _lodash2['default'])(classes).flatten().map(function (clazz) {
                clazz.className = clazz.name;
                clazz.classId = clazz.id;
                return clazz;
              }).value();

              return (0, _lodash2['default'])(bics).map(function (bic) {
                return _lodash2['default'].merge({}, bic, _lodash2['default'].find(classesFormatted, _lodash2['default'].matchesProperty('id', bic.classId)));
              }).map(function (clazz) {
                return _lodash2['default'].omit(clazz, 'id', 'name', 'anzsicId', 'cuId', 'definition', 'important', 'lastUpdateDate', 'lastUpdateUserId');
              }).value();
            });
          }).then(function (bics) {
            //Cache to seed folder
            jsonfile.writeFileAsync(BICS_SEED_FILENAME, bics);
            return bics;
          });
        });
      });
    }).then(function (bics) {
      console.log('Service bics length', bics.length);
      return bics;
    });
  });
}

function getIndustriesRequest() {
  return _lodash2['default'].merge({ uri: getIndustriesUrl() }, getBaseRequest());
}

function getDivisionsRequest(industryId) {
  return _lodash2['default'].merge({ uri: getDivisionsUrl(industryId) }, getBaseRequest());
}

function getClassesRequest(divisionId) {
  return _lodash2['default'].merge({ uri: getClassesUrl(divisionId) }, getBaseRequest());
}
function getBicsRequest() {
  return _lodash2['default'].merge({ uri: getBicsUrl() }, getBaseRequest());
}

function getBaseRequest() {
  return {
    rejectUnauthorized: false,
    requestCert: true,
    json: true
  };
}

function getIndustriesUrl() {
  return INDUSTRIES_URL;
}

function getBicsUrl() {
  return BICS_URL;
}

function getDivisionsUrl(industryId) {
  if (!industryId) {
    throw new Error('No industry id passed');
  }
  return DIVISIONS_URL.replace('{{industryId}}', industryId);
}

function getClassesUrl(divisionId) {
  if (!divisionId) {
    throw new Error('No division id passed');
  }
  return CLASSES_URL.replace('{{divisionId}}', divisionId);
}
//# sourceMappingURL=bic.service.js.map
