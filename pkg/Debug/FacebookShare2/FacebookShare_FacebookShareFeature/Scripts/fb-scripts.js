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
    
    // https://github.com/lukasz-madon/heroesgenerator/blob/master/script.js

    function postImageToFeed(message, imageData, pageID, authToken) {
        // this is the multipart/form-data boundary we'll use
        var boundary = '----ThisIsTheBoundary1234567890';
        // let's encode our image file, which is contained in the var
        var formData = '--' + boundary + '\r\n'
        formData += 'Content-Disposition: form-data; name="source"; filename="imageSharepoint";\r\n';
        formData += 'Content-Type: image/png\r\n\r\n';
        for (var i = 0; i < imageData.length; ++i) {
            formData += String.fromCharCode(imageData[i] & 0xff);
        }
        formData += '\r\n';
        formData += '--' + boundary + '\r\n';
        formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
        formData += message + '\r\n'
        formData += '--' + boundary + '--\r\n';

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://graph.facebook.com/' + pageID+ '/photos?access_token=' + authToken, true);
        xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
        var nBytes = formData.length;
        var ui8Data = new Uint8Array(nBytes);
        for (var nIdx = 0; nIdx < nBytes; nIdx++) {
            ui8Data[nIdx] = formData.charCodeAt(nIdx) & 0xff;
        }
        xhr.onload = function (data) {
            alert("Votre message a été partagé !");
            close_popupWindow();
        };
        xhr.onerror = function (shr, status, data) {
            alert(JSON.stringify(shr));
        };
        xhr.send(ui8Data);
    };

    /*
     *  OLD one, Don't work for IE...
     */
    //function postImageToFeed(message, image, pageID, accessToken) {
    //    var formData = new FormData();
    //    formData.append("access_token", accessToken);
    //    formData.append("message", message);
    //    formData.append("file", image);

    //    $.ajax({
    //        url: "https://graph.facebook.com/" + pageID + "/photos",
    //        data: formData,
    //        type: "POST",
    //        cache: false,
    //        processData: false,
    //        contentType: false,
    //        success: function (data) {
    //            alert("Votre message a été partagé !");
    //            close_popupWindow();
    //        },
    //        error: function (shr, status, data) {
    //            alert(JSON.stringify(shr));
    //        }
    //    });
    //}
}



