angular.module("hotsthemoodApp")

.factory('deviceIdHelper', function() {

	return {
		createIfNotExists: function(onCreation) {
			if(!localStorage.getItem('deviceId')) {
				var deviceId = Math.uuid();
				localStorage.setItem('deviceId', deviceId);
				onCreation(deviceId);
			}
		},
		get: function() {
			return localStorage.getItem('deviceId');
		}
	};
});