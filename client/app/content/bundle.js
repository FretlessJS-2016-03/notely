'use strict';

(function () {
  var notelyApp = angular.module('notely', ['ui.router', 'notely.notes', 'ngFlash']);

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

angular.module('notely').directive('signIn', ['$state', 'Flash', 'UsersService', function ($state, Flash, UsersService) {
  var SignInController = (function () {
    function SignInController() {
      _classCallCheck(this, SignInController);

      this.user = {};
    }

    _createClass(SignInController, [{
      key: 'login',
      value: function login() {
        UsersService.login(this.user).then(function (_response) {
          $state.go('notes.form', { noteId: undefined });
        }, function (response) {
          Flash.create('danger', response.data.message);
        });
      }
    }]);

    return SignInController;
  })();

  return {
    scope: {},
    controller: SignInController,
    controllerAs: 'ctrl',
    bindToController: true,
    templateUrl: '/components/sign-in.html'
  };
}]);
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
    function UserLinksController(AuthToken, CurrentUser) {
      _classCallCheck(this, UserLinksController);

      this.AuthToken = AuthToken;
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
    }, {
      key: 'logout',
      value: function logout() {
        this.CurrentUser.clear();
        this.AuthToken.clear();
      }
    }]);

    return UserLinksController;
  })();

  UserLinksController.$inject = ['AuthToken', 'CurrentUser'];

  return {
    scope: {},
    controller: UserLinksController,
    controllerAs: 'ctrl',
    bindToController: true,
    template: '\n        <div class="user-links">\n          <div ng-show="ctrl.signedIn()">\n            Signed in as {{ ctrl.user().name }}\n            |\n            <a ui-sref="sign-in" ng-click="ctrl.logout()">Logout</a>\n          </div>\n        </div>\n      '
  };
});
'use strict';

(function () {
  angular.module('notely.notes', ['ui.router', 'textAngular', 'ngFlash']).config(notesConfig);

  notesConfig.$inject = ['$stateProvider'];
  function notesConfig($stateProvider) {
    $stateProvider.state('notes', {
      url: '/notes',
      templateUrl: '/notes/notes.html',
      controller: NotesController,
      resolve: {
        userAuthenticated: ['$state', '$q', '$timeout', 'CurrentUser', function ($state, $q, $timeout, CurrentUser) {
          var deferred = $q.defer();
          $timeout(function () {
            if (CurrentUser.isSignedIn()) {
              deferred.resolve();
            } else {
              deferred.reject();
              $state.go('sign-in');
            }
          });
        }],
        notesLoaded: ['NotesService', 'userAuthenticated', function (NotesService, _userAuthenticated) {
          return NotesService.fetch();
        }]
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

  NotesFormController.$inject = ['$scope', '$state', 'Flash', 'NotesService'];
  function NotesFormController($scope, $state, Flash, NotesService) {
    $scope.note = NotesService.findById($state.params.noteId);
    $scope.save = function () {
      if ($scope.note._id) {
        NotesService.update($scope.note).then(function (response) {
          Flash.create('success', response.data.message);
        }, function (response) {
          Flash.create('danger', response.data.message);
        });
      } else {
        NotesService.create($scope.note).then(function (response) {
          $state.go('notes.form', { noteId: response.data.note._id });
          Flash.create('success', response.data.message);
        }, function (response) {
          Flash.create('danger', response.data.message);
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

angular.module('notely').factory('AuthInterceptor', ['AuthToken', 'API_BASE', function (AuthToken, API_BASE) {
  return {
    request: function request(config) {
      var token = AuthToken.get();
      if (token && config.url.indexOf(API_BASE) > -1) {
        config.headers.Authorization = token;
      }
      return config;
    }
  };
}]);

angular.module('notely').config(['$httpProvider', function ($httpProvider) {
  return $httpProvider.interceptors.push('AuthInterceptor');
}]);
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
    }, {
      key: 'isSignedIn',
      value: function isSignedIn() {
        return !!this.get()._id;
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
      var updatePromise = $http.put(API_BASE + 'notes/' + note._id, {
        note: {
          title: note.title,
          body_html: note.body_html
        }
      });

      updatePromise.then(function (response) {
        _this.replaceNote(response.data.note);
      });

      return updatePromise;
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
    }, {
      key: 'login',
      value: function login(user) {
        var loginPromise = $http.post(API_BASE + 'sessions', {
          user: user
        });
        loginPromise.then(function (response) {
          AuthToken.set(response.data.auth_token);
          CurrentUser.set(response.data.user);
        });
        return loginPromise;
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
    }).state('sign-in', {
      url: '/sign-in',
      template: '<sign-in></sign-in>'
    });
  };
  usersConfig.$inject = ['$stateProvider'];

  angular.module('notely').config(usersConfig);
}
//# sourceMappingURL=bundle.js.map
