'use strict';

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.calculate = calculate;
exports.calculateLevyExternal = calculateLevyExternal;
exports.calculateLevyInternal = calculateLevyInternal;
exports.getLevyRates = getLevyRates;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _he = require('he');

var _he2 = _interopRequireDefault(_he);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _pdfreader = require('pdfreader');

var jsonfile = require('bluebird').promisifyAll(require('jsonfile'));

var ACC_CPX_CALCULATOR = 'https://www.levycalculators.acc.co.nz/cpx.jsp';
var ACC_LEVIES_PDF_2015_2016 = __dirname + '/../../config/seed/acc_levies_2015_2016.pdf';
var ACC_LEVIES_JSON_2015_2016 = __dirname + '/../../config/seed/acc_levies_2015_2016.json';

function calculate(params) {
  return calculateLevyExternal(params);
}

function calculateLevyExternal(_ref) {
  var cuCode = _ref.cuCode;
  var earnings = _ref.earnings;
  var cover = _ref.cover;

  return (0, _requestPromise2['default'])(getLevyRequest({ cuCode: cuCode, earnings: earnings, cover: cover })).then(parseExternalLevyCalculation);
}

function calculateLevyInternal(_ref2) {
  var cuCode = _ref2.cuCode;
  var earnings = _ref2.earnings;
  var cover = _ref2.cover;

  //TODO implement http://www.acc.co.nz/for-business/tax-agents-accountants-and-advisors/levies-and-invoicing/bus00080

  //TODO do we want to attempt to do this on the client?

  //TODO validate numeric earnings/cover parameters

  return getLevyRates().then(function (levyRates) {
    var cuLevyRates = levyRates[cuCode];
    var WORKING_SAFER_LEVY = 0.08;

    var hunderedsOfEarnings = Math.ceil(parseFloat(earnings) / 100);
    var hunderedsOfCover = Math.ceil(parseFloat(cover) / 100);

    var currentWorkAccountLevy = cuLevyRates.empOrSep * hunderedsOfCover;
    var residualWorkAccountLevy = (cuLevyRates.rclWs - WORKING_SAFER_LEVY) * hunderedsOfEarnings;

    var currentEarnersAccountLevy = cuLevyRates.cpxStd * hunderedsOfCover * 1.25;
    var residualEarnersAccountLevy = cuLevyRates.cpxStd * hunderedsOfEarnings;

    var workingSaferLevy = WORKING_SAFER_LEVY * hunderedsOfEarnings;

    var cpxLevyRate = currentWorkAccountLevy +
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
    };
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

function getLevyRates() {
  return jsonfile.readFileAsync(ACC_LEVIES_JSON_2015_2016)['catch'](function (err) {
    return {};
  }).then(function (levies) {

    if ((0, _lodash2['default'])(levies).map().value().length > 0) {
      return levies;
    }

    return new _Promise(function (resolve, reject) {

      var cuToLeviesMap = {};

      var currentCu = '';
      var currentLevy = {};

      var currentIndex = -1;
      var currentIndexPropertyMap = {
        1: 'desc',
        2: 'lrg',
        3: 'empOrSep',
        4: 'cpxStd',
        5: 'cpxLlwc',
        6: 'rclWs'
      };

      return new _pdfreader.PdfReader().parseFileItems(ACC_LEVIES_PDF_2015_2016, function (err, item) {

        if (err) {
          return reject(err);
        }
        if (!item) {
          return resolve(cuToLeviesMap);
        }
        if (!item.text) {
          return;
        }

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
          } else if (currentIndex > 0 && currentIndex <= 6) {

            //We don't care about the description
            if (currentIndex === 1) {} else if (currentIndex === 2) {
              currentLevy[currentIndexPropertyMap[currentIndex]] = item.text;
            } else {
              currentLevy[currentIndexPropertyMap[currentIndex]] = parseFloat(item.text.replace(/\$/g, ''));
            }
            currentIndex++;
          }
        } catch (err) {
          reject(err);
        }
      });
    }).then(function (levies) {
      jsonfile.writeFileAsync(ACC_LEVIES_JSON_2015_2016, levies);
      return levies;
    });
  });
}

function isCuText() {
  var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

  return text.length === 5 && getCuRegex().test(text);
}

function getCuRegex() {
  return (/\b\d{5}\b/g
  );
}

function getLevyRequest(_ref3) {
  var cuCode = _ref3.cuCode;
  var earnings = _ref3.earnings;
  var cover = _ref3.cover;

  return {
    uri: ACC_CPX_CALCULATOR,
    method: 'POST',
    form: getBaseExternalCpxForm({ cuCode: cuCode, earnings: earnings, cover: cover })
  };
}

function getBaseExternalCpxForm() {
  var _ref4 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var cuCode = _ref4.cuCode;
  var earnings = _ref4.earnings;
  var cover = _ref4.cover;

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

function formatSalary() {
  var salary = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

  return (0, _numeral2['default'])(salary).format('$0,0');
}

function parseExternalLevyCalculation(body) {
  try {
    var _ret = (function () {
      var $ = _cheerio2['default'].load(body);
      return {
        v: (0, _lodash2['default'])($('#levyCalcReport fieldset#onePage > fieldset table tr')).map(function (row, index) {
          var $row = $(row);
          if (isCurrencyRow($row)) {
            return (0, _lodash2['default'])($row.find('.money')).map(function (money) {
              return _lodash2['default'].get(money, 'attribs.value');
            }).tail().reduce(function (result, value, key) {
              //result[getColumnNameFromIndex(key)] = parseFloat(value);
              result[getColumnNameFromIndex(key)] = value;
              return result;
            }, {});
          } else {
            return undefined;
          }
        }).filter().reduce(function (result, value, key) {
          result[getRowNameFromIndex(key)] = value;
          return result;
        }, {})
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  } catch (err) {
    console.log('error parseExternalLevyCalculation', err);
    throw err;
  }
}

function isCurrencyRow($row) {
  return $row.find('.money').length > 0;
}

function getColumnNameFromIndex(index) {
  if (index > 2) {
    throw new Error('Column index larger than expected (' + index + ')');
  }
  return ({
    0: 'cp',
    1: 'cpx',
    2: 'cpxLlwc'
  })[index];
}

function getRowNameFromIndex(index) {
  if (index > 11) {
    throw new Error('Row index larger than expected (' + index + ')');
  }
  return ({
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
  })[index];
}
//# sourceMappingURL=levy.service.js.map
