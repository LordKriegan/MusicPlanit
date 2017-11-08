var eventSearch = [];

window.onload = function() {
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
                eventSearch = response;
                for (i = 0; i < response._embedded.events.length; i++) {
                    var eventImage = $("<img>");
                    eventImage.attr("src", response._embedded.events[i].images[1].url);
                    console.log(eventImage);
                    var divContainer = $("<div>");
                    divContainer.attr("id", response._embedded.events[i].id);
                    divContainer.attr("class", "eventElemLg");
                    divContainer.attr("data-toggle", "modal");
                    divContainer.attr("data-target", ".musicPlanitModal");
                    divContainer.attr("data-index", i);
					$("#lgList").prepend(divContainer);   	                 
					divContainer.html(
                        "<img src='" + response._embedded.events[i].images[0].url + "' style='width: 200px;'/>" +
                        "<p>" + response._embedded.events[i].name + "</p>"
                    );
                    

                    var divContainerSm = $("<div>");
                    divContainerSm.attr("class", "eventElemSm");
                    divContainerSm.attr("data-toggle", "modal");
                    divContainerSm.attr("data-target", ".musicPlanitModal");
                    divContainerSm.attr("data-index", i);
					divContainerSm.html("<p>" + response._embedded.events[i].name + "</p>");                    
                    $("#smList").prepend(divContainerSm);

                    
                }
                console.log(response._embedded.events[0]._embedded.venues[0].city.name);
                console.log(queryURL);
            })
    });
}

