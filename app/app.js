(function() {
  var notelyApp = angular.module('notely', [
    'ui.router',
    'notely.notes'
  ]);

  function notelyConfig($urlRouterProvider) {
    $urlRouterProvider.otherwise('/notes');
  }

  notelyConfig.$inject = ['$urlRouterProvider'];
  notelyApp.config(notelyConfig);
})();
