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

  });
