(function() {
  angular.module('notely.notes', [
    'ui.router'
  ])
  .config(notesConfig);

  notesConfig.$inject = ['$stateProvider'];
  function notesConfig($stateProvider) {
    $stateProvider

      .state('notes', {
        url: '/notes',
        templateUrl: '/notes/notes.html',
        controller: NotesController,
        resolve: {
          notesLoaded: function(NotesService) {
            return NotesService.fetch();
          }
        }
      })

      .state('notes.form', {
        url: '/:noteId',
        templateUrl: '/notes/notes-form.html'
      });
  }

  NotesController.$inject = ['$scope', '$state', 'NotesService'];
  function NotesController($scope, $state, NotesService) {
    $scope.notes = NotesService.getNotes();
    $scope.note = NotesService.findById($state.params.noteId);

    $scope.save = function() {
      NotesService.create($scope.note);
    };

    $scope.clearForm = function() {
      $scope.note = {};
    };

    $state.go('notes.form');
  }
})();
