{
  let usersConfig = function($stateProvider) {
    $stateProvider
      .state('sign-up', {
        url: '/sign-up',
        template: '<sign-up></sign-up>'
      });
  };
  usersConfig.$inject = ['$stateProvider'];

  angular.module('notely')
    .config(usersConfig);
}
