var eventSearch = [];

var map;
var infowindow;

function initMap(lat, long) {


    var myConcertIcon = "./assets/images/mapCenter.png"
    var eventLocation = { lat: lat, lng: long };
    console.log(eventLocation);
    map = new google.maps.Map($('#map')[0], {
        center: eventLocation,
        zoom: 13
    });

    var marker = new google.maps.Marker({
        position: eventLocation,
        icon: myConcertIcon,
        map: map
    });

    infowindow = new google.maps.InfoWindow();
        var newPlace = new google.maps.places.PlacesService(map);
        newPlace.nearbySearch({
            location: eventLocation,
            radius: 4000,
            type: ['restaurant'],
            openNow: true
        }, callback);

        var newPlace = new google.maps.places.PlacesService(map);
        newPlace.nearbySearch({
            location: eventLocation,
            radius: 4000,
            type: ['lodging'],
            openNow: true
        }, callback);
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        var icon = "";
        for (var i = 0; i < results.length; i++) {
            if (results[i].types.indexOf("restaurant") > -1) {
                icon = "./assets/images/food.png";
            }
            if (results[i].types.indexOf("lodging") > -1){
                icon = "./assets/images/lodging.png";
            }
            createMarker(results[i], icon);
        }
    }
}

function createMarker(place, icon) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        icon: icon,
        map: map,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

//generate list of countries
$.ajax({
    url: 'http://api.geonames.org/countryInfoJSON?username=LordKriegan',
    method: "GET"
}).done(function(response) {
    for (var i = 0; i < response.geonames.length; i++) {
        $("#countryList").append(
            "<li><a class='country' data-geonameId='" + response.geonames[i].geonameId + "'" + "data-countryCode='" + response.geonames[i].countryCode + "'>" + response.geonames[i].countryName + "</a></li>"
        )
    }
})

//generate list of us states
$.ajax({
    url: 'http://api.geonames.org/childrenJSON?geonameId=6252001&username=LordKriegan',
    method: "GET"
}).done(function(response) {
    for (var i = 0; i < response.geonames.length; i++) {
        $("#stateList").append(
            "<li><a class='state' data-stateCode='" + response.geonames[i].adminCode1 + "'>" + response.geonames[i].name + "</a></li>"
        )
    }
})


function loadModal(eventIndex) {
        var lat = Number(eventSearch[eventIndex]._embedded.venues[0].location.latitude);
        var long = Number(eventSearch[eventIndex]._embedded.venues[0].location.longitude);
        $("#eventInfoTitle").html(eventSearch[eventIndex].name);
        var eventDesc = (eventSearch[eventIndex].info) ? eventSearch[eventIndex].info : "None available.";
        $("#eventInfo").html(
            "<p>Date: " + moment(eventSearch[eventIndex].dates.start.localDate).format('MMMM Do YYYY') + "</p>" +
            "<p>Time: " + moment(eventSearch[eventIndex].dates.start.localTime, "hhmm").format("hh:mm a") + "</p>" + 
            "<p>Location: " + eventSearch[eventIndex]._embedded.venues[0].address.line1 +
            "<p>Info: " + eventDesc + "</p>" +
            "<p><a href='" + eventSearch[eventIndex].url + "'>Click here to buy a ticket.</a></p>");
        $("#fb-share-button").attr("data-href", eventSearch[eventIndex].url);
        initMap(lat, long);
        setTimeout(function() {
            google.maps.event.trigger(map, "resize");
            map.setCenter({ lat: lat, lng: long });
        }, 500); //since map is inside modal, trigger resize to refresh the map and show something instead of grey box
}

window.onload = function() {

    $(document).on("click", ".country", function() {
        if ($(this).attr("data-countryCode") === "US") {
            $("#stateListBtn").removeClass("disabled");
        }
        else {
            $("#stateListBtn").addClass("disabled")
            $("#stateListBtn").html("Select a State<span class=caret'></span>");
            $("#stateListBtn").attr("data-stateCode", ""); 
        }
        $("#countryListBtn").attr("data-countryCode", $(this).attr("data-countryCode"));
        $("#countryListBtn").html( $(this).html() + "<span class=caret'></span>");

    });

    $(document).on("click", ".state", function() {
        $("#stateListBtn").attr("data-stateCode", $(this).attr("data-stateCode"));
        $("#stateListBtn").html( $(this).html() + "<span class=caret'></span>");
    });
    $(document).on("click", ".eventElemLg", function() {
        loadModal($(this).attr("data-index"));

    });
    $(document).on("click", ".eventElemSm", function() {
        loadModal($(this).attr("data-index"));

    });

    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        $("#lgList").empty();
        $("#smList").empty();
        var countryCode = $("#countryListBtn").attr("data-countryCode") 
        var stateCode = $("#stateListBtn").attr("data-stateCode")
        //if the user has not selected a country, OR if they have selected US but not a state, exit function
        if ((countryCode === "") || ((countryCode === "US") && (stateCode === "")))  {
            $("#lgList").append("<p id='noEvents'>Select a country, or if you selected the US, also select a state. City name is optional.</p>");
            $("#smList").append("<p id='noEvents'>Select a country, or if you selected the US, also select a state. City name is optional.</p>");
            return;
        }
        var city = $("#searchString").val().trim();
        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=BZAkAGm6c4G9IYugsrmGfucSP3F5PcSf&size=100&countryCode=" + countryCode;
        if (stateCode !== "") {
            queryURL += "&stateCode=" + stateCode
        }
        if (city !== "") {
            queryURL += "&city=" + city;
        }
        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                if (response.page.totalElements === 0) {
                    $("#lgList").append("<p id='noEvents'>Sorry! We couldn't find anything!</p>");
                    $("#smList").append("<p id='noEvents'>Sorry! We couldn't find anything!</p>");
                    return;
                }
                eventSearch = response._embedded.events;
                for (i = 0; i < response._embedded.events.length; i++) {
                    var eventName = response._embedded.events[i].name;
                    if (eventName.length > 30) {
                        eventName = eventName.slice(0, 30) + "...";
                    }
                    var eventImage = $("<img>");
                    eventImage.attr("src", response._embedded.events[i].images[1].url);
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


                    divContainer.append("<p>" + eventName + "</p>" + "<p>" + date + " " + time + "</p>");
                    $("#lgList").append(divContainer);

                    var divContainerSm = $("<div>");
                    divContainerSm.attr("class", "eventElemSm");
                    divContainerSm.attr("data-toggle", "modal");
                    divContainerSm.attr("data-target", ".musicPlanitModal");
                    divContainerSm.attr("data-index", i);

                    divContainerSm.html("<p>" + eventName + "</p>" + "<p>" + date + " " + time + "</p>");
                    $("#smList").append(divContainerSm);

                }
            })
    });
}