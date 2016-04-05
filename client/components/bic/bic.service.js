'use strict';

angular.module('cpxApp')
  .service('bic', function ($q, $http, $window, $log, $timeout) {

    this.bicStore = {};
    this.bicIndex = undefined;

    //$timeout(this.getSearchIndex, 2000);

    this.search = query => {
      return this.getSearchIndex()
        .then(index => {
          return _(index.search(query)).map(result => {
            return this.getBicByRef(result.ref);
          }).value();
        });
    };

    this.getSearchIndex = () => {
      return this.bicIndex ? $q.when(this.bicIndex) : this.createSearchIndex();
    };

    this.createSearchIndex = () => {

      return this.createBicIndex ? this.createBicIndex :
        this.createBicIndex = this.getBics()
          .then(bics => {

          var idx = lunr(function() {
            this.ref('code');
            this.field('code');
            this.field('desc');

            this.field('industryName');
            this.field('divisionName');
            this.field('className');

            this.field('keywordsFlattened');
            this.field('definitionPlainText');
          });

          idx.pipeline.add(
            lunr.trimmer,
            lunr.stopWordFilter,
            lunr.stemmer
          );

          _.forEach(bics, (bic) => {
            bic.keywordsFlattened = bic.keywords && bic.keywords.join(' ') || '';
            idx.add(bic);
            this.bicStore[bic.code.toString()] = bic;
          });

          return this.bicIndex = idx; //jshint ignore:line
        });
    };

    this.getBicByRef = ref => {
      return this.bicStore[ref];
    };

    this.getBics = () => {
      //TODO inject as content.js
      return $window._bic || $http.get('/api/bics', {cache: true})
        .then(response => {return response.data;});
    };

  });
