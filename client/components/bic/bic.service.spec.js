'use strict';

describe('Service: bic', function () {

  this.timeout(10000);

  // load the service's module
  beforeEach(module('cpxApp'));

  // instantiate service
  var bic, $httpBackend;
  beforeEach(inject(function (_bic_, _$httpBackend_) {
    bic = _bic_;
    $httpBackend = _$httpBackend_;

    $httpBackend.expectGET('/api/bics').respond(200, getDummyBicsResponse());

    //TODO why is this template not being packaged up as part of the .js bundle?
    $httpBackend.expectGET('app/main/main.html').respond(200, '');

  }));


  it('should find a result', function (done) {
    bic.search('plant growing')
    .then(results => {

        results.length.should.equal(1);
        done();
      })
    .catch(done);

    $httpBackend.flush();
  });

  it('should not find a result', function (done) {

    bic.search('wowowow growing')
      .then(results => {

        results.length.should.equal(0);
        done();
      })
      .catch(done);

    $httpBackend.flush();
  });

});


function getDummyBicsResponse(){
  return [
    {
      'code': 'A011110',
      'desc': 'Ornamental plant growing',
      'definitionPlainText': 'This includes growing ornamental plants for sale. Excludes hiring and tending ornamental plants.',
      'classId': '555bc5e225a9732ca20a1273',
      'cu': {'code': '01110', 'desc': 'Nursery production', 'id': '555b1da725a9732ca20a1000'},
      'anzsic': {'code': 'A011100', 'desc': 'Nursery Production (Under Cover)', 'id': '555b206c25a9732ca20a1257'},
      'bicrefs': [{
        'desc': 'Hiring and tending ornamental plants use #$0',
        'order': 0,
        'integrated': false,
        'refs': [{
          'id': '555c7ba77aaceec91e3f2b9e',
          'type': 'bic',
          'desc': 'L663950 Plant hiring and tending (of ornamental plants)'
        }],
        'id': '556fb3d82c8535844998d367',
        'bicId': '555c7ba67aaceec91e3f23c4',
        'allRefsFoundDesc': true
      }],
      'divisionId': '555c6bd38af667b6bbf11119',
      'divisionName': 'Nursery and Floriculture Production',
      'industryName': 'Agriculture, Forestry and Fishing',
      'industryId': '555bb0e425a9732ca20a1000',
      'className': 'Nursery production'
    }
  ];
}
