'use strict';

import _ from 'lodash';
import * as BusinessnamesService from './businessnames.service.js';


describe('Businessnames Service', function() {

  this.timeout(10000);

  it('should return a business name', function(done) {
    return BusinessnamesService.search('solnet')
    .then(businessnames => {
        businessnames.length.should.not.equal(0);
        done();
      })
  });


  it('should return solnet', function(done) {
    return BusinessnamesService.search('solnet limited')
      .then(businessnames => {

        let solnetBusinessName = 'solnet limited';
        let solnetBusiness = _(businessnames).filter(businessname => { return businessname.name.toLowerCase() === solnetBusinessName}).first();

        solnetBusiness.name.toLowerCase().should.equal(solnetBusinessName);

        done();
      })
  });

});
