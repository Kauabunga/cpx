'use strict';

describe('Service: addresslookup', function () {

  var addresslookup;

  // load the service's module
  beforeEach(module('cpxApp'));

  beforeEach(module(function ($provide, $windowProvider) {
    $provide.value("$window", $windowProvider.$get());
  }));

  beforeEach(inject(function (_addresslookup_) {
    addresslookup = _addresslookup_;
  }));

  it('inserts a dynamic google loading script', function () {
    var googleScript = getLastScript();

    (googleScript.src === 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCatE8RgWKWgGhnp49Q7l9KtbPzXeAoc94').should.be.true;
  });

  // Gets the last script loaded, which presumably should be the google script
  function getLastScript() {
    console.log(document.getElementsByTagName('script').length);
    return document.getElementsByTagName('script')[document.getElementsByTagName('script').length - 1];
  }
});
