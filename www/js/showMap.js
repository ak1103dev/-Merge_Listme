function initMap() {
  var x = JSON.parse(window.localStorage.showmap);
  console.log(x);
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: x.lat, lng: x.lng},
    zoom: 15
  });

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);

  service.getDetails({
    placeId: x.place_id
  }, function(place, status) {
    console.log(place.geometry.location.lat() + " " + place.geometry.location.lng());
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
          // 'Place ID: ' + place.place_id + '<br>' +
          place.formatted_address + '</div>');
        infowindow.open(map, this);
      });
    }
  });
}