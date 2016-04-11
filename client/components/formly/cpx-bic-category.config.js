
'use strict';

angular.module('cpxApp')
.config(function config(formlyConfigProvider) {
  formlyConfigProvider.setType({
    name: 'cpx-bic-category',
    templateUrl: 'components/formly/cpx-bic-category.html',
    controller: ['$scope', '$log', 'cpx', 'levy', 'Util', 'bic', '$q', '$timeout', cpxBicCategoryController]
  });
});


function cpxBicCategoryController($scope, $log, cpx, levy, Util, bic, $q, $timeout){

  const DELAY_TAB_CHANGE_DURATION = 150;

  return init();

  function init(){
    $q.all([
      bic.getBicIndustries(),
      bic.getBicDivisions(),
      bic.getBicClasses()
    ])
    .then(([industries, divisions, classes]) => {
      $scope.industryOnDemand = createIndustryOnDemand(industries);
      $scope.divisionOnDemand = createDivisionOnDemand(divisions);
      $scope.classOnDemand = createClassOnDemand(classes);
    });
    $scope.selectIndustry = selectIndustry;
    $scope.selectDivision = selectDivision;
    $scope.selectClass = selectClass;

    $scope.getCurrentLength = getCurrentLength;

    $scope.isIndustryActive = isIndustryActive;
    $scope.isDivisionActive = isDivisionActive;
    $scope.isClassActive = isClassActive;
  }

  function selectIndustry(industry){
    $log.debug('selected industry', industry);
    $timeout(() => $scope.selectedIndex = 1, DELAY_TAB_CHANGE_DURATION);
    $scope.industryFilterId = industry.industryId;
  }

  function selectDivision(division){
    $log.debug('selected division', division);
    $timeout(() => $scope.selectedIndex = 2, DELAY_TAB_CHANGE_DURATION);
    $scope.divisionFilterId = division.divisionId;
  }

  function selectClass(clazz){
    $log.debug('selected clazz', clazz);
    $scope.model[$scope.to.businessKey] = {
      cu: clazz.cu,
      desc: clazz.className,
      classId: clazz.classId
    };
  }

  function isIndustryActive(industryId){
    return $scope.industryFilterId === industryId;
  }

  function isDivisionActive(divisionId){
    return $scope.divisionFilterId === divisionId;
  }

  function isClassActive(classId){
    return $scope.model[$scope.to.businessKey] && $scope.model[$scope.to.businessKey].classId === classId;
  }

  function getCurrentLength(){
    switch($scope.selectedIndex) {
      case 1: {
        return $scope.divisionsLength
      }
      case 2: {
        return $scope.classesLength;
      }
      default: {
        return 6;
      }
    }
  }

  function createIndustryOnDemand(industries){
    return {
      getItemAtIndex: index => industries[index],
      getLength: () => industries.length
    }
  }

  function createDivisionOnDemand(divisions){

    function getDivisions(){
      return $scope.industryFilterId ?
        _(divisions).filter(division => {
          return division.industryId === $scope.industryFilterId;
        }).value() :
        divisions;
    }

    return {
      getItemAtIndex: index => getDivisions()[index],
      getLength: () => {
        let divisions = getDivisions();
        $scope.divisionsLength = divisions.length;
        return divisions.length;
      }
    }
  }

  function createClassOnDemand(classes){

    function getClasses(){
      return $scope.divisionFilterId ?
        _(classes).filter(clazz => {
          return clazz.divisionId === $scope.divisionFilterId;
        }).value() :
        $scope.industryFilterId ?
          _(classes).filter(clazz => {
            return clazz.industryId === $scope.industryFilterId;
          }).value() :
          classes;
    }

    return {
      getItemAtIndex: index => getClasses()[index],
      getLength: () => {
        let classes = getClasses();
        $scope.classesLength = classes.length;
        return classes.length;
      }
    }
  }

}
