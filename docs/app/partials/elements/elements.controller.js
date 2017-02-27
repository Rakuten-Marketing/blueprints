(function() {
  'use strict';

  angular.module('app').controller('ElementsController', ElementsController);
  ElementsController.$inject = ['$rootScope', '$state'];

  function ElementsController($rootScope, $state) {
    var vm = this;

    vm.$state = $rootScope.$state;
    vm.switchState = function(state) {
      $state.go('application.elements.' + state);
    };
  }
})();