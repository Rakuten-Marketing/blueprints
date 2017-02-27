(function() {
  'use strict';

  angular.module('app').controller('FoundationController', FoundationController);
  FoundationController.$inject = ['$rootScope', '$state'];

  function FoundationController($rootScope, $state) {
    var vm = this;

    vm.$state = $rootScope.$state;
    vm.switchState = function(state) {
      $state.go('application.foundation.' + state);
    };
  }
})();