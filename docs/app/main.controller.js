(function() {
  'use strict';

  angular.module('app').controller('MainController', MainController);
  MainController.$inject = ['$rootScope', '$state'];

  function MainController($rootScope, $state) {
    var vm = this;
    vm.$state = $rootScope.$state;
  }
})();