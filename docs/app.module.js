angular.module('app', [
  'ngRoute',
  'hljs'
])
  .config(function($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        template: '<home></home>'
      })

      .when('/css', {
        template: '<css></css>'
      })

      .when('/components', {
        template: '<components></components>'
      });
  });
