(function() {
  'use strict';
  angular.module('app').component('swatches', {
    bindings: {
      palette: '@palette'
    },

    templateUrl: 'app/shared/components/swatches.component.html',
    controller: function($scope, $http) {
      var vm = this;

      vm.colors = {};
      //$http.get('build/docs/variables.json').success(function (response) {
      $http.get('app/partials/foundation/colors/dictionary.json').success(function (response) {
        var processed = response;

        angular.forEach(response, function(value, key){
          if (key.indexOf(vm.palette) !== -1 && vm.palette) {
            processed = response[key];
          }
        });

        vm.colors = processed;
      });
    }
  });
})();