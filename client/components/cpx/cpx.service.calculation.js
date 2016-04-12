'use strict';

angular.module('cpxApp')
  .service('cpxcalculation', function (bic) {

    this.getCalculationFields = getCalculationFields;


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

  });
