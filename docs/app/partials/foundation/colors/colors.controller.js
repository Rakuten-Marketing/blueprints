(function() {
  'use strict';

  angular.module('app').controller('ColorsController', ColorsController);
  ColorsController.$inject = ['$state'];

  function ColorsController($state) {
    var vm = this;
  }
})();