//Angular App Module and controller
angular.module('myApp', []).controller('mapCtrl', function($scope){
	var mapOptions = {
		zoom: 4,
		//Center of the US
		center: new google.maps.LatLng(40.0000, -98.0000)
	}

	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	$scope.markers = [];

	var infoWindow = new google.maps.InfoWindow()

	var createMarker = function(city, index){
		var latLon = city.latLon.split(',')
		var lat = latLon[0];
		var lon = latLon[1];
		var icon = ''
		if(index == 0){
			icon = 'assets/images/1.png';
		} else if(index == 38){
			icon = 'assets/images/atl.png';
		}else{
			icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=•%7CFE7569';
		}
		var marker = new google.maps.Marker({
			map: $scope.map,
			position: new google.maps.LatLng(lat,lon),
			title: city.city,
			icon: icon
		});

		markerContentHTML = '<div class="infoWindowContent">';
		markerContentHTML += '<div class="total-pop">Total Population: ' + city.yearEstimate + '</div>';
		markerContentHTML += '<div class="pop-dens-last-year">2010 Census: ' + city.lastCensus + '</div>';
		markerContentHTML += '<div class="pop-change">Population Change %: ' + city.change + '</div>';
		markerContentHTML += '<div class="pop-dens">Population Density: ' + city.lastPopDensity + '</div>';
		markerContentHTML += '<div class="state">State: ' + city.state + '</div>';
		markerContentHTML += '<div class="land-area">Land Area: ' + city.landArea + '</div>';
		markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+')">Get directions</a><br>';
		markerContentHTML += '<a href="#" onclick="displayBooze('+lat+','+lon+')">Booze</a><br>';
		markerContentHTML += '<a href="#" onclick="displayBar('+lat+','+lon+')">Bars</a>';
		markerContentHTML += '</div>';

		marker.content = markerContentHTML;

		google.maps.event.addListener(marker, 'click', function(){
			infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content)
			infoWindow.open($scope.map, marker)
		});

		$scope.markers.push(marker);


	}

	$scope.triggerClick = function(i){
		google.maps.event.trigger($scope.markers[i-1], "click")
	}

	function createSelectedMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location,
			icon: place.icon
		});
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(createMarkerContent());
			infowindow.open(map, this);
		});
	}

	function createMarkerContent(place){
		console.log(place);
		markerContentHTML = '<div class="markerWindowContent">';
		markerContentHTML += '<div class="name">Name: ' + place.name + '</div>';
		markerContentHTML += '<div class="address">Address: ' + place.formatted_address + '</div>';
		markerContentHTML += '<div class="hours">Hours: ' + place.opening_hours + '</div>';
		markerContentHTML += '<div class="rating">They Have a Rating of..: ' + place.rating + '</div>';
		// markerContentHTML += '<a href="#" onclick="getDirections('+lat+','+lon+')">Get directions</a><br>';
		markerContentHTML += '</div>';

		return markerContentHTML

	}

	displayBooze = function(lat, lon){
		
		var pyrmont = {lat: lat, lng: lon};

		map = new google.maps.Map(document.getElementById('map'), {
			center: pyrmont,
			zoom: 14
		});

		infowindow = new google.maps.InfoWindow();

		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: pyrmont,
			radius: "5000",
			types: ['liquor_store']
		}, callback);


		function callback(results, status) {
			
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					createSelectedMarker(results[i]);
				}
			}
		}
	}	


	displayBar = function(lat, lon){

		var something = {lat: lat, lng: lon};

		map = new google.maps.Map(document.getElementById('map'), {
			center: something,
			zoom: 14
		});

		infowindow = new google.maps.InfoWindow();

		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: something,
			radius: "5000",
			types: ['bar']
		}, callback);


		function callback(results, status) {
			console.log(results);
			if (status === google.maps.places.PlacesServiceStatus.OK) {
				for (var i = 0; i < results.length; i++) {
					createSelectedMarker(results[i]);
				}
			}
		}
	}

	$scope.updateMarkers = function(cities){
		for(i = 0; i < $scope.markers.length; i++){
			$scope.markers[i].setMap(null);
		}
		for(i = 0; i < $scope.filteredCities.length; i++){
			createMarker($scope.filteredCities[i], i);
		}
	}



	getDirections = function(lat, lon){
		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 7,
			mapType: google.maps.MapTypeId.ROADMAP})
		directionsDisplay.setMap(map);
		directionsDisplay.setPanel(document.getElementById('list-window'));
		var request = {
           	//Origin hardcoded to Atlanta. Require geocode current loc,
        	//or give user input
        	origin: 'Atlanta, GA', 
        	destination:new google.maps.LatLng(lat,lon), 
        	travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
        	if (status == google.maps.DirectionsStatus.OK) {
        		directionsDisplay.setDirections(response);
        	}
        });
    }

    $scope.cities = cities
    for( i=0; i < cities.length; i++){
    	createMarker(cities[i], i)
    }
});




