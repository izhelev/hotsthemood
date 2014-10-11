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
				"tab-checkin": {
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

		.state('search', {
			url: "/search",
			views: {
				"tab-search": {
					templateUrl: "app/search/search.html"
				}
			}
		})

		.state('history', {
			url: "/history",
			views: {
				"tab-history": {
					templateUrl: "app/history/history.html"
				}
			}
		});

	// if none of the above states are matched use this as the fallback
	$urlRouterProvider.otherwise('/share/mood');
})

.config(function(ngGPlacesAPIProvider){
	ngGPlacesAPIProvider.setDefaults({
		radius:500,
		nearbySearchKeys: ['name', 'reference', 'vicinity', 'photos']
	});
})


.controller('LocationController', ['$scope', '$stateParams', '$ionicLoading', 'shareData', 'locationHelper', 'ngGPlacesAPI',
	function($scope, $stateParams, $ionicLoading, shareData, locationHelper, ngGPlacesAPI) {

	console.log('LocationController');
	$ionicLoading.show({
		template: '<i class="icon loadingIndicator ion-looping"></i>'
	});

	locationHelper.getLatestLocation(function(location) {
		console.log(location);

		ngGPlacesAPI.nearbySearch(location)
			.then(function(data){
				$scope.nearbyLocations = [];
				for(var i = 0; i< data.length; i++) {
					$scope.nearbyLocations.push({
						name: data[i].name,
						reference: data[i].reference,
						vicinity: data[i].vicinity,
						photoUrl: (data[i].photos != undefined ? data[i].photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}) : '')
					});
				}
				$ionicLoading.hide();
			});

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

.controller('SearchController', ['$scope', '$stateParams', '$ionicLoading', 'locationHelper', 'ngGPlacesAPI',
	function($scope, $stateParams, $ionicLoading, locationHelper, ngGPlacesAPI) {
	console.log('SearchController');
	$ionicLoading.show({
		template: '<i class="icon loadingIndicator ion-looping"></i>'
	});

	locationHelper.getLatestLocation(function(location) {
 		$scope.location = location;

		console.log(location);

		ngGPlacesAPI.nearbySearch($scope.location)
			.then(function(data){
				$scope.nearbyLocations = data;
				$ionicLoading.hide();
			});
	});
}]);


