'use strict';

import _ from 'lodash';
import * as BicService from './bic.service.js';


describe.only('Bic Service', function() {

  this.timeout(20000);

  it('should perform a fuzzy search', function(done) {
    return BicService.search('farming')
      .then(results => {
        if(results.length < 0){ throw new Error('Expected at least one result'); }
        done();
      })
    .catch(done);
  });

  it('should perform a fuzzy search', function(done) {
    return BicService.search('farmig')
      .then(results => {

        console.log(results);
        if(results.length < 1){ throw new Error('Expected at least one result'); }
        done();
      })
    .catch(done);
  });


});
