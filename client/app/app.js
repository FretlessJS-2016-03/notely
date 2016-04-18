(function() {
  let notelyApp = angular.module('notely', [
    'ui.router',
    'notely.notes',
    'ngFlash'
  ]);

  function notelyConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/notes/');
  }

  notelyConfig.$inject = ['$urlRouterProvider'];
  notelyApp.config(notelyConfig);

  notelyApp.constant('API_BASE', 'http://localhost:3030/');
})();
