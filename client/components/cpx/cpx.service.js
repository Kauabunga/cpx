'use strict';

angular.module('cpxApp')
  .service('cpx', function ($log, $sessionStorage, smoothScroll) {

    const CPX_SESSION_STORAGE_KEY = '_cpx';

    this.getCurrentModel = getCurrentModel;
    this.stepBack = stepBack;
    this.completeStep = completeStep;
    this.uncompleteStep = uncompleteStep;
    this.resetCurrentForm = resetCurrentForm;

    //TODO move this into complete schema definition
    this.flow = getFlow();

    this.welcome = {
      isComplete: isComplete('welcome'),
      isActive: () => { return ! this.welcome.isComplete(); }
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

    function stepBack(currentStepName){
      return smoothScroll(document.getElementById(`step-${getFlow()[getFlow().indexOf(currentStepName) - 1]}`));
    }

    function resetCurrentForm(){
      return $sessionStorage[CPX_SESSION_STORAGE_KEY] = {};
    }

    function completeStep(stepName){
      getCurrentModel()[stepName] = getCurrentModel()[stepName] || {};
      return getCurrentModel()[stepName].complete = true;
    }

    function uncompleteStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName);
      _(getFlow()).forEach((step, index) => {
        if(index >= stepIndex){
          getCurrentModel()[stepName].complete = false;
        }
      })
    }

    function getFlow(){
      return ['welcome', 'elegibility', 'calculation'];
    }

    function getCurrentModel () {
      return $sessionStorage[CPX_SESSION_STORAGE_KEY] ?
        $sessionStorage[CPX_SESSION_STORAGE_KEY] :
        $sessionStorage[CPX_SESSION_STORAGE_KEY] = {};
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
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}],
            required: true
          }
        },
        {
          key: 'hoursThreshold',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "no"',
          templateOptions: {
            label: 'Do you work over 30 hours per week?',
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}]
          },
          expressionProperties: {
            'templateOptions.required': 'model.selfEmployed === "no"'
          }
        },
        {
          key: 'earnThreshold',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "no" || model.hoursThreshold !== "no"',
          templateOptions: {
            label: 'Do you earn more than $XXX per week?',
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}]
          },
          expressionProperties: {
            'templateOptions.required': 'model.selfEmployed === "no" && model.hoursThreshold === "no"'
          }
        },

        {
          type: 'group',
          hideExpression: 'model.selfEmployed !== "no" || model.hoursThreshold !== "no" || model.earnThreshold !== "no"',
          templateOptions: {
            fields: [
              {
                type: 'title',
                templateOptions: {
                  label: 'Try these other options.'
                }
              },
              {
                type: 'paragraph',
                templateOptions: {
                  label: 'At the moment, CPX is a product available to Self Employed people that have worked over 30 hours per week or earn more than $XXX per week.'
                }
              },
              {
                type: 'paragraph',
                templateOptions: {
                  label: 'You might be interested in trying these other options:'
                }
              },
              {
                type: 'link',
                templateOptions: {
                  label: 'Cover Plus',
                  href: 'https://www.google.co.nz/search?q=ACC%20Cover%20Plus'
                }
              },
              {
                type: 'link',
                templateOptions: {
                  label: 'Private Insurance',
                  href: 'https://www.google.co.nz/search?q=Private%20Insurance%20New%20Zealand'
                }
              }
            ]
          }
        },

        {
          type: 'button',
          hideExpression: 'model.selfEmployed === "no" && model.hoursThreshold === "no" && model.earnThreshold === "no"',
          templateOptions: {
            type: 'submit',
            label: 'Next'
          }
        }

      ];
    }

  });
