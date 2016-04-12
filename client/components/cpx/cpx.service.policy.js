'use strict';

angular.module('cpxApp')
  .service('cpxpolicy', function () {

    this.getPolicyFields = getPolicyFields;


    function getPolicyFields(){
      return [
        {
          type: 'html',
          templateOptions: {
            label: `<h3>There are two CPX policy types:</h3>
            <div class="two-column-paragraph">
            <p><b>Standard</b> policy allows you to receive a weekly compensation for 100% of your annual income during the period you are injured.</p>
            <p><b>Lower Level of Weekly Compensation (LLWC)</b> policy allows you to pay lower ACC levies, but in the event of an injury, you'll receive a progressively decreasing weekly compensation.</p>
            </div>
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





  });
