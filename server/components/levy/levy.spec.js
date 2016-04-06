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

  it('should calculate my levy', function(done) {
    return LevyService.calculateLevyExternal(getBasicLevyCalculation())
      .then(calculation => {

        calculation.totalWithGST.cpx.should.equal('2282.13');
        done();

      });
  });

});
