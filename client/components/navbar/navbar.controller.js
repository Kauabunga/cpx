'use strict';

class NavbarController {
  //start-non-standard
  menu = [
    {
      'title': 'Home',
      'state': 'main'
    },
    {
      'title': 'CPX',
      'state': 'cpx'
    }
  ];

  //end-non-standard

  constructor(cpx) {

    this.reset = () => {
      cpx.resetCurrentForm();
    }

  }
}

angular.module('cpxApp')
  .controller('NavbarController', NavbarController);
