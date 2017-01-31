(function() {
  'use strict';

  angular.module('app').controller('IntroductionController', IntroductionController);
  IntroductionController.$inject = ['$state'];

  function IntroductionController($state) {
    var vm = this;
  }
})();