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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('notely').directive('signUp', ['$state', 'UsersService', function ($state, UsersService) {
  var SignUpController = (function () {
    function SignUpController() {
      _classCallCheck(this, SignUpController);

      this.user = {};
    }

    _createClass(SignUpController, [{
      key: 'submit',
      value: function submit() {
        UsersService.create(this.user).then(function (_response) {
          $state.go('notes.form', { noteId: undefined });
        });
      }
    }]);

    return SignUpController;
  })();

  return {
    scope: {},
    controller: SignUpController,
    controllerAs: 'ctrl',
    templateUrl: '/components/sign-up.html'
  };
}]);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('notely').directive('userLinks', function () {
  var UserLinksController = (function () {
    function UserLinksController(CurrentUser) {
      _classCallCheck(this, UserLinksController);

      this.CurrentUser = CurrentUser;
    }

    _createClass(UserLinksController, [{
      key: 'user',
      value: function user() {
        return this.CurrentUser.get();
      }
    }, {
      key: 'signedIn',
      value: function signedIn() {
        return !!this.user()._id;
      }
    }]);

    return UserLinksController;
  })();

  UserLinksController.$inject = ['CurrentUser'];

  return {
    scope: {},
    controller: UserLinksController,
    controllerAs: 'ctrl',
    bindToController: true,
    template: '\n        <div class="user-links">\n          <div ng-show="ctrl.signedIn()">\n            Signed in as {{ ctrl.user().name }}\n            |\n            <a href="#">Logout</a>\n          </div>\n        </div>\n      '
  };
});
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

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('notely').service('AuthToken', ['$window', function ($window) {
  var AuthToken = (function () {
    function AuthToken() {
      _classCallCheck(this, AuthToken);

      this.authToken = $window.localStorage.getItem('authToken');
    }

    _createClass(AuthToken, [{
      key: 'set',
      value: function set(token) {
        this.authToken = token;
        $window.localStorage.setItem('authToken', this.authToken);
      }
    }, {
      key: 'get',
      value: function get() {
        return this.authToken;
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.authToken = undefined;
        $window.localStorage.removeItem('authToken');
      }
    }]);

    return AuthToken;
  })();

  return new AuthToken();
}]);
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('notely').service('CurrentUser', ['$window', function ($window) {
  var CurrentUser = (function () {
    function CurrentUser() {
      _classCallCheck(this, CurrentUser);

      this.currentUser = JSON.parse($window.localStorage.getItem('currentUser'));
    }

    _createClass(CurrentUser, [{
      key: 'set',
      value: function set(user) {
        this.currentUser = user;
        $window.localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      }
    }, {
      key: 'get',
      value: function get() {
        return this.currentUser || {};
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.currentUser = undefined;
        $window.localStorage.removeItem('currentUser');
      }
    }]);

    return CurrentUser;
  })();

  return new CurrentUser();
}]);
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
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

angular.module('notely').service('UsersService', ['$http', 'API_BASE', 'AuthToken', 'CurrentUser', function ($http, API_BASE, AuthToken, CurrentUser) {
  var UsersService = (function () {
    function UsersService() {
      _classCallCheck(this, UsersService);
    }

    _createClass(UsersService, [{
      key: 'create',
      value: function create(user) {
        var userPromise = $http.post(API_BASE + 'users', {
          user: user
        });
        userPromise.then(function (response) {
          AuthToken.set(response.data.auth_token);
          CurrentUser.set(response.data.user);
        });
        return userPromise;
      }
    }]);

    return UsersService;
  })();

  return new UsersService();
}]);
'use strict';

{
  var usersConfig = function usersConfig($stateProvider) {
    $stateProvider.state('sign-up', {
      url: '/sign-up',
      template: '<sign-up></sign-up>'
    });
  };
  usersConfig.$inject = ['$stateProvider'];

  angular.module('notely').config(usersConfig);
}
//# sourceMappingURL=bundle.js.map
