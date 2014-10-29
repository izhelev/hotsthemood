angular.module("hotsthemoodApp", ['ionic'])

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
		.state('event', {
			abstract: true,
			views: {
				"event-section": {
					templateUrl: "app/event/event.html"
				}
			}
		})
		.state("event.search",
			{			
				url: "/event/search",
				templateUrl: "app/event/search.html"				
			})
		.state("event.profile",
			{			
				url: "/event/profile",
				templateUrl: "app/event/profile.html"				
			});

	// if none of the above states are matched use this as the fallback
	$urlRouterProvider.otherwise('/event/search');
})

.controller('SearchController', ['$scope', '$stateParams', '$ionicLoading', '$http',  'shareData', 'locationHelper', 'APP_CONFIG',
	function($scope, $stateParams, $ionicLoading, $http, shareData, locationHelper, app_config) {
	console.log('SearchController');
	$ionicLoading.show({
		template: '<i class="icon loadingIndicator ion-looping"></i>'
	});

	locationHelper.getLatestLocation(function(location) {
 		$scope.location = location;

		console.log(location);

		$http.put(app_config.apiUrlBase + '/search', {Latitude: location.latitude, Longitude: location.longitude})
		.success(function(data, status, headers, config) {
			$scope.nearbyEvents = data.events;
			$ionicLoading.hide();
		})
		.error(function(data, status, headers, config) {
			$ionicLoading.hide();
		});
	});

	$scope.selectedEvent = function(event) {
		shareData.event = event;
	};
}])
.controller('EventProfileController', ['$scope', '$stateParams', 'shareData', function($scope, $stateParams, shareData) {
	console.log('EventProfileController');
	console.log($stateParams);
	//console.log(shareData.event);
	$scope.event = shareData.event;
}]);

