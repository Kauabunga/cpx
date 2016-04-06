
'use strict';

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.search = search;
exports.index = index;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _elasticlunr = require('elasticlunr');

var _elasticlunr2 = _interopRequireDefault(_elasticlunr);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _fuzzysetJs = require('fuzzyset.js');

var _fuzzysetJs2 = _interopRequireDefault(_fuzzysetJs);

var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));

var bicIndex = undefined,
    createBicIndex = undefined,
    bicStore = {},
    createFuzzyIndex = undefined,
    fuzzyIndex = undefined;

var INDUSTRIES_URL = 'https://api.businessdescription.co.nz/api/industries';
var DIVISIONS_URL = 'https://api.businessdescription.co.nz/api/industries/{{industryId}}/divisions';
var CLASSES_URL = 'https://api.businessdescription.co.nz/api/divisions/{{divisionId}}/classes';
var BICS_URL = 'https://api.businessdescription.co.nz/api/bics?filter[include]=cu&filter[include]=anzsic&filter[include]=bicrefs&filter[include]=historyBic';
var BICS_SEED_FILENAME = __dirname + '/../../config/seed/bic.json';

function search(query) {
  return _Promise.all([getIndex(), getFuzzy()]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var index = _ref2[0];
    var fuzzy = _ref2[1];

    //TODO break up query with fuzzy tokens

    var tokens = getQueryTokens(query);
    var expandedQuery = (0, _lodash2['default'])(tokens).map(function (token) {
      var matches = fuzzy.get(token);
      return (0, _lodash2['default'])((matches || []).concat([1, token])).map(function (match) {
        console.log(match);return match[0] >= 0.75 ? match[1] : undefined;
      }).filter().uniq().value().join(' ');
    }).value().join(' ');

    console.log('Bic search query', query, expandedQuery);

    return (0, _lodash2['default'])(index.search(expandedQuery)).map(function (result) {
      return bicStore[result.ref];
    }).value();
  });
}

function getIndex() {
  return bicIndex ? _Promise.resolve(bicIndex) : generateIndex();
}

function getFuzzy() {
  return fuzzyIndex ? _Promise.resolve(fuzzyIndex) : generateFuzzy();
}

function generateFuzzy() {

  return createFuzzyIndex ? createFuzzyIndex : createFuzzyIndex = index().then(function (bics) {

    var bicDescriptions = (0, _lodash2['default'])(bics).map(function (bic) {
      bic.keywordsFlattened = bic.keywords && bic.keywords.join(' ') || '';
      return (bic.desc + ' ' + bic.keywordsFlattened + ' ' + bic.industryName + ' ' + bic.divisionName + ' ' + bic.definitionPlainText).split(' ');
    }).flatten().map(function (word) {
      return word.replace(/\.|\(|\)|\\|'|,|:/gi, ' ').split(' ');
    }).flatten().map(function (word) {
      return word && word.toLowerCase().trim();
    }).filter().uniq().filter(function (word) {
      return _elasticlunr2['default'].stopWordFilter(word);
    }).filter(function (word) {
      return !/^\d+$/.test(word);
    }).filter(function (word) {
      return word.length >= 3;
    }).filter(function (word) {
      return word !== '-';
    }).value();

    return (0, _fuzzysetJs2['default'])(bicDescriptions);
  });
}

function generateIndex() {
  return createBicIndex ? createBicIndex : createBicIndex = index().then(function (bics) {

    console.log('Generating bic index');

    //elasticlunr.Configuration({fields: {}});

    var idx = (0, _elasticlunr2['default'])(function () {
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

    idx.pipeline.add(_elasticlunr2['default'].trimmer, _elasticlunr2['default'].stopWordFilter, _elasticlunr2['default'].stemmer);

    //TODO promise this as to not halt event que?

    bicStore = {};

    return delay(1000).then(function () {
      return _Promise.all(_lodash2['default'].map(bics, function (bic, index) {
        return delay(index).then(function () {
          bic.keywordsFlattened = bic.keywords && bic.keywords.join(' ') || '';
          idx.addDoc(bic);
          bicStore[bic.code.toString()] = bic;
        });
      }));
    }).then(function (bics) {
      return bicIndex = idx; //jshint ignore:line
    });
  });
}

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
              }).map(function (bic) {
                return _lodash2['default'].omit(bic, 'id', 'name', 'anzsicId', 'cuId', 'definition', 'important', 'lastUpdateDate', 'lastUpdateUserId');
              }).map(function (bic) {
                bic.cu = bic.cu.code;
                bic.anzsic = bic.anzsic.code;
                return bic;
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

function delay() {
  var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

  return new _Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

function getQueryTokens() {
  var query = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return (0, _lodash2['default'])(query.split(/\b|\./)).filter().map(function (token) {
    return token.trim();
  }).filter().value();
}
//# sourceMappingURL=bic.service.js.map
