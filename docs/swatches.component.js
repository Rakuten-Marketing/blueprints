angular.module('app')

  .component('swatches', {
    templateUrl: '/swatches.component.html',
    controller: ColorSwatchesController
  })

  function ColorSwatchesController($scope, $window) {
    var vm = this;

    vm.colors = $window.Blueprints.variables.colors;
  }
