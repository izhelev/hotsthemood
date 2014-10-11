angular.module("hotsthemoodApp", ['ionic', 'ngGPlaces'])

.run(['$ionicPlatform', '$timeout', 'locationHelper', function($ionicPlatform, $timeout, locationHelper) {
	$ionicPlatform.ready(function() {
    
    	if(window.cordova && window.cordova.plugins.Keyboard) {
    		cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    	}

		if(window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});

	locationHelper.addWatcher();
}])

.factory('shareData', function() {
	return {};
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
			url: "/share/{mood}/message",
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



.controller('LocationController', ['$scope', '$stateParams', 'shareData', 'locationHelper', 'ngGPlacesAPI',
	function($scope, $stateParams, shareData, locationHelper, ngGPlacesAPI) {

	console.log('LocationController');

	var location = locationHelper.getLatestLocation();
	console.log(location);

	ngGPlacesAPI.nearbySearch(location)
		.then(function(data){
			$scope.nearbyLocations = data;
		});

	$scope.selectLocation = function(location) {
		shareData.location = location;
	};

	$scope.mood = $stateParams.mood;
}])


.controller('MessageController', ['$scope', '$stateParams', 'shareData', function($scope, $stateParams, shareData) {
	console.log('MessageController');
	console.log($stateParams);
	$scope.mood = $stateParams.mood;
	$scope.location = shareData.location;
}])

.controller('SearchController', ['$scope', '$stateParams', function($scope, $stateParams) {
	console.log('AroundController');
}]);


