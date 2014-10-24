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
    FB.init({
        appId: FB_APPID,
        fileUpload: true,
	    status: true, // check login status
	    cookie: true, // enable cookies to allow the server to access the session
	    xfbml: true,  // parse social plugins on this page
	    version: 'v2.1' // use version 2.1
    });

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
function postMessage(messageToShare, linkToShare, image, pageID, isUserProfile) {
    var imageExist = typeof image != 'undefined'

    if (isUserProfile) {   // Post on user page
        if (imageExist)
            postImageToFeed(messageToShare, image, pageID, accessToken);
        else
            postTextToFeed(messageToShare, linkToShare, pageID, true);
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
                            postTextToFeed(messageToShare, linkToShare, pageID, false, response["access_token"])
                    }
                }
            );
    }

    /*
     *  Post to the page feed with the given access_token
     *  DEPRECATED: use postToFeedAdvanced
     */
    function postTextToFeed(messageToShare, linkToShare, pageID, isUserProfile, accessToken) {
        var data;
        if (isUserProfile) {
            data = {
                message: messageToShare,
                link: linkToShare
            }
        }
        else {
            data = {
                access_token: accessToken,
                message: messageToShare,
                link: linkToShare
            }
        }

        FB.api("/" + pageID + "/feed",
            "post", data,
            function (response) {
                if (!response || response.error) {
                    alert(JSON.stringify(response.error));
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
        //formData.append("link", "https://ludovicfeltz.sharepoint.com/blog3/default.aspx"); //Link and image don't work :/

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



/*
 *	Window
 *  _Open (load the content from a file (fb-share.txt))
 *  _Close (small hack (replace the parent and close)
 */
var wnd;
function open_popupWindow()
 {
 	var w = 700;
 	var h = 400;
 	var left = (screen.width / 2) - (w / 2);
 	var top = (screen.height / 2) - (h / 2);
 	wnd = window.open('../Pages/shareDialog.html', 'share', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    
 	setWindowContent();
 	//var text = "test";

	return wnd;
} 

function close_popupWindow() {    
    window.self.opener = window.self;
    window.self.close();
}



/*
 *  Sharepoint list interactions ....
 */
function setWindowContent() {
    var siteURL = getUrlVars("siteUrl");
    var id = getUrlVars("ID");

    jQuery.ajax({
        url: siteURL + "/_api/web/lists/GetByTitle('Posts')/getitembyid(" + id + ")",
        type: "GET",
        headers: {
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json;odata=verbose"
        },

        success: function (data) {
            text = strip(data.d.Body);

            setTimeout(watchForWindow, 100);
            function watchForWindow() {
                if (wnd.setTextValue) {
                    wnd.setTextValue(text);
                }
                else {
                    setTimeout(watchForWindow, 100);
                }
            }
        },
        error: function (shr, status, data) {
            alert(JSON.stringify(shr));
        }
    });
}

/*
 *  Remove the html tags
 */
function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
}

/*
 * Access the GET values in the URL
 */
function getUrlVars(name) {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
        vars[key] = value;
    });
    return vars[name];
}
