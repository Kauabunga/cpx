'use strict';

angular.module('cpxApp')
  .service('cpx', function ($log, $sessionStorage) {

    this.getCurrentModel = getCurrentModel;

    this.welcome = {
      isComplete: isComplete('welcome'),
      isActive: () => { return ! this.welcome.isComplete(); },
    };

    this.elegibility = {
      getFields: getElegibilityFields,
      isDisplayed: this.welcome.isComplete,
      isActive: () => { return this.welcome.isComplete() && ! this.elegibility.isComplete() },
      isComplete: isComplete('elegibility')
    };

    this.calculation = {
      getFields: getCalculationFields,
      isDisplayed: this.elegibility.isComplete,
      isActive: () => { return this.welcome.isComplete() && this.elegibility.isComplete() },
      isComplete: isComplete('calculation')
    };


    function getCurrentModel () {
      return $sessionStorage.cpx ? $sessionStorage.cpx : $sessionStorage.cpx = {};
    }


    function isComplete(namespace){
      return () => {
        return getCurrentModel() && getCurrentModel()[namespace] && getCurrentModel()[namespace].complete;
      }
    }

    function getCalculationFields(){
      return [
        {
          type: 'title',
          templateOptions: {
            label: 'Calculation'
          }
        }
      ];
    }

    function getElegibilityFields(){
      return [
        {
          type: 'title',
          templateOptions: {
            label: 'Eligibility'
          }
        },
        {
          key: 'selfEmployed',
          type: 'radio',
          templateOptions: {
            label: 'Are you Self Employed?',
            options: ['yes', 'no']
          }
        },
        {
          key: 'hoursThreshold',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "no"',
          templateOptions: {
            label: 'Do you work over 30 hours per week?',
            options: ['yes', 'no']
          }
        },
        {
          key: 'earnThreshold',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "no" || model.hoursThreshold !== "no"',
          templateOptions: {
            label: 'Do you earn more than $XXX.XX per week?',
            options: ['yes', 'no']
          }
        }
      ];
    }

  });
