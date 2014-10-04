window.addEventListener('push', at);


function at() {
	var mood = window.location.hash.split('#')[1];
	$('#face').addClass(mood + 'Face-small');
}