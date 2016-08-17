(function() {
  'use strict';

  angular.module('app').controller('ElementsController', ElementsController);
  ElementsController.$inject = ['$state'];

  function ElementsController($state) {
    var vm = this;
  }
})();