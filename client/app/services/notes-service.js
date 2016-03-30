(function() {
  angular.module('notely')
    .service('NotesService', NotesService);

  NotesService.$inject = ['$http'];
  function NotesService($http) {
    var _this = this;
    _this.notes = [];

    _this.fetch = function() {
      return $http.get('http://localhost:3030')
        .then(
          // Success
          function(response) {
            _this.notes = response.data;
          },

          // Failure
          function(response) {
            console.log('aww, snap:' + response);
          }
        );
    };

    _this.getNotes = function() {
      return _this.notes;
    };
  }
}());
