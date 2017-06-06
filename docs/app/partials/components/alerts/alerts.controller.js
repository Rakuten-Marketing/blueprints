(function() {
  'use strict';

  angular.module('app').controller('AlertsController', AlertsController);
  AlertsController.$inject = [];

  function AlertsController() {
    var vm = this;

    vm.classname = 'success';
  }
})();