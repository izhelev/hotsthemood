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
		.state('share', {
			abstract: true,
			views: {
				"tab-share": {
					templateUrl: "app/share/share.html"
				}
			}
		})

		.state('share.mood', {
			url: "/share/mood",
			templateUrl: "app/share/mood.html"
		})

		.state('share.location', {
			url: "/share/{mood}/location",
			templateUrl: "app/share/location.html"
		})

		.state('share.message', {
			url: "/share/{mood}/{location}/message",
			templateUrl: "app/share/message.html"
		})

		.state('look', {
			url: "/look",
			views: {
				"tab-look": {
					templateUrl: "app/look/around.html"
				}
			}
		});

	// if none of the above states are matched use this as the fallback
	$urlRouterProvider.otherwise('/share/mood');
})



.controller('AtController', ['$scope', '$stateParams', function($scope, $stateParams) {
	console.log('AtController');
	$scope.mood = $stateParams.mood;
}])


.controller('DoneController', ['$scope', '$stateParams', function($scope, $stateParams) {
	console.log('DoneController');
	console.log($stateParams);
	$scope.mood = $stateParams.mood;
}])

.controller('AroundController', ['$scope', '$stateParams', function($scope, $stateParams) {
	console.log('AroundController');
}]);

