(function() {
  'use strict';

  angular.module('app').controller('NavbarsController', NavbarsController);
  NavbarsController.$inject = [];

  function NavbarsController($document) {
    var vm = this;

    vm.toggleClass = function($event) {
      var target = event.currentTarget;
      angular.element(target).toggleClass('open');
    };
  }
})();