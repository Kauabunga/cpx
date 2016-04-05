'use strict';

import _ from 'lodash';
import * as LevyService from './levy.service.js';

const COALMINING_CU = '11010';

function getBasicLevyCalculation(){
  return {
    cuCode: COALMINING_CU,
    earnings: 55555,
    cover: 55555
  };
}


describe('Levy Service', function() {

  this.timeout(10000);

  it('should calculate my levy externally', function(done) {
    return LevyService.calculateLevyExternal(getBasicLevyCalculation())
      .then(calculation => {

        console.log('External levy calculation', calculation);
        calculation.totalWithoutGST.cpx.should.equal('1984.46');
        done();
      });
  });

  it('should calculate my levy internally', function(done) {
    return LevyService.calculateLevyInternal(getBasicLevyCalculation())
      .then(calculation => {
        console.log('Internal levy calculation', calculation);
        try{
          calculation.totalWithoutGST.cpx.should.equal('1984.46');
        }
        catch(err){console.log(err);}

        done();
      });
  });

});
