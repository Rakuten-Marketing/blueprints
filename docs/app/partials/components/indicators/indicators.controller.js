(function() {
  'use strict';

  angular.module('app').controller('PreloadersController', PreloadersController);
  PreloadersController.$inject = ['$document'];

  function PreloadersController($document) {
    var vm = this;

    vm.position = 'centered';
    vm.dataState = 'loading';
    vm.fullscreen = false;

    vm.changeState = function(state) {
      vm.dataState = state;
    };

    vm.changePosition = function(classname) {
      vm.position = classname;
    };

    vm.showFullScreen = function() {
      var body = $document[0].body;

      angular.element(body).toggleClass('disabled-with-overlay');
      vm.fullscreen = !vm.fullscreen;
    };
  }
})();