angular.module("hotsthemoodApp", ['ionic', 'ngGPlaces'])

.run(['$ionicPlatform', '$timeout', 'locationHelper', 'deviceIdHelper', function($ionicPlatform, $timeout, locationHelper, deviceIdHelper) {
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
	deviceIdHelper.createIfNotExists();
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
		nearbySearchKeys: ['name', 'icon', 'place_id', 'vicinity', 'photos']
	});
})


.controller('LocationController', ['$scope', '$stateParams', '$http', '$ionicLoading', 'shareData', 'locationHelper', 'deviceIdHelper', 'ngGPlacesAPI', 'APP_CONFIG',
	function($scope, $stateParams, $http, $ionicLoading, shareData, locationHelper, deviceIdHelper, ngGPlacesAPI, app_config) {

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
						reference: data[i].place_id,
						vicinity: data[i].vicinity,
						photoUrl: data[i].icon
					});
				}
				$ionicLoading.hide();
			});

	});

	$scope.selectLocation = function(location) {
		$ionicLoading.show({
			template: '<i class="icon loadingIndicator ion-looping"></i>'
		});

		var deviceId = deviceIdHelper.get();

		var request = {
			checkin: {
				deviceId: deviceId,
				locationReferenceId: location.reference,
				mood: $stateParams.mood,
				location: {
					name: location.name,
					reference: location.reference,
					vicinity: location.vicinity,
					photoUrl: location.photoUrl
				}
			}
		};

		$http.put(app_config.apiUrlBase + '/checkin', request)
		.success(function(data, status, headers, config) {
			$ionicLoading.hide();
		})
		.error(function(data, status, headers, config) {
			$ionicLoading.hide();
		});

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

.controller('SearchController', ['$scope', '$stateParams', '$ionicLoading', '$http', 'locationHelper', 'ngGPlacesAPI', 'APP_CONFIG',
	function($scope, $stateParams, $ionicLoading, $http, locationHelper, ngGPlacesAPI, app_config) {
	console.log('SearchController');
	$ionicLoading.show({
		template: '<i class="icon loadingIndicator ion-looping"></i>'
	});

	locationHelper.getLatestLocation(function(location) {
 		$scope.location = location;

		console.log(location);

		var nearbyLocations = [];
		ngGPlacesAPI.nearbySearch($scope.location)
			.then(function(data){
				for(var i = 0; i< data.length; i++) {
					nearbyLocations.push({
						name: data[i].name,
						reference: data[i].place_id,
						vicinity: data[i].vicinity,
						photoUrl: data[i].icon
					});
				}


				$http.put(app_config.apiUrlBase + '/happinessquery', {Locations: nearbyLocations})
				.success(function(data, status, headers, config) {
					$scope.nearbyLocations = data.locations;
					$ionicLoading.hide();
				})
				.error(function(data, status, headers, config) {
					$ionicLoading.hide();
				});
			});
	});
}])


.controller('HistoryController', ['$scope', '$stateParams', '$ionicLoading', '$http', 'deviceIdHelper', 'ngGPlacesAPI', 'APP_CONFIG',
	function($scope, $stateParams, $ionicLoading, $http, deviceIdHelper, ngGPlacesAPI, app_config) {
	console.log('SearchController');
	$ionicLoading.show({
		template: '<i class="icon loadingIndicator ion-looping"></i>'
	});

	$http.get(app_config.apiUrlBase + '/checkinHistory/' + deviceIdHelper.get())
		.success(function(data, status, headers, config) {
			$scope.checkinHistory = [];
			for(var i = 0; i < data.checkins.length; i++) {
				var checkin = data.checkins[i];
				checkin.timestamp = moment(checkin.timestamp).fromNow();
				$scope.checkinHistory.push(checkin);
			}
			$ionicLoading.hide();
		})
		.error(function(data, status, headers, config) {
			$ionicLoading.hide();
		});

}]);


