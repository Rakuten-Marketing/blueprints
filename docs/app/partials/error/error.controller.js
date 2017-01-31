(function() {
  'use strict';

  angular.module('app').controller('ErrorController', ErrorController);
  ErrorController.$inject = ['$state'];

  function ErrorController($state) {
    var vm = this;
  }
})();