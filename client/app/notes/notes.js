(function() {
  angular.module('notely.notes', [
    'ui.router',
    'textAngular',
    'ngFlash'
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
          userAuthenticated: [
            '$state', '$q', '$timeout', 'CurrentUser',
            function($state, $q, $timeout, CurrentUser) {
              let deferred = $q.defer();
              $timeout(function() {
                if (CurrentUser.isSignedIn()) {
                  deferred.resolve();
                }
                else {
                  deferred.reject();
                  $state.go('sign-in');
                }
              });
            }
          ],
          notesLoaded: [
            'NotesService', 'userAuthenticated',
            function(NotesService, _userAuthenticated) {
              return NotesService.fetch();
            }
          ]
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
        NotesService.create($scope.note).then(function(response) {
          $state.go('notes.form', { noteId: response.data.note._id });
        });
      }
    };
    $scope.delete = function() {
      NotesService.delete($scope.note).then(function() {
        $state.go('notes.form', { noteId: undefined });
      });
    };
  }
})();
