(function() {
  'use strict';

  angular.module('app').controller('ComponentsController', ComponentsController);
  ComponentsController.$inject = ['$state'];

  function ComponentsController($state) {
    var vm = this;
  }
})();