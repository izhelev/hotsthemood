angular.module("hotsthemoodApp")

.factory('deviceIdHelper', function() {

	return {
		createIfNotExists: function(onCreation) {
			if(!localStorage.getItem('deviceId')) {
				localStorage.setItem('deviceId', Math.uuid());
				onCreation();
			}
		},
		get: function() {
			return localStorage.getItem('deviceId');
		}
	};
});