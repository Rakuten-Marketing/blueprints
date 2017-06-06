(function() {
  'use strict';

  angular.module('app').controller('BadgesController', BadgesController);
  BadgesController.$inject = [];

  function BadgesController() {
    var vm = this;

    vm.classname = false;
    vm.getClassName = function() {
      return (vm.classname) ? 'badge-' + vm.classname : '';
    };
  }
})();