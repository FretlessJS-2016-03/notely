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
        templateUrl: '/notes/notes-form.html',
        controller: NotesFormController
      });
  }

  NotesController.$inject = ['$scope', '$state', 'NotesService'];
  function NotesController($scope, $state, NotesService) {
    $scope.notes = NotesService.getNotes();
    $state.go('notes.form');
  }

  NotesFormController.$inject = ['$scope', '$state', 'NotesService'];
  function NotesFormController($scope, $state, NotesService) {
    $scope.note = NotesService.findById($state.params.noteId);
    $scope.save = function() {
      if ($scope.note._id) {
        NotesService.update($scope.note);
      }
      else {
        NotesService.create($scope.note);
      }
    };
    $scope.delete = function() {
      NotesService.delete($scope.note).then(function() {
        $state.go('notes.form', { noteId: undefined });
      });
    };
  }
})();
