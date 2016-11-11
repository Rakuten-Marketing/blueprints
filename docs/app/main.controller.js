(function() {
  'use strict';

  angular.module('app').controller('MainController', MainController);
  MainController.$inject = ['$rootScope', '$state', '$window'];

  function MainController($rootScope, $state, $window) {
    var vm = this;
    vm.$state = $rootScope.$state;

    vm.toggleMenu = function() {
    	if ($window.innerWidth <= 750) {
        angular.element('.bp-dashboard').toggleClass('open');
        angular.element('.navbar-collapsible button').toggleClass('open');
    	}
    };
  }
})();