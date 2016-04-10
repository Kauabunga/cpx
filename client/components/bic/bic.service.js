'use strict';

angular.module('cpxApp')
  .service('bic', function ($q, $http, $window, $log, $timeout) {

    this.bicStore = {};
    this.bicIndex = undefined;

    const searchType = 'searchServer';

    $timeout(() => { return this.search('preload search');});

    this.searchLocal = query => {
      return this.getSearchIndex()
        .then(index => {
          return _(index.search(query)).map(result => {
            return this.getBicByRef(result.ref);
          }).value();
        });
    };

    this.searchServer = query => {
      return $http.get(`/api/bics/search/${query}`).then(response => response.data);
    };

    this.search = this[searchType];

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
            this.field('cu');
            this.field('anzsic');

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

    this.getBicIndustries = () => {
      return this.bicIndustries ? this.bicIndustries : this.bicIndustries = this.getBics()
      .then(bics  => {
        return _(bics).uniq('industryId').map(bic => {
          return _.pick(bic, 'industryId', 'industryName');
        }).value();
      });
    };

    this.getBicDivisions = () => {
      return this.bicDivisions ? this.bicDivisions : this.bicDivisions = this.getBics()
      .then(bics  => {
        return _(bics).uniq('divisionId').map(bic => {
          return _.pick(bic, 'industryId', 'divisionId', 'divisionName');
        }).value();
      });
    };

    this.getBicClasses = () => {
      return this.bicClasses ? this.bicClasses : this.bicClasses = this.getBics()
      .then(bics  => {
        return _(bics).uniq('classId').map(bic => {
          return _.pick(bic, 'cu', 'industryId', 'divisionId', 'classId', 'className');
        }).value();
      });
    };

  });
