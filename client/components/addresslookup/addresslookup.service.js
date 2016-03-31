'use strict';

angular.module('cpxApp')
  .service('addresslookup', function ($http, $q, $timeout) {
    var self = this;

    self.searchAddress = searchAddress;

    function initService() {
      try {
        self.autoCompleteService = new google.maps.places.AutocompleteService();
      } catch (error) {
        $timeout(function () {
          try {
            if (!self.autoCompleteService) {
              self.autoCompleteService = new google.maps.places.AutocompleteService();
            }
          } catch (err) {
          }
        }, 1000);
      }
    }

    /**
     * Performs an address lookup based on a search query.
     *
     * An optional parameter limits the search to only return addresses in New Zealand.
     * Unfortunately the API does not provide this service, so this is achieved by simply filtering the returned
     * data. Because of this, the returned data may be empty until many characters are entered.
     * E.g. searching "The Terrace" only returns data when "The T" is entered.
     * Without using the filter, data would begin being returned when you type in "T".
     * 
     * @param query
     * @param limitToNewZealand
     * @returns {*}
       */
    function searchAddress(query, limitToNewZealand) {
      var options = {
        input: query,
        types: ['(cities)', 'geocode'],
        componentRestrictions: {country: 'nz'} // This value is not used by the getQueryPredictions method
      };

      return autocomplete(options, limitToNewZealand);
    }

    function autocomplete(options, limitToNewZealand){
      var deferred = $q.defer();

      if (!self.autoCompleteService) {
        initService();
      }

      if (self.autoCompleteService) {
        self.autoCompleteService.getQueryPredictions(options, function (results, status) {
          if (status === "OK") {
            if (limitToNewZealand) {
              results = _.remove(results, function(val) { return val.description.indexOf("New Zealand") > -1});
            }

            deferred.resolve(results);
          } else {
            deferred.resolve([]);
          }
        });
      } else {
        deferred.resolve([]);
      }

      return deferred.promise;
    }
  });
