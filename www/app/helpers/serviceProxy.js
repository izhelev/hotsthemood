angular.module("hotsthemoodApp")

.factory('serviceProxy', ['$http', 'APP_CONFIG', function($http, app_config) {
	return {
		situation: function(data) {
			return $http.put(app_config.apiUrlBase + '/situation', data);
		},
		checkin: function(data) {
			return $http.put(app_config.apiUrlBase + '/checkin', data);
		},
		happinessquery: function(data) {
			return $http.put(app_config.apiUrlBase + '/happinessquery', data);
		},
		checkinHistory: function(deviceId) {
			return $http.get(app_config.apiUrlBase + '/checkinHistory/' + deviceId);
		}
	}
}]);