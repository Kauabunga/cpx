'use strict';

angular.module('cpxApp')
  .service('cpx', function ($log, $sessionStorage, smoothScroll, bic, $timeout) {

    const CPX_SESSION_STORAGE_KEY = '_cpx';
    let cpxFormCache;

    this.getCurrentModel = getCurrentModel;
    this.stepBack = stepBack;
    this.completeStep = completeStep;
    this.uncompleteStep = uncompleteStep;
    this.resetCurrentForm = resetCurrentForm;
    this.scrollToStep = scrollToStep;
    this.getCpxForm = getCpxForm;
    this.exportCpxFormBase64 = exportCpxFormBase64;
    this.importCpxFormBase64 = importCpxFormBase64;
    window.exportCpxFormBase64 = exportCpxFormBase64;
    window.importCpxFormBase64 = importCpxFormBase64;

    $log.debug('Init model', getCurrentModel());

    this.flow = getFlow();

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
      return $sessionStorage[CPX_SESSION_STORAGE_KEY] = {};
    }

    function completeStep(stepName){
      getCurrentModel()[stepName] = getCurrentModel()[stepName] || {};

      let stepModel = getCurrentModel()[stepName];
      $log.debug(`Completing step ${stepName}`, stepModel);

      if(stepModel.complete) {
        //We have already completed this step - scroll to the next section
        return $timeout(() => {
          scrollToStep(getNextStep(stepName));
        }, 100);
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
      });
    }

    function getNextStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName) + 1;
      return stepIndex < flow.length ? flow[stepIndex] : undefined;
    }

    function getPreviousStep(stepName){
      let flow = getFlow();
      let stepIndex = flow.indexOf(stepName) - 1;
      return stepIndex >= 0 ? flow[stepIndex] : undefined;
    }

    function getFlow(){
      //TODO cache this
      return _.map(getCpxForm(), step => step.name);
    }

    function getCurrentModel () {
      return $sessionStorage[CPX_SESSION_STORAGE_KEY] ?
        $sessionStorage[CPX_SESSION_STORAGE_KEY] :
        $sessionStorage[CPX_SESSION_STORAGE_KEY] = {};
    }

    function exportCpxFormBase64(){
      return btoa(JSON.stringify(getCurrentModel()));
    }

    function importCpxFormBase64(base64){
      return JSON.parse(atob(base64));
    }

    function isComplete(namespace){
      return () => {
        return getCurrentModel() && getCurrentModel()[namespace] && getCurrentModel()[namespace].complete === true;
      }
    }


    //  isActive: () => { return this.welcome.isComplete() && this.elegibility.isComplete() && this.calculation.isComplete() && this.policy.isComplete(); },

    function isActive(namespace){
      return () => {
        let flow = getFlow();
        let stepIndex = flow.indexOf(namespace);
        let previousStep = getPreviousStep(namespace);

        let isActive = ! isComplete(namespace)();
        for(let i = stepIndex; i >= 0; i--){

          if(previousStep && ! isComplete(previousStep)()){
            isActive = false;
          }

          previousStep = getPreviousStep(previousStep)
        }
        return isActive;
      }
    }

    function isDisplayed(namespace){
      return () => {
        return isComplete(getPreviousStep(namespace))();
      };
    }


    function getCpxForm(){
      return cpxFormCache ? cpxFormCache : cpxFormCache = [
        {
          name: 'welcome',
          title: 'Welcome to CPX',
          fields: getWelcomeFields(),
          isDisplayed: () => { return true; },
          isActive: isActive('welcome') ,
          isComplete: isComplete('welcome')
        },
        {
          name: 'elegibility',
          title: 'Elegibility',
          fields: getElegibilityFields(),
          isDisplayed: isDisplayed('elegibility'),
          isActive: isActive('elegibility'),
          isComplete: isComplete('elegibility')
        },
        {
          name: 'calculation',
          title: 'Calculation',
          fields: getCalculationFields(),
          isDisplayed: isDisplayed('calculation'),
          isActive: isActive('calculation'),
          isComplete: isComplete('calculation')
        },
        {
          name: 'policy',
          title: 'Policy',
          fields: getPolicyFields(),
          isDisplayed: isDisplayed('policy'),
          isActive: isActive('policy'),
          isComplete: isComplete('policy')
        },
        {
          name: 'apply',
          title: 'Apply',
          fields: getApplyFields(),
          isDisplayed: isDisplayed('apply'),
          isActive: isActive('apply'),
          isComplete: isComplete('apply')
        },
        {
          name: 'details',
          title: 'Details',
          fields: getDetailsFields(),
          isDisplayed: isDisplayed('details'),
          isActive: isActive('details'),
          isComplete: isComplete('details')
        }
      ]
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
          key: 'soleTrader',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "yes"',
          templateOptions: {
            label: 'How are you self employed?',
            options: [{value:'sole', label:'Sole Trader'}, {value:'partnership', label:'Partnership'}, {value:'shareholder', label:'Shareholder'}]
          },
          expressionProperties: {
            'templateOptions.required': 'model.selfEmployed !== "yes"'
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
            label: 'Do you earn more than $590 per week or $30,680 per year?',
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}],
            class: 'horizontal'
          },
          expressionProperties: {
            'templateOptions.required': 'model.selfEmployed === "no" && model.hoursThreshold === "no"'
          }
        },

        {
          type: 'group',
          //hideExpression: '((model.soleTrader !== "partnership" || model.soleTrader !== "shareholder") && model.selfEmployed !== "yes") || ( model.selfEmployed !== "no" || model.hoursThreshold !== "no" || model.earnThreshold !== "no" )',
          hideExpression: '(model.selfEmployed !== "yes" && model.hoursThreshold === "yes" ) || ' +
          '(model.selfEmployed !== "yes" && model.earnThreshold === "yes" ) || ' +
          '(model.selfEmployed === "yes" && model.soleTrader === "sole") || ' +
          '! model.selfEmployed || ' +
          '(model.selfEmployed === "yes" && ! model.soleTrader ) || ' +
          '(model.selfEmployed === "no" && ! model.hoursThreshold ) || ' +
          '(model.selfEmployed === "no" && model.hoursThreshold === "no" && ! model.earnThreshold)',
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
                  label: 'Currently, CPX is a product available to Self Employed people that have worked over 30 hours per week or earn more than $590 per week.'
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
          hideExpression: '(model.selfEmployed === "yes" && model.soleTrader !== "sole") || ( model.selfEmployed !== "yes" && model.hoursThreshold !== "yes" && model.earnThreshold !== "yes" )',
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
                  min: 30680,
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
                hideExpression: 'model.earnings >= 120070',
                templateOptions: {
                  label: 'How much do you want to be covered for?'
                }
              },
              {
                key: 'cover',
                hideExpression: 'model.earnings >= 120070',
                type: 'slider',
                templateOptions: {
                  step: 500,
                  tabindex: -1
                },
                expressionProperties: {
                  'templateOptions.min': 'model.earnings > 120070 ? 120070 : model.earnings',
                  'templateOptions.max': '120070'
                }
              },
              {
                key: 'cover',
                type: 'input',
                hideExpression: 'model.earnings >= 120070',
                templateOptions: {
                  type: 'number',
                  placeholder: '$00,000',
                  step: 500
                },
                expressionProperties: {
                  'templateOptions.min': 'model.earnings > 120070 ? 120070 : model.earnings',
                  'templateOptions.max': '120070'
                }
              },
              {
                type: 'label',
                hideExpression: 'model.earnings <= 120070',
                templateOptions: {
                  label: 'Because you earn more than the maximum amount your coverage will be $120,070'
                }
              },
              {
                type: 'label',
                hideExpression: 'model.earnings !== 120070',
                templateOptions: {
                  label: 'Because you earn the maximum amount your coverage will be $120,070'
                }
              }
            ]
          }
        },

        {
          key: 'calculation',
          type: 'cpx-calculation',
          hideExpression: '(! model.business || ! model.earnings || (! model.cover && model.earnings <= 120070 ))',
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
        },

        {
          type: 'cpx-policy',
          templateOptions: {}
        },

        {
          key: 'selectedPolicy',
          type: 'radio',
          templateOptions: {
            label: 'What policy would you like to apply for?',
            options: [{value:'standard', label: function($scope){
              return `Apply for CPX Standard ${$scope.model.cpxCalculation}`
            }}, {value:'llwc', label: function($scope){
              return `Apply for CPX LLWC ${$scope.model.cpxLlwcCalculation}`
              }}
            ],
            onSelect: function(){
              completeStep('policy');
            }
          }
        }

      ]
    }





    function getApplyFields(){
      return [

        {
          type: 'html',
          templateOptions: {
            label: `<h3>CPX is for you!</h3>
            <p>We're glad to know you are eligible and want to apply for:</p>

            `
          }
        },
        {
          type: 'cpx-apply',
          templateOptions:{
            standardTitle: 'Standard',
            llwcTitle: 'Lower Level of Weekly Compensation'
          }
        },
        {
          type: 'html',
          templateOptions: {
            label: `
            <p>This process should take approximately 10 minutes where we
            will need the following information:</p>
<ul>
<li>Your ACC number</li>
<li>Your Company BIC and CU numbers history</li>
<li>Your accountant details</li>
</ul>
<p>You can opt for ACC to contact your accountant to obtain this information.</p>

<p>You can save the application process anytime.</p>
            `
          }
        },
        {
          type: 'button',
          templateOptions: {
            label: 'Apply now',
            type: 'submit'
          }
        }
      ]
    }

    function getDetailsFields(){
      return [

        {
          type: 'group',
          hideExpression: 'model.unknownAccNumber',
          templateOptions: {
            fields: [
              {
                type: 'label',
                templateOptions: {
                  label: `What's your ACC number?`
                }
              },
              {
                key: 'accNumber',
                type: 'input',
                templateOptions: {
                  pattern: /^([a-zA-Z][a-zA-Z]\d{7}|[a-zA-Z]\d{8})$/
                }
              },
            ]
          }
        },

        {
          type: 'button',
          hideExpression: 'model.unknownAccNumber || model.accNumber.length === 9',
          templateOptions: {
            label: `I don't know my ACC number`,
            click: function($event, model, form){
              return model.unknownAccNumber = true;
            }
          }
        },

        {
          type: 'button',
          hideExpression: '! model.unknownAccNumber',
          templateOptions: {
            label: `I've found my ACC number`,
            click: function($event, model, form){
              return model.unknownAccNumber = false;
            }
          }
        },
        {
          type: 'group',
          hideExpression: '! model.unknownAccNumber && ! model.accNumber',
          templateOptions: {
            fields: [

              {
                type: 'label',
                templateOptions: {
                  label: `What's your IRD number?`
                }
              },
              {
                key: 'irdNumber',
                type: 'input',
                templateOptions: {

                }
              },
              {
                type: 'label',
                templateOptions: {
                  label: `What's your first name?`
                }
              },
              {
                key: 'firstName',
                type: 'input',
                templateOptions: {

                }
              },
              {
                type: 'label',
                templateOptions: {
                  label: `What's your last name?`
                }
              },
              {
                key: 'lastName',
                type: 'input',
                templateOptions: {

                }
              },
            ]
          }
        }
      ]
    }


  });
