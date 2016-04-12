
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'cpx-policy',
    templateUrl: 'components/formly/cpx-policy.html',
    controller: ['$scope', '$log', 'cpx', 'levy', 'Util', 'bic', '$q', '$timeout', cpxPolicyController]
  });
});


function cpxPolicyController($scope, $log, cpx, levy, Util, bic, $q, $timeout){

  let dataCache = {};
  const WEEKS_PER_YEAR = 52;
  const MINIMUM_WEEKLY_PAYMENTS = 520;

  return init();

  function init(){
    $scope.dv3Options = getOptions();
    $scope.dv3Data = dv3Data;
  }

  function getCacheKey(){
    return $scope.model.cover;
  }

  function dv3Data(){

    return dataCache[getCacheKey()] ? dataCache[getCacheKey()] :
      dataCache[getCacheKey()] = [
        {
          values: getCpxValues(),      //values - represents the array of {x,y} data points
          key: 'Standard',
          strokeWidth: 2,
          color: '#333'
        },
        {
          values: getLLWCValues(),      //values - represents the array of {x,y} data points
          key: 'LLWC', //key  - the name of the series.
          color: '#ff7f0e',  //color - optional: choose your own line color.
          strokeWidth: 2
        }
      ];
  }

  function getLLWCValues(){
    let values = [];
    for(let i = 1; i <= 10; i++){
      values.push({x: i, y: (($scope.model.cover * (Math.pow(0.8, i - 1))) / WEEKS_PER_YEAR ).toFixed(0)})
    }
    return values;
  }

  function getCpxValues(){
    let values = [];
    for(let i = 1; i <= 10; i++){
      values.push({x: i, y: ($scope.model.cover / WEEKS_PER_YEAR).toFixed(0)})
    }
    return values;
  }

  function getOptions(){
    return {
      chart: {
        type: 'lineChart',
        height: 400,
        margin: {
          top: 20,
          right: 40,
          bottom: 40,
          left: 55
        },
        x: function(d){ return d.x; },
        y: function(d){ return Math.max(d.y, MINIMUM_WEEKLY_PAYMENTS); },
        useInteractiveGuideline: true,
        pointActive: function (d) { return true; },
        forceX: [0, 10],
        forceY: [0, 2000],
        interactiveLayer: {
          showGuideLine: false,

          tooltip: {
            classes: 'cpx-policy-graph-tooltip',
            headerFormatter: function (d, i) {
              return 'Week ' + d;
            },
            valueFormatter: function (d,i) {
              return Util.currencyFormat(d);
            }
          }
        },
        xAxis: {
          axisLabel: 'Week',
          axisLabelDistance: 0
        },
        yAxis: {
          axisLabel: 'Weekly payments',
          axisLabelDistance: -10,
          tickFormat: function(d){
            return d3.format('f')(d);
          }
        }
      }
    };
  }

}
