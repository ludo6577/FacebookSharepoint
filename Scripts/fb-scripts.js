

/*
 *	const APP_NAME : Application name (used to find app folders)
 */
var APP_NAME = "FacebookShare";
var APP_FILES = "/" + APP_NAME + "/Files/";
var APP_IMAGES = "/" + APP_NAME + "/Images/";
var APP_PAGES = "/" + APP_NAME + "/Pages/";
var APP_SCRIPTS = "/" + APP_NAME + "/Scripts/";
var APP_STYLES = "/" + APP_NAME + "/Syles/";

/*
 *  The Facebook App ID
 */
var FB_APPID = 637192169733140;


/*
 *  Sharepoint Constants
 */
var IPC_siteUrl;
var IPC_siteId;
var context;
var site;
var web;




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

//(function (d, s, id) {
//    var js, fjs = d.getElementsByTagName(s)[0];
//    if (d.getElementById(id)) return;
//    js = d.createElement(s); js.id = id;
//    js.src = "//connect.facebook.net/en_US/sdk.js";
//    fjs.parentNode.insertBefore(js, fjs);
//}(document, 'script', 'facebook-jssdk'));




/*
 *	Page Loading (Sharepoint only)
 */
function runAfterEverythingElse(){	
    modifyPage();
	ExecuteOrDelayUntilScriptLoaded(loadConstants, "sp.js");
}

if(typeof _spBodyOnLoadFunctionNames !== 'undefined'){
	_spBodyOnLoadFunctionNames.push("runAfterEverythingElse"); //equivalent to JQuery: $(document).ready(function ()... but for Sharepoint
}



/*
 *  Initialise Sharepoint constants
 */
function loadConstants() {
	context = new SP.ClientContext.get_current();
	site = context.get_site();
	context.load(site);
	web = context.get_web();
	context.load(web);
	context.executeQueryAsync(Function.createDelegate(this, this.onSuccess), Function.createDelegate(this, this.onFail));
}
function onSuccess(sender, args) {
   IPC_siteUrl = this.site.get_url();
   IPC_siteId = this.site.get_id();
}
function onFail(sender, args) {
    console.log(args.get_message());
}





/*
 *	Utility (modify page, button, click...)
 */
function modifyPage() {
	$('body').prepend("<div id='fb-root'></div>");
	$(".ms-blog-commandSpace").each(function () {
		$(this).append(getButton());
	});
}

var position = 0;
function getButton() {
    //Need an overlay for the onclick event
    return "<span style='width:82px;height:20px;position:absolute;float:left;'>" +
                "<iframe id='iframeButton" + position + "' src='" + APP_PAGES + "fb-shareButton.html' width='100%' height='100%' marginheight='0' frameborder='0' scrolling='no'></iframe>" +
                "<div style='top:0;left:0;width:100%;height:100%;position:absolute;' onclick='buttonClicked(" + (position++) + ")'></div>" +
            "</span>";          
}


function buttonClicked(buttonNumber) {
    var text = $("div.ms-blog-postBody").contents()[buttonNumber].innerText;
    if (typeof text === 'undefined')
        text = $("div.ms-blog-postBody").contents()[buttonNumber].textContent; //Firefox/Opera compatibility

    document.getElementById('iframeButton' + buttonNumber).contentWindow.postMessage(FB_APPID + ":" + text, '*');
}

/*
 *	Window
 *  _Open (load the content from a file (fb-share.txt))
 *  _Close (small hack (replace the parent and close)
 */
function open_popupWindow(text)
 {
 	var w = 700;
 	var h = 390;
 	var left = (screen.width / 2) - (w / 2);
 	var top = (screen.height / 2) - (h / 2);
 	var wnd = window.open(APP_PAGES + 'fb-share.html', 'share', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    
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