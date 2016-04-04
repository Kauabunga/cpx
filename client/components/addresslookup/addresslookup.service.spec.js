'use strict';

describe('Service: addresslookup', function () {

  var $service;
  var addresslookup;

  // load the service's module
  beforeEach(module('cpxApp'));

  beforeEach(module(function ($provide) {

    $provide.value("$window", {});
  }));

  beforeEach(inject(function (_addresslookup_) {
    addresslookup = _addresslookup_;
  }));

  it('placeholder test', function () {

  });

});
