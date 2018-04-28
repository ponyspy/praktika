var map;
var style_array =
[{"featureType":"road","stylers":[{"hue":"#5e00ff"},{"saturation":-79}]},{"featureType":"poi","stylers":[{"saturation":-78},{"hue":"#6600ff"},{"lightness":-47},{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"lightness":22}]},{"featureType":"landscape","stylers":[{"hue":"#6600ff"},{"saturation":-11}]},{},{},{"featureType":"water","stylers":[{"saturation":-65},{"hue":"#1900ff"},{"lightness":8}]},{"featureType":"road.local","stylers":[{"weight":1.3},{"lightness":30}]},{"featureType":"transit","stylers":[{"visibility":"simplified"},{"hue":"#5e00ff"},{"saturation":-16}]},{"featureType":"transit.line","stylers":[{"saturation":-72}]},{}]

function initialize() {
	var map_canvas = document.getElementById('map-canvas');
	var map_position = new google.maps.LatLng(55.7648875,37.5943699);
	var marker_position = new google.maps.LatLng(55.765531,37.594230);

	var map_options = {
		zoom: 17,
		center: map_position,
		styles: style_array,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		rotateControl: false,
		fullscreenControl: false
	};

	map = new google.maps.Map(map_canvas, map_options);

	var infowindow = new google.maps.InfoWindow({
			content: '<a class="map_link" href="https://goo.gl/maps/Gr5HpBWog432", target="_blank">' + map_canvas.getAttribute('data-placeholder') + '</a>'
	});

	var marker = new google.maps.Marker({
			position: marker_position,
			map: map,
			title: map_canvas.getAttribute('data-placeholder')
	});

	google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map, marker);
	});
}

google.maps.event.addDomListener(window, 'load', initialize);