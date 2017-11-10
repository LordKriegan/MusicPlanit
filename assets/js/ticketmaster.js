var eventSearch = [];

var map;
var infowindow;
// var latitude = 34.0430;
// var longitude = -118.2673;

function initMap(lat, long) {
    // console.log(latitude, longitude);


    var myConcertIcon = "./assets/images/place-marker-concert.png"
    var eventLocation = { lat: lat, lng: long };
    console.log(eventLocation);
    map = new google.maps.Map($('#map')[0], {
        center: eventLocation,
        zoom: 8
    });

    var marker = new google.maps.Marker({
        position: eventLocation,
        icon: myConcertIcon,
        map: map
    });

    infowindow = new google.maps.InfoWindow();

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

window.onload = function() {

    $(document).on("click", ".eventElemLg", function() {
        console.log(eventSearch[$(this).attr("data-index")]._embedded.venues[0].location)
        var lat = parseInt(eventSearch[$(this).attr("data-index")]._embedded.venues[0].location.latitude);
        var long = parseInt(eventSearch[$(this).attr("data-index")]._embedded.venues[0].location.longitude);
        initMap(lat, long);
        setTimeout(function() {
            google.maps.event.trigger(map, "resize");
            map.setCenter({ lat: lat, lng: long });
        }, 500); //since map is inside modal, resize to refresh the map
    });

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        city = $("#searchString").val().trim();
        $("#lgList").empty();
        $("#smList").empty();
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=BZAkAGm6c4G9IYugsrmGfucSP3F5PcSf&city=" + city;
        
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                console.log(response);
                eventSearch = response._embedded.events;
                for (i = 0; i < response._embedded.events.length; i++) {
                    var eventName = response._embedded.events[i].name;
                    if (eventName.length > 30) {
                        eventName = eventName.slice(0, 30) + "...";
                    }
                    var eventImage = $("<img>");
                    eventImage.attr("src", response._embedded.events[i].images[1].url);
                    console.log(eventImage);
                    var divContainer = $("<div>");
                    divContainer.attr("id", response._embedded.events[i].id);
                    divContainer.attr("class", "eventElemLg");
                    divContainer.attr("data-toggle", "modal");
                    divContainer.attr("data-target", ".musicPlanitModal");
                    divContainer.attr("data-index", i);
                    divContainer.append(eventImage);

                    var date = response._embedded.events[i].dates.start.localDate;
                    var time = response._embedded.events[i].dates.start.localTime;
                    date = moment(date).format('MMMM Do YYYY');
                    time = moment(time, "hhmm").format("hh:mm a");


                    divContainer.append("<p>" + eventName + "</p>" + "<p>" + date + " " + time +"</p>");
                    $("#lgList").prepend(divContainer);                      

                    var divContainerSm = $("<div>");
                    divContainerSm.attr("class", "eventElemSm");
                    divContainerSm.attr("data-toggle", "modal");
                    divContainerSm.attr("data-target", ".musicPlanitModal");
                    divContainerSm.attr("data-index", i);

					divContainerSm.html("<p>" + eventName + "</p>" + "<p>" + date + " " + time + "</p>");                    
                    $("#smList").prepend(divContainerSm);

                    //response._embedded.events[0]._embedded.venues[i].country.countryCode
                    //response._embedded.events[0]._embedded.venues[i].state.stateCode;
                    //response._embedded.events[0]._embedded.venues[i].name;

                }
                console.log(response._embedded.events[0]._embedded.venues[0].city.name);
                console.log(queryURL);
            })
    });
}