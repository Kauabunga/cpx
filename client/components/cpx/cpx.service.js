'use strict';

angular.module('cpxApp')
  .service('cpx', function ($log, $sessionStorage, smoothScroll, bic) {

    const CPX_SESSION_STORAGE_KEY = '_cpx';

    this.getCurrentModel = getCurrentModel;
    this.stepBack = stepBack;
    this.completeStep = completeStep;
    this.uncompleteStep = uncompleteStep;
    this.resetCurrentForm = resetCurrentForm;

    //TODO move this into complete schema definition
    this.flow = getFlow();

    this.welcome = {
      getFields: getWelcomeFields,
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

    function scrollToStep(stepName){
      return smoothScroll(document.getElementById(`step-${stepName}`));
    }

    function stepBack(currentStepName){
      return scrollToStep(getFlow()[getFlow().indexOf(currentStepName) - 1]);
    }

    function resetCurrentForm(){
      _(getFlow()).forEach(step => {
        return $sessionStorage[CPX_SESSION_STORAGE_KEY][step] = {};
      });
      return $sessionStorage[CPX_SESSION_STORAGE_KEY];
    }

    function completeStep(stepName){
      getCurrentModel()[stepName] = getCurrentModel()[stepName] || {};

      let stepModel = getCurrentModel()[stepName];
      if(stepModel.complete){
        //We have already completed this step - scroll to the next section
        return scrollToStep(getNextStep(stepName));
      }
      else {
        return stepModel.complete = true;
      }
    }

    function uncompleteStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName);
      _(flow).forEach((step, index) => {
        if(index >= stepIndex){
          getCurrentModel()[stepName].complete = false;
        }
      })
    }

    function getNextStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName);
      return flow[++stepIndex];
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

    function getWelcomeFields(){
      return [
        {
          type: 'html',
          templateOptions: {
            label: `
<h1>Welcome to CPX</h1>

<p>Ensure you know exactly how much you'll receive each week if you are injured and can't work.</p>

<p>If you choose CPX it will replace your standard CoverPlus product.</p>

<p>The application will take you through three steps:</p>
<ol>
    <li>Eligibility assessment</li>
    <li>Estimate your cover</li>
    <li>Apply for CPX</li>
</ol>
`
          }
        },
        {
          type: 'button',
          templateOptions: {
            label: 'Start my application',
            type: 'submit'
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
            class: 'horizontal',
            required: true
          }
        },
        {
          key: 'hoursThreshold',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "no"',
          templateOptions: {
            label: 'Do you work over 30 hours per week?',
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}],
            class: 'horizontal'
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
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}],
            class: 'horizontal'
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
          type: 'group',
          hideExpression: 'model.selfEmployed !== "yes" && model.hoursThreshold !== "yes" && model.earnThreshold !== "yes"',
          templateOptions: {
            fields: [
              {
                type: 'html',
                templateOptions: {
                  label: '<h3>Great! You are Eligibile for CPX.</h3>'
                }
              },
              {
                type: 'button',
                templateOptions: {
                  type: 'submit',
                  label: 'Calculate your coverage now.'
                }
              }

            ]
          }
        }

      ];
    }



    function getCalculationFields(){
      return [
        {
          type: 'title',
          templateOptions: {
            label: 'Your Cover'
          }
        },
        {
          type: 'paragraph',
          templateOptions: {
            label: 'What is your Business industry?'
          }
        },
        {
          key: 'business',
          type: 'autocomplete',
          templateOptions: {
            placeholder: 'Search for your business',
            search: bic.search,
            itemText: 'desc',
            itemTemplate: 'desc'
          }
        },

        {
          type: 'group',
          hideExpression: ' ! model.business ',
          templateOptions: {
            fields: [
              {
                type: 'paragraph',
                templateOptions: {
                  label: 'What were your earnings for the last year?'
                }
              },
              {
                key: 'earnings',
                type: 'input',
                templateOptions: {
                  type: 'number',
                  placeholder: '$00,000'
                }
              }
            ]
          }
        },
        {
          type: 'group',
          hideExpression: ' ! model.business || ! model.earnings ',
          templateOptions: {
            fields: [
              {
                type: 'paragraph',
                templateOptions: {
                  label: 'How much do you want to be covered for?'
                }
              },
              {
                key: 'cover',
                type: 'slider',
                templateOptions: {
                  min: 0,
                  max: 100000,
                  step: 500
                }
              },
              {
                key: 'cover',
                type: 'input',
                templateOptions: {
                  type: 'number',
                  placeholder: '$00,000'
                }
              }
            ]
          }
        },

        {
          type: 'cpx-calculation',
          hideExpression: ' ! model.business || ! model.earnings || ! model.cover',
          templateOptions: {
            //TODO define input params e.g. model.business, model.earnings, model.cover
          }
        }

      ];
    }


  });
