(function() {
  angular.module('notely')
    .service('NotesService', NotesService);

  NotesService.$inject = ['$http'];
  function NotesService($http) {
    var _this = this;
    _this.notes = [];

    _this.fetch = function() {
      return $http.get('http://localhost:3030')
        .success(function(notesData) {
          _this.notes = notesData;
        });
    };

    _this.getNotes = function() {
      return _this.notes;
    };
  }
}());
