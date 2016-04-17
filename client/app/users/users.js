{
  let usersConfig = function($stateProvider) {
    $stateProvider
      .state('sign-up', {
        url: '/sign-up',
        template: '<sign-up></sign-up>'
      })

      .state('sign-in', {
        url: '/sign-in',
        template: '<sign-in></sign-in>'
      });
  };
  usersConfig.$inject = ['$stateProvider'];

  angular.module('notely')
    .config(usersConfig);
}
