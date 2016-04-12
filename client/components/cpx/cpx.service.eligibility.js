'use strict';

angular.module('cpxApp')
  .service('cpxeligibility', function () {

    this.getElegibilityFields = getElegibilityFields;


    function getElegibilityFields(){
      return [
        {
          key: 'selfEmployed',
          type: 'radio',
          templateOptions: {
            label: 'Are you self-employed?',
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}],
            onSelect: ($event, radio, model, form) => {
              model.selfEmployedHelp = false;
            },
            required: true
          }
        },
        {
          type: 'link',
          templateOptions: {
            label: 'How do I know if I am self-employed or not?',
            onClick: function($event, model, form){
              $event.preventDefault();
              model.selfEmployedHelp = ! model.selfEmployedHelp;
            }
          }
        },
        {
          type: 'paragraph',
          hideExpression: '! model.selfEmployedHelp',
          templateOptions: {
            label: `You are self-employed if you work as a sole trader, in a partnership, or your income is subject to taxes or any schedular payments.`
          }
        },

        {
          type: 'group',
          hideExpression: 'model.selfEmployed !== "yes"',
          templateOptions: {
            fields: [
              {
                key: 'soleTrader',
                type: 'radio',
                templateOptions: {
                  label: 'How are you self-employed?',
                  options: [{value:'sole', label:'Sole Trader'}, {value:'partnership', label:'Partnership'}, {value:'shareholder', label:'Shareholder'}],
                },
                expressionProperties: {
                  'templateOptions.required': 'model.selfEmployed !== "yes"'
                }
              },
              {
                type: 'link',
                templateOptions: {
                  label: 'What’s the difference between a Sole Trader, Partnership, and Shareholder?',
                  onClick: function($event, model, form){
                    $event.preventDefault();
                    model.soleTraderHelp = ! model.soleTraderHelp;
                  }
                }
              },
              {
                type: 'paragraph',
                hideExpression: '! model.soleTraderHelp',
                templateOptions: {
                  label: `You are Sole Trader if you are the only owner of a business, you are in a Partnership if you own a business with other person and you are a Share Holder if you own shares in a close company that employs you.`
                }
              }
            ]
          }
        },



        {
          key: 'hoursThreshold',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "yes" || ! model.soleTrader || model.soleTrader !== "sole"',
          templateOptions: {
            label: 'Do you work over 30 hours per week for your business?',
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}]
          },
          expressionProperties: {
            'templateOptions.required': 'model.selfEmployed === "yes" && model.soleTrader === "sole"'
          }
        },
        {
          key: 'earnThreshold',
          type: 'radio',
          hideExpression: 'model.selfEmployed !== "yes" || ! model.soleTrader || model.soleTrader !== "sole" || model.hoursThreshold !== "no"',
          templateOptions: {
            label: 'Do you earn more than $590 per week or $30,680 per year?',
            options: [{value:'yes', label:'Yes'}, {value:'no', label:'No'}]
          },
          expressionProperties: {
            'templateOptions.required': 'model.selfEmployed === "yes" && model.soleTrader === "sole" && model.hoursThreshold === "no"'
          }
        },

        {
          type: 'group',
          hideExpression: '! model.selfEmployed || ' +
          '(model.selfEmployed === "yes" && ! model.soleTrader) || ' +
          '(model.selfEmployed === "yes" && (model.soleTrader !== "partnership" && model.soleTrader !== "shareholder") && ! model.hoursThreshold) || ' +
          '(model.selfEmployed === "yes" && model.soleTrader === "sole" && ! model.hoursThreshold ) || ' +
          '(model.selfEmployed === "yes" && model.soleTrader === "sole" && model.hoursThreshold === "yes" ) || ' +
          '(model.selfEmployed === "yes" && model.soleTrader === "sole" && model.hoursThreshold === "no" && ! model.earnThreshold ) || ' +
          '(model.selfEmployed === "yes" && model.soleTrader === "sole" && model.hoursThreshold === "no" && model.earnThreshold !== "no")',
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
          hideExpression: ' ! model.selfEmployed || ' +
          'model.selfEmployed === "no" || ' +
          '(model.selfEmployed === "yes" && model.soleTrader !== "sole") || ' +
          '(model.selfEmployed === "yes" && model.soleTrader === "sole" && model.hoursThreshold !== "yes" && ! model.earnThreshold) || ' +
          '(model.selfEmployed === "yes" && model.soleTrader === "sole" && model.hoursThreshold === "no" && model.earnThreshold !== "yes")',
          templateOptions: {
            fields: [
              {
                type: 'html',
                templateOptions: {
                  label: '<h2 class="deep-blue">Great! You are Eligibile for CPX.</h2>'
                }
              },
              {
                type: 'button',
                templateOptions: {
                  type: 'submit',
                  label: 'Calculate your cover.'
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

  });
