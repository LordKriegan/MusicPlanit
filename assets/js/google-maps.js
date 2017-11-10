

    // This example requires the Places library. Include the libraries=places
    // parameter when you first load the API. For example:
    // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
    
    // console.log(eventSearch);

    var map;
    var infowindow;
    // var latitude = 34.0430;
    // var longitude = -118.2673;
    
    function initMap(lat, long) {
        // console.log(latitude, longitude);

        
        var myConcertIcon = "./assets/images/place-marker-concert.png"
        var eventLocation = {lat: lat, lng: long};
        console.log(eventLocation);
        map = new google.maps.Map(document.getElementById('map'), {
            center: eventLocation,
            zoom: 13
        });

        var marker = new google.maps.Marker({
            position: eventLocation,
            icon: myConcertIcon,
            map: map
        });

        infowindow = new google.maps.InfoWindow();


        var restaurants = new google.maps.places.PlacesService(map);
        restaurants.nearbySearch({
            location: eventLocation,
            radius: 4000,
            type: ['restaurant'],
            openNow: true
        }, callback);
    }

    function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }
        }
    }

    function createMarker(place) {
        var myRestaurantIcon = "./assets/images/place-marker-food.png"
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            icon: myRestaurantIcon,
            map: map,
            position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent(place.name);
            infowindow.open(map, this);
        });
    } 

    

//<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDsqsGRoeCFaylDOCU1XPjy7liKohqa_Qg&libraries=places&callback=initMap" async defer></script>