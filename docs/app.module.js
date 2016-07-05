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

      .when('/installation', {
        template: '<installation></installation>'
      })

      .when('/contributing', {
        template: '<contributing></contributing>'
      })

      .when('/styleguide', {
        template: '<styleguide></styleguide>'
      })

      .when('/bootstrap', {
        template: '<bootstrap></bootstrap>'
      });
  });
