window.fbAsyncInit = function() {
    FB.init({
        appId: '327301951070061',
        cookie: true,
        xfbml: true,
        version: 'v2.10'
    });


    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });

};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    if (response.status === "connected") {
        console.log("Logged in via Facebook!");
        $("#fbBtn").css("display", "none");
        $("#fbLogout").css("display", "block");
        $("#fbProfilePic").css("display", "inline");
        callApi();
    } else {
        console.log("Need to login via Facebook.");
        $("#fbBtn").css("display", "block");
        $("#fbLogout").css("display", "none");
        $("#fbProfilePic").css("display", "none");
    }
}

function callApi() {
  FB.api("/me?fields=id,name,picture", function(response) {
    console.log(response.picture.data.url);
    $("#fbProfilePic").attr("src", response.picture.data.url);
  })
}
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
window.onload = function() {
    $("#fbLogout").on("click", function() {
        FB.logout(function(response) {
            statusChangeCallback(response);
        });
    });
}