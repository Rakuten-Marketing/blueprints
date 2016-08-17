(function () {
  'use strict';
  var dependencies = ['ui.router'];

  angular.module('app', dependencies)
  .config(function(
    $locationProvider,
    $stateProvider,
    $urlRouterProvider,
    $compileProvider) {

    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
    $compileProvider.debugInfoEnabled(false);
    $urlRouterProvider.otherwise('/missing');

    $stateProvider
    .state('application', {
      abstract: true,
      templateUrl: 'app/main.template.html',
      controller: 'MainController as mainView'
    })

    .state('application.home', {
      url: '/',
      views: {
        content: {
          templateUrl: 'app/partials/introduction/introduction.template.html',
          controller: 'IntroductionController as introductionView'
        }
      }
    })

    .state('application.foundation', {
      url: '/foundation/:section',
      views: {
        content: {
          templateUrl: 'app/partials/foundation/foundation.template.html',
          controller: 'FoundationController as foundationView'
        }
      }
    })

    .state('application.elements', {
      url: '/elements/:section',
      views: {
        content: {
          templateUrl: 'app/partials/elements/elements.template.html',
          controller: 'ElementsController as elementsView'
        }
      }
    })

    .state('application.components', {
      url: '/components/:section',
      views: {
        content: {
          templateUrl: 'app/partials/components/components.template.html',
          controller: 'ComponentsController as componentsView'
        }
      }
    })

    .state('missing', {
      views: {
        content: {
          templateUrl: 'app/partials/error/error.template.html',
          controller: 'ErrorController as errorView'
        }
      }
    });

  });
})();