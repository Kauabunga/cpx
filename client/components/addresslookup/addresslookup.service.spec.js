'use strict';

describe('Service: addresslookup', function () {

  // load the service's module
  beforeEach(module('cpxApp'));

  // instantiate service
  var addresslookup;
  beforeEach(inject(function (_addresslookup_) {
    addresslookup = _addresslookup_;
  }));

  it('should do something', function () {
    !!addresslookup.should.be.true;
  });

});
