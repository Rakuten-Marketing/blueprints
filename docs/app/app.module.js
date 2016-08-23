(function () {
  'use strict';
  var dependencies = ['ui.router', 'hljs'];

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

    // "Foundation" main section
    // Colors, Typography and Paddings sections are handled by this state
    .state('application.foundation', {
      url: '/foundation/',
      abstract: true,
      views: {
        content: {
          templateUrl: 'app/partials/foundation/foundation.template.html',
          controller: 'FoundationController as foundationView'
        }
      }
    })

    .state('application.foundation.colors', {
      url: 'colors',
      views: {
        section: {
          templateUrl: 'app/partials/foundation/colors/colors.template.html',
          controller: 'ColorsController as colorsView'
        }
      }
    })

    .state('application.foundation.typography', {
      url: 'typography',
      views: {
        section: {
          templateUrl: 'app/partials/foundation/typography/typography.template.html',
          controller: angular.noop
        }
      }
    })

    .state('application.foundation.paddings', {
      url: 'paddings',
      views: {
        'section': {
          templateUrl: 'app/partials/foundation/paddings/paddings.template.html',
          controller: angular.noop
        }
      }
    })

    // TODO: Move away :params and explicitly add the states
    .state('application.elements', {
      url: '/elements/:section',
      views: {
        content: {
          templateUrl: 'app/partials/elements/elements.template.html',
          controller: 'ElementsController as elementsView'
        }
      }
    })

    // TODO: Move away :params and explicitly add the states
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
  })
  .run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }]);
})();