angular.module('notely')
  .directive('signIn', ['$state', 'Flash', 'UsersService', ($state, Flash, UsersService) => {

    class SignInController {
      constructor() {
        this.user = {};
      }

      login() {
        UsersService.login(this.user)
          .then(function(_response) {
            $state.go('notes.form', { noteId: undefined });
          },
          function(response) {
            Flash.create('danger', response.data.message);
          });
      }
    }

    return {
      scope: {},
      controller: SignInController,
      controllerAs: 'ctrl',
      bindToController: true,
      templateUrl: '/components/sign-in.html'
    };
  }]);
