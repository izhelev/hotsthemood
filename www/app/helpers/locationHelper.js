angular.module("hotsthemoodApp")

.factory('locationHelper', function() {

	var lastKnownLocation = {};

	var locationOptions = {
		maximumAge: 15000,
		timeout: 5000,
		enableHighAccuracy: true 
	};

	function locationSuccess(position) {
		lastKnownLocation = {
			longitude: position.coords.longitude,
			latitude: position.coords.latitude
		};
		console.log('locationHelper : got location ' + lastKnownLocation);
	}


	function locationError(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
			console.log('User denied the request for Geolocation.');
			break;
			case error.POSITION_UNAVAILABLE:
			console.log('Location information is unavailable.');
			break;
			case error.TIMEOUT:
			console.log('The request to get user location timed out.');
			break;
			case error.UNKNOWN_ERROR:
			console.log('An unknown error occurred.');
			break;
		}
	}

	return {
		addWatcher: function() {
			console.log('Adding geolocation watcher');
			if (navigator.geolocation) {
				navigator.geolocation.watchPosition(locationSuccess, locationError, locationOptions);
			} else {
				console.log('Geolocation is not supported by this browser.');
			}
		},
		getLatestLocation: function(callback) {
			function timeout() {
				setTimeout(function () {
					if(lastKnownLocation.hasOwnProperty('longitude')) {
						callback(lastKnownLocation);
					} else {
						timeout();
					}
				}, 1000);
			}
			timeout();
		}
	};
});