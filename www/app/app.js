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
			url: "/home",
			templateUrl: "app/home/home.html"
		})


		.state('at', {
			url: "/at/{mood}",
			templateUrl: "app/home/at.html"
		})

		.state('done', {
			url: "/done/{mood}/{location}",
			templateUrl: "app/home/done.html"
		})


		.state('around', {
			url: "/around",
			templateUrl: "app/home/around.html"
		});

	// if none of the above states are matched use this as the fallback
	$urlRouterProvider.otherwise('/home');
})



.controller('AtController', ['$scope', '$stateParams', function($scope, $stateParams) {
	$scope.mood = $stateParams.mood;
}])


.controller('DoneController', ['$scope', '$stateParams', function($scope, $stateParams) {
	console.log($stateParams);
}]);
