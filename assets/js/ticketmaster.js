var city = "";

window.onload = function() {
    $("#searchBtn").on("click", function(event) {
        event.preventDefault();
        city = $("#searchString").val().trim();

        var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?&apikey=BZAkAGm6c4G9IYugsrmGfucSP3F5PcSf&city=" + city;

        $.ajax({
                url: queryURL,
                method: "GET"
            })
            .done(function(response) {
                console.log(response);
                for (i = 0; i < response._embedded.events.length; i++) {
                    var eventImage = $("<img>");
                    eventImage.attr("src", response._embedded.events[i].images[1].url);
                    console.log(eventImage);

                    var divContainer = $("<div>");
                    divContainer.attr("id", response._embedded.events[i].id);
                    divContainer.attr("class", "eventElemLg");
                    $("#lgList").prepend(divContainer);
                    $("#" + response._embedded.events[i].id).html(
                        "<img src='" + response._embedded.events[i].images[0].url + "' style='width: 200px;'/>" +
                        "<p>" + response._embedded.events[i].name + "</p>" +
                        "<p>" + response._embedded.events[i]._embedded.venues[0].address.line1 + "<br />" +
                        response._embedded.events[i]._embedded.venues[0].city.name + "</p>"
                        //"<p>" + response._embedded.events[i].url + "</p>"
                    );
                    //$("#eventElemLg").html(<a href= response._embedded.events[i].url><img src = "#" + response._embedded.events[i].id></a>)
                }
                console.log(response._embedded.events[0]._embedded.venues[0].city.name);
                console.log(queryURL);
            })
    });
}

//Create links within image so it can popup to the page

