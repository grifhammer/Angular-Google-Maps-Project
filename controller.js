//Angular App Module and controller
angular.module('myApp', []).controller('mapCtrl', function($scope){
	var mapOption = {
		zoom: 4,
		//Center of the US
		center: new google.maps.LatLng(40.0000, -98.0000),
		mayTypeId: google.maps.mapTypeID.TERRAIN
	}
});