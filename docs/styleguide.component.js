angular.module('app')

  .component('styleguide', {
    templateUrl: '/styleguide.component.html',
    controller: function($window) {
      var vm = this;

      vm.variables = $window.Blueprints.variables;
    }
  })
