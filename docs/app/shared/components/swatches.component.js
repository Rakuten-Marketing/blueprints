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

      $http.get('build/docs/palettes.json')
        .then(function(res) {
          vm.colors = res.data[vm.palette];
        })
        .catch(console.error);
    }
  });
})();
