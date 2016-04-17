angular.module('notely')
  .directive('signUp', ['$state', 'UsersService', ($state, UsersService) => {

    class SignUpController {
      constructor() {
        this.user = {};
      }
      submit() {
        UsersService.create(this.user)
          .then(function(_response) {
            $state.go('notes.form', { noteId: undefined });
          });
      }
    }

    return {
      scope: {},
      controller: SignUpController,
      controllerAs: 'ctrl',
      templateUrl: '/components/sign-up.html'
    };
  }]);
