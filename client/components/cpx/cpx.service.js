'use strict';

angular.module('cpxApp')
  .service('cpx', function ($log, $sessionStorage, smoothScroll, bic) {

    const CPX_SESSION_STORAGE_KEY = '_cpx';

    this.getCurrentModel = getCurrentModel;
    this.stepBack = stepBack;
    this.completeStep = completeStep;
    this.uncompleteStep = uncompleteStep;
    this.resetCurrentForm = resetCurrentForm;
    this.scrollToStep = scrollToStep;

    $log.debug('Init model', getCurrentModel());

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
      isActive: () => { return this.welcome.isComplete() && this.elegibility.isComplete() && ! this.calculation.isComplete() },
      isComplete: isComplete('calculation')
    };

    this.policy = {
      getFields: getPolicyFields,
      isDisplayed: this.calculation.isComplete,
      isActive: () => { return this.welcome.isComplete() && this.elegibility.isComplete() && this.calculation.isComplete() },
      isComplete: isComplete('policy')
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

      $log.debug(`Completing step ${stepName}`);
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
          $log.debug(`CPX Uncompleting ${step}`);
          getCurrentModel()[step] = getCurrentModel()[step] || {};
          getCurrentModel()[step].complete = false;
        }
      })
    }

    function getNextStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName);
      return flow[++stepIndex];
    }

    function getFlow(){
      return ['welcome', 'elegibility', 'calculation', 'policy'];
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

    function getCpxForm(){
      return {
        welcome: {
          fields:getWelcomeFields(),
          title: 'Welcome to CPX',
          isComplete: isComplete('welcome')
        },
        elegibility: {
          fields: getElegibilityFields(),
          isComplete: isComplete('elegibility')
        },
        calculation: {
          fields: getCalculationFields(),
          isComplete: isComplete('calculation')
        },
        policy: {
          fields: getPolicyFields(),
          isComplete: isComplete('policy')
        }
      }
    }

    function getWelcomeFields(){
      return [
        {
          type: 'html',
          templateOptions: {
            className: 'cpx-welcome-container',
            label: `
<p>Ensure you know exactly how much you'll receive each week if you are injured and can't work.</p>

<p>If you choose CPX it will replace your <a href="https://google.com/search?q=standard%20CoverPlus%20product" target="_blank">standard Cover Plus product</a>.</p>

<p>This application will take you through three steps:</p>
<ol>
    <li>Ensure you are eligible</li>
    <li>Estimate your cover amount</li>
    <li>Apply for CPX</li>
</ol>
`
          }
        },
        {
          type: 'button',
          templateOptions: {
            label: 'Get started',
            type: 'submit'
          }
        }
      ];
    }


    function getElegibilityFields(){
      return [
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
            label: 'Do you earn more than $XXX per week or $XX,XXX per year?',
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
                  label: 'Check out these other options.'
                }
              },
              {
                type: 'paragraph',
                templateOptions: {
                  label: 'Currently, CPX is a product available to Self Employed people that have worked over 30 hours per week or earn more than $XXX per week.'
                }
              },
              {
                type: 'paragraph',
                templateOptions: {
                  label: 'You might be interested in having a look at these other options:'
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
        },

        {
          key: 'elegibility',
          type: 'cpx-elegibility',
          templateOptions: {}
        }

      ];
    }



    function getCalculationFields(){
      return [
        {
          type: 'group',
          templateOptions: {
            fields: [
              {
                type: 'label',
                templateOptions: {
                  label: 'What industry do you work in?'
                }
              },
              {
                key: 'business',
                hideExpression: 'model.showCategories',
                type: 'autocomplete',
                templateOptions: {
                  placeholder: 'Describe and select your business or role',
                  search: bic.search,
                  itemText: 'desc',
                  itemTemplate: 'desc'
                }
              },
              //{
              //  type: 'button',
              //  hideExpression: 'model.showCategories',
              //  templateOptions: {
              //    label: 'I can\'t find my industry',
              //    click: function($event, model, form){
              //      return model.showCategories = true;
              //    }
              //  }
              //},
              {
                type: 'button',
                hideExpression: '! model.showCategories',
                templateOptions: {
                  label: 'Click here to search for your industry bic categories',
                  click: function($event, model, form){
                    return model.showCategories = false;
                  }
                }
              },
              {
                type: 'cpx-bic-category',
                hideExpression: ' ! model.showCategories',
                templateOptions: {
                  businessKey: 'business'
                }
              }
            ]
          }
        },

        {
          type: 'group',
          hideExpression: ' ! model.business ',
          templateOptions: {
            fields: [
              {
                type: 'label',
                templateOptions: {
                  label: 'What were your earnings for the last year?'
                }
              },
              {
                key: 'earnings',
                type: 'input',
                templateOptions: {
                  //TODO use text type and parse/validate what ever the user enters
                  //Mobile - keep using number
                  type: 'number',
                  placeholder: '$00,000',
                  step: 500,
                  min: 28000,
                  max: 9999999
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
                type: 'label',
                hideExpression: 'model.earnings >= 100000',
                templateOptions: {
                  label: 'How much do you want to be covered for?'
                }
              },
              {
                key: 'cover',
                hideExpression: 'model.earnings >= 100000',
                type: 'slider',
                templateOptions: {
                  step: 500,
                  tabindex: -1
                },
                expressionProperties: {
                  'templateOptions.min': 'model.earnings > 100000 ? 100000 : model.earnings',
                  'templateOptions.max': '100000'
                }
              },
              {
                key: 'cover',
                type: 'input',
                hideExpression: 'model.earnings >= 100000',
                templateOptions: {
                  type: 'number',
                  placeholder: '$00,000',
                  step: 500
                },
                expressionProperties: {
                  'templateOptions.min': 'model.earnings > 100000 ? 100000 : model.earnings',
                  'templateOptions.max': '100000'
                }
              },
              {
                type: 'label',
                hideExpression: 'model.earnings <= 100000',
                templateOptions: {
                  label: 'Because you earn more than the maximum amount your coverage will be $100,000'
                }
              },
              {
                type: 'label',
                hideExpression: 'model.earnings !== 100000',
                templateOptions: {
                  label: 'Because you earn the maximum amount your coverage will be $100,000'
                }
              }
            ]
          }
        },

        {
          key: 'calculation',
          type: 'cpx-calculation',
          hideExpression: '(! model.business || ! model.earnings || (! model.cover && model.earnings <= 100000 ))',
          templateOptions: {
            //TODO define input params e.g. model.business, model.earnings, model.cover
            //TODO Define content within component
          }
        },


        {
          type: 'button',
          //hideExpression: ' ! model.calculation',
          hideExpression: ' ! model.business || ! model.earnings || ! model.cover',
          templateOptions: {
            type: 'submit',
            label: 'Choose your policy'
          }
        }

      ];
    }

    function getPolicyFields(){
      return [
        {
          type: 'html',
          templateOptions: {
            label: `<h3>There are two CPX policy types:</h3>
            <p><b>Standard</b> policy allows you to receive a weekly compensation for 100% of your annual income during the period you are injured.</p>
            <p><b>Lower Level of Weekly Compensation (LLWC)</b> policy allows you to pay lower ACC levies, but in the event of an injury, you'll receive a progressively decreasing weekly compensation.</p>
            `
          }
        }
      ]
    }


  });
