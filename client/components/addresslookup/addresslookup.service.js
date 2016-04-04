'use strict';

angular.module('cpxApp')
  .service('addresslookup', function ($http, $q, $window) {
    var self = this;
    self.searchAddress = searchAddress;

    var googleMapsPromise;

    (function init() {
      googleMapsPromise =  $q(function(resolve, reject) {
        var script = $window.document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?libraries=places&key=AIzaSyCatE8RgWKWgGhnp49Q7l9KtbPzXeAoc94';
        script.async = 'async';

        script.addEventListener('load', function() {
          resolve(new google.maps.places.AutocompleteService());
        }, false);

        script.addEventListener('error', function() {
          reject();
        }, false);

        $window.document.body.appendChild(script);
      });
    })();

    /**
     * Performs an address lookup based on a search query.
     * An optional parameter limits the search to only return addresses in New Zealand.
     *
     * @param query
     * @param limitToNewZealand
     * @returns {*}
       */
    function searchAddress(query, limitToNewZealand, errorFunction) {
      var options = {
        input: query
        //types: ['(cities)', 'geocode'],
      };

      if (limitToNewZealand) {
        options.componentRestrictions = {country: 'nz'};
      }

      errorFunction = errorFunction || _.identity;

      return autocomplete(options, errorFunction);
    }

    function autocomplete(options, errorFunction){
      return $q((resolve, reject) => {
        googleMapsPromise
          .then(function(service) {
            service.getPlacePredictions(options, function (results, status) {
              if (status === 'OK') {
                resolve(results);
              } else {
                errorFunction(status);
                return reject(status);
              }
            });
          }, function() {
            errorFunction('Error initialising address lookup service');
            reject('Error initialising address lookup service');
          });
      });
    }
  });
