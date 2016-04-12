'use strict';

angular.module('cpxApp')
  .service('cpxwelcome', function () {

    this.getWelcomeFields = getWelcomeFields;

    function getWelcomeFields(){
      return [
        {
          type: 'html',
          templateOptions: {
            className: 'cpx-welcome-container',
            label: `

<h2>Do you know exactly how much you’ll receive each week if you are injured and can’t work?</h2>

<p>Cover Plus Extra (CPX) is an optional product designed to let you pre-agree how much you'll receive each week as a compensation for your lost earnings.</p>
<p>If you choose CPX it will replace your current standard Cover Plus.</p>

<p>This application will take you through three steps:</p>
<ol>
    <li><span>Ensure you are eligible</span></li>
    <li><span>Estimate your cover amount</span></li>
    <li><span>Apply for CPX</span></li>
</ol>
`
          }
        },

        {
          type: 'group',
          templateOptions: {
            className: 'horizontal-group',
            fields: [
              {
                type: 'button',
                templateOptions: {
                  label: 'Get started',
                  type: 'submit'
                }
              },
              {
                type: 'paragraph',
                templateOptions: {
                  label: 'or'
                }
              },
              {
                type: 'html',
                templateOptions: {
                  label: '<p><a href="http://www.acc.co.nz/for-business/self-employed/cover-products-for-self-employed/" target="_blank">I want to know more about CPX</a></p>'
                }
              }
            ]
          }
        }
      ];
    }

  });
