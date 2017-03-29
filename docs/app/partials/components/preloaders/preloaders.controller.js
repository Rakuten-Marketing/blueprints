(function() {
  'use strict';

  angular.module('app').controller('PreloadersController', PreloadersController);
  PreloadersController.$inject = [];

  function PreloadersController() {
    var vm = this;

    vm.position = 'centered';
    vm.dataState = 'loading';

    vm.changeState = function(state) {
      vm.dataState = state;
    };

    vm.changePosition = function(classname) {
      vm.position = classname;
    };
  }
})();