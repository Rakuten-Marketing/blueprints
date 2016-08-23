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

    // "Elements" main section
    // Everything related to "Twitter Bootstrap" elements are handled by this state
    .state('application.elements', {
      url: '/elements/',
      abstract: true,
      views: {
        content: {
          templateUrl: 'app/partials/elements/elements.template.html',
          controller: 'ElementsController as elementsView'
        }
      }
    })

    .state('application.elements.grid', {
      url: 'grid',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/grid.html',
          controller: angular.noop //'GridController as gridView'
        }
      }
    })

    .state('application.elements.typography', {
      url: 'typography',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/type.html',
          controller: angular.noop //'TypographyController as typographyView'
        }
      }
    })

    .state('application.elements.code', {
      url: 'code',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/code.html',
          controller: angular.noop //'CodeController as codeView'
        }
      }
    })

    .state('application.elements.tables', {
      url: 'tables',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/tables.html',
          controller: angular.noop //'TablesController as tablesView'
        }
      }
    })

    .state('application.elements.forms', {
      url: 'forms',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/forms.html',
          controller: angular.noop //'FormsController as formsView'
        }
      }
    })

    .state('application.elements.buttons', {
      url: 'buttons',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/buttons.html',
          controller: angular.noop //'ButtonsController as buttonsView'
        }
      }
    })

    .state('application.elements.images', {
      url: 'images',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/images.html',
          controller: angular.noop //'ImagesController as imagesView'
        }
      }
    })

    .state('application.elements.helpers', {
      url: 'helpers',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/helpers.html',
          controller: angular.noop //'HelpersController as helpersView'
        }
      }
    })

    .state('application.elements.utilities', {
      url: 'utilities',
      views: {
        section: {
          templateUrl: '../node_modules/bootstrap-partials/docs/_includes/css/responsive-utilities.html',
          controller: angular.noop //'UtilitiesController as utilitiesView'
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