angular.module("hotsthemoodApp")

.factory('deviceIdHelper', function() {

	return {
		createIfNotExists: function() {
			if(!localStorage.getItem('deviceId')) {
				localStorage.setItem('deviceId', Math.uuid());
			}
		},
		get: function() {
			return localStorage.getItem('deviceId');
		}
	};
});