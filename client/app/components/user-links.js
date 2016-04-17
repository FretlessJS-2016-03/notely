angular.module('notely')
  .directive('userLinks', () => {
    class UserLinksController {
      constructor(AuthToken, CurrentUser) {
        this.AuthToken = AuthToken;
        this.CurrentUser = CurrentUser;
      }

      user() {
        return this.CurrentUser.get();
      }

      signedIn() {
        return !!(this.user()._id);
      }

      logout() {
        this.CurrentUser.clear();
        this.AuthToken.clear();
      }
    }
    UserLinksController.$inject = ['AuthToken', 'CurrentUser'];

    return {
      scope: {},
      controller: UserLinksController,
      controllerAs: 'ctrl',
      bindToController: true,
      template: `
        <div class="user-links">
          <div ng-show="ctrl.signedIn()">
            Signed in as {{ ctrl.user().name }}
            |
            <a ui-sref="sign-in" ng-click="ctrl.logout()">Logout</a>
          </div>
        </div>
      `
    };
  });
