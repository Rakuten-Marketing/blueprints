(function() {
  'use strict';

  angular.module('app').controller('ComponentsController', ComponentsController);
  ComponentsController.$inject = ['$rootScope', '$state'];

  function ComponentsController($rootScope, $state) {
    var vm = this;

    vm.$state = $rootScope.$state;
    vm.switchState = function(state) {
      $state.go('application.components.' + state);
    };
  }
})();