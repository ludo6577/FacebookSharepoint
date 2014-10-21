var APP_Name = "FacebookShare";

/*
 *  The Facebook App ID
 */
var FB_APPID = 637192169733140;




/*
 *	FACEBOOK Loading
 */
window.fbAsyncInit = function () {
    FB.init({
        appId: FB_APPID,
	    status: true, // check login status
	    cookie: true, // enable cookies to allow the server to access the session
	    xfbml: true,  // parse social plugins on this page
	    version: 'v2.1' // use version 2.1
    });

    FB.Event.subscribe('auth.authResponseChange', function (response) {
	    if (response.status === 'connected')
		    $(document).trigger('fbload');  //  <---- THIS RIGHT HERE TRIGGERS A CUSTOM EVENT CALLED 'fbload'
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
 *	Window
 *  _Open (load the content from a file (fb-share.txt))
 *  _Close (small hack (replace the parent and close)
 */
function open_popupWindow(text)
 {
 	var w = 700;
 	var h = 400;
 	var left = (screen.width / 2) - (w / 2);
 	var top = (screen.height / 2) - (h / 2);
 	var wnd = window.open('../Pages/fb-share.html', 'share', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    
 	setTimeout(watchForWindow, 100); 
 	function watchForWindow() {
 	    if (wnd.setTextValue) {
 	        wnd.setTextValue(text);
 	    }
 	    else {
 	        setTimeout(watchForWindow, 100);
 	    }
 	}
	return wnd;
} 

function close_popupWindow() {
    //Un hack :) thx to http://stackoverflow.com/questions/14125648/close-popup-window
    window.self.opener = window.self;
    window.self.close();
}