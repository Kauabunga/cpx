'use strict';

angular.module('cpxApp')
  .service('scroll', function (smoothScroll) {


    this.scrollTo = _.throttle(scrollTo, 1500, true);
    //this.scrollTo = _.debounce(scrollTo, 1500, true);


    function scrollTo(element){
      return smoothScroll(element);
    }

  });
