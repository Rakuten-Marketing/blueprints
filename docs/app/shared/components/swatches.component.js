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
      $http.get('build/docs/variables.json').success(function (response) {
        var processed = [],
        data = response['colors'];

        angular.forEach(data, function(value, key){
          if (key.indexOf(vm.palette) !== -1 || !vm.palette) {
            processed.push({
              id: key,
              value: value
            });
          }
        });

        vm.colors = processed;
      });
    }
  });
})();