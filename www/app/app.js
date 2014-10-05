angular.module("hotsthemoodApp", ["ionic"])

.run(function($ionicPlatform, $timeout) {
	$ionicPlatform.ready(function() {
    
    	if(window.cordova && window.cordova.plugins.Keyboard) {
    		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    	}

		if(window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: "/iam",
			templateUrl: "app/home/home.html"
		})


		.state('at', {
			url: "/iam/{mood}/at",
			templateUrl: "app/home/at.html"
		})

		.state('done', {
			url: "/iam/{mood}/at/{location}",
			templateUrl: "app/home/done.html"
		})


		.state('around', {
			url: "/around",
			templateUrl: "app/home/around.html"
		});

	// if none of the above states are matched use this as the fallback
	$urlRouterProvider.otherwise('/iam');
})



.controller('AtController', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.mood = $stateParams.mood;
}])


.controller('DoneController', ['$scope', '$stateParams', function($scope, $stateParams) {
	console.log($stateParams);
}])

.controller('AroundController', ['$scope', '$stateParams', function($scope, $stateParams) {

}]);

