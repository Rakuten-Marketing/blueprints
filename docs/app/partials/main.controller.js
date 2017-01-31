(function() {
  'use strict';

  angular.module('app').controller('MainController', MainController);
  MainController.$inject = ['$rootScope', '$state', '$window'];

  function MainController($rootScope, $state, $window) {
    var vm = this;
    vm.$state = $rootScope.$state;
  }
})();