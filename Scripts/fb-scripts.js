var APP_Name = "FacebookShare";

/*
 *  The Facebook App ID
 */
var FB_APPID = 637192169733140;

var accessToken;


/*
 *	FACEBOOK Loading
 */
window.fbAsyncInit = function () {
    var file = "../Files/appId.txt";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0)) {
            var allText = rawFile.responseText;
            FB.init({
                appId: allText,
                fileUpload: true,
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true,  // parse social plugins on this page
                version: 'v2.1' // use version 2.1
            });
        }
    }
    rawFile.send(null);

    FB.Event.subscribe('auth.authResponseChange', function (response) {
        if (response.status === 'connected') {
            accessToken = response.authResponse.accessToken;
            $(document).trigger('fbload');  //  <---- THIS RIGHT HERE TRIGGERS A CUSTOM EVENT CALLED 'fbload'
        }
        else
            $(document).trigger('fbunload');
    });
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


/*
 *  Post a message on feed (User profile or one of the User page)
 *  linkToShare and image optional (can be null)
 */
function postMessage(messageToShare, /*linkToShare,*/ image, pageID, isUserProfile) {
    var imageExist = typeof image != 'undefined'

    if (isUserProfile) {   // Post on user page
        if (imageExist)
            postImageToFeed(messageToShare, image, pageID, accessToken);
        else
            postTextToFeed(messageToShare, /*linkToShare,*/ pageID, true);
    }
    else {                      // Else we need an access_token to post on a page
        FB.api("/" + pageID + "?fields=access_token",
                function (response) {
                    if (!response || response.error) {
                        alert(JSON.stringify(response.error));
                    } else {
                        if (imageExist)
                            postImageToFeed(messageToShare, image, pageID, response["access_token"]);
                        else
                            postTextToFeed(messageToShare, /*linkToShare,*/ pageID, false, response["access_token"])
                    }
                }
            );
    }

    /*
     *  Post to the page feed with the given access_token
     *  DEPRECATED: use postToFeedAdvanced
     */
    function postTextToFeed(messageToShare, /*linkToShare,*/ pageID, isUserProfile, accessToken) {
        var data;
        if (isUserProfile) {
            data = {
                message: messageToShare,
                /*link: linkToShare*/
            }
        }
        else {
            data = {
                access_token: accessToken,
                message: messageToShare,
                /*link: linkToShare*/
            }
        }

        FB.api("/" + pageID + "/feed",
            "post", data,
            function (response) {
                if (!response || response.error) {
                    alert(JSON.stringify(response.error));
                    close_popupWindow();
                } else {
                    alert("Votre message a été partagé !");
                    close_popupWindow();
                }
            }
        );
    }
    

    function postImageToFeed(message, image, pageID, accessToken) {
        var formData = new FormData();
        formData.append("access_token", accessToken);
        formData.append("message", message);
        formData.append("file", image);

        $.ajax({
            url: "https://graph.facebook.com/" + pageID + "/photos",
            data: formData,
            type: "POST",
            cache: false,
            processData: false,
            contentType: false,
            success: function (data) {
                alert("Votre message a été partagé !");
                close_popupWindow();
            },
            error: function (shr, status, data) {
                alert(JSON.stringify(shr));
            }
        });
    }
}



