angular.module('app')

  .component('swatches', {
    templateUrl: '/swatches.component.html',
    controller: ColorSwatchesController
  })

  function ColorSwatchesController($scope, $http) {
    var vm = this;
    
    vm.colors = {};
		$http.get('build/docs/variables.json').success(function (response) {
			var processed = [],
					data = response['colors'];

			angular.forEach(data, function(value, key){
				processed.push({
					id: key,
					value: value
				});
			});

			vm.colors = processed;
		});
  }
