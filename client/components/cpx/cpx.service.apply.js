'use strict';

angular.module('cpxApp')
  .service('cpxapply', function () {

    this.getApplyFields = getApplyFields;


    function getApplyFields(){
      return [

        {
          type: 'html',
          templateOptions: {
            label: `<h2>CPX is for you!</h2>
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
  });
