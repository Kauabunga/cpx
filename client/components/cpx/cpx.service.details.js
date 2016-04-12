
'use strict';

angular.module('cpxApp')
  .service('cpxdetails', function () {

    this.getDetailsFields = getDetailsFields;

    function getDetailsFields(){
      return [

        {
          type: 'group',
          templateOptions: {
            fields: [
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
                        pattern: /^([a-zA-Z][a-zA-Z]\d{7}|[a-zA-Z]\d{8})$/,
                        patternValidationMessage: `That ACC number doesn't look quite right`
                      }
                    }
                  ]
                }
              },
              {
                type: 'group',
                hideExpression: 'model.accNumber.length === 9',
                templateOptions: {
                  fields: [
                    {
                      type: 'button',
                      hideExpression: 'model.unknownAccNumber',
                      templateOptions: {
                        label: `I don't know my ACC number`,
                        click: function($event, model, form){
                          return model.unknownAccNumber = true;
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
                              pattern: /^(\d{8}|\d{9})$/,
                              patternValidationMessage: `That IRD number doesn't look quite right`
                            }
                          }
                        ]
                      }
                    },
                    {
                      type: 'button',
                      hideExpression: '! model.unknownAccNumber || ( model.irdNumber.length === 8 || model.irdNumber.length === 9 )',
                      templateOptions: {
                        label: `I've found my ACC number`,
                        click: function($event, model, form){
                          return model.unknownAccNumber = false;
                        }
                      }
                    },
                  ]
                }
              }
            ]
          }
        },




        {
          type: 'group',
          hideExpression: '((model.irdNumber.length !== 8 && model.irdNumber.length !== 9) && (model.accNumber.length !== 9))',
          templateOptions: {
            fields: [
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
              }
            ]
          }
        }
      ]
    }

  });

