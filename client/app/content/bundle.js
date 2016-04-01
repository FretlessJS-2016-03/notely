'use strict';

(function () {
  var notelyApp = angular.module('notely', ['ui.router', 'notely.notes']);

  function notelyConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/notes/');
  }

  notelyConfig.$inject = ['$urlRouterProvider'];
  notelyApp.config(notelyConfig);

  notelyApp.constant('API_BASE', 'http://localhost:3030/');
})();
'use strict';

(function () {
  angular.module('notely.notes', ['ui.router', 'textAngular']).config(notesConfig);

  notesConfig.$inject = ['$stateProvider'];
  function notesConfig($stateProvider) {
    $stateProvider.state('notes', {
      url: '/notes',
      templateUrl: '/notes/notes.html',
      controller: NotesController,
      resolve: {
        notesLoaded: function notesLoaded(NotesService) {
          return NotesService.fetch();
        }
      }
    }).state('notes.form', {
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
    $scope.save = function () {
      if ($scope.note._id) {
        NotesService.update($scope.note);
      } else {
        NotesService.create($scope.note).then(function (response) {
          $state.go('notes.form', { noteId: response.data.note._id });
        });
      }
    };
    $scope['delete'] = function () {
      NotesService['delete']($scope.note).then(function () {
        $state.go('notes.form', { noteId: undefined });
      });
    };
  }
})();
'use strict';

(function () {
  angular.module('notely').service('NotesService', NotesService);

  NotesService.$inject = ['$http', 'API_BASE'];
  function NotesService($http, API_BASE) {
    var _this = this;
    _this.notes = [];

    _this.fetch = function () {
      return $http.get(API_BASE + 'notes').then(
      // Success
      function (response) {
        _this.notes = response.data;
      },

      // Failure
      function (response) {
        console.log('aww, snap: ' + response);
      });
    };

    _this.getNotes = function () {
      return _this.notes;
    };

    _this.create = function (note) {
      var creationPromise = $http.post(API_BASE + 'notes', {
        note: note
      });

      creationPromise.then(function (response) {
        _this.notes.unshift(response.data.note);
      });

      return creationPromise;
    };

    _this.update = function (note) {
      return $http.put(API_BASE + 'notes/' + note._id, {
        note: {
          title: note.title,
          body_html: note.body_html
        }
      }).then(function (response) {
        _this.replaceNote(response.data.note);
      });
    };

    _this['delete'] = function (note) {
      return $http['delete'](API_BASE + 'notes/' + note._id).then(function (response) {
        _this.removeNote(response.data.note);
      });
    };

    _this.removeNote = function (note) {
      for (var i = 0; i < _this.notes.length; i++) {
        if (_this.notes[i]._id === note._id) {
          _this.notes.splice(i, 1);
          return;
        }
      }
    };

    _this.replaceNote = function (updatedNote) {
      for (var i = 0; i < _this.notes.length; i++) {
        if (_this.notes[i]._id === updatedNote._id) {
          _this.notes[i] = updatedNote;
          return;
        }
      }
    };

    _this.findById = function (noteId) {
      for (var i = 0; i < _this.notes.length; i++) {
        // If the IDs match, return the current note
        if (_this.notes[i]._id === noteId) {
          return angular.copy(_this.notes[i]);
        }
      }
      return {};
    };
  }
})();
//# sourceMappingURL=bundle.js.map
