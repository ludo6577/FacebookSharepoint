var hostweburl;
var appweburl;
var hostCookieName = "FacebookShare_Host";
var appCookieName = "FacebookShare_App";

window.COB = window.COB || {};
window.COB.cookieHandler = {
    setCookie: function (cookieName, cookieValue, cookieLifetimeDays, cookiePath) {
        var expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + cookieLifetimeDays);
        var cookieContents = escape(cookieValue) + ((cookieLifetimeDays === null) ? "" : "; expires=" + expiryDate.toUTCString()) + ((cookiePath === null) ? "" : "; path=" + cookiePath);
        document.cookie = cookieName + "=" + cookieContents;
    },

    getCookie: function (cookieName) {
        var i, x, y, currentCookies = document.cookie.split(";");
        for (i = 0; i < currentCookies.length; i++) {
            x = currentCookies[i].substr(0, currentCookies[i].indexOf("="));
            y = currentCookies[i].substr(currentCookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x === cookieName) {
                return unescape(y);
            }
        }
    },

    ensureAppUrls: function () {
        if (hostweburl === undefined) {
            hostweburl = COB.cookieHandler.getCookie(hostCookieName);
        }
        if (appweburl === undefined) {
            appweburl = COB.cookieHandler.getCookie(appCookieName);
        }
    }
};

window.COB.appHelper = {
    getRelativeUrlFromAbsolute: function (absoluteUrl) {
        absoluteUrl = absoluteUrl.replace('https://', '');
        var parts = absoluteUrl.split('/');
        var relativeUrl = '/';
        for (var i = 1; i < parts.length; i++) {
            relativeUrl += parts[i] + '/';
        }
        return relativeUrl;
    },
};

function sharePointReady() {
    // retrieve passed app web/host web URLs and use session cookie to deal with SPHostUrl issue..

    var hostWebUrlFromQS = $.getUrlVar("SPHostUrl");
    hostweburl = (hostWebUrlFromQS !== undefined) ? decodeURIComponent(hostWebUrlFromQS) : undefined;
    var appWebUrlFromQS = $.getUrlVar("SPAppWebUrl");
    appweburl = (appWebUrlFromQS !== undefined) ? decodeURIComponent(appWebUrlFromQS) : undefined;

    // _spPageContextInfo is not present if code is running in an app part..
    if (_spPageContextInfo !== undefined) {
        // if no appweburl was passed, use _spPageContextInfo..
        if (appweburl === undefined) {
            appweburl = _spPageContextInfo.webAbsoluteUrl;
        }
        
        if ((document.referrer !== "") && (!document.referrer.toLowerCase().startsWith(appweburl.toLowerCase()) && (hostWebUrlFromQS))) {
            // we came from outside app web and are being passed SPHostUrl, so this should be the correct value - let's 
            // store it in a cookie against this path..
            var x = appweburl.replace('://', '');
            var cookiePath = x.substr(x.indexOf('/'), x.length - x.indexOf('/'));
            COB.cookieHandler.setCookie(hostCookieName, hostweburl, null, cookiePath);
            COB.cookieHandler.setCookie(appCookieName, appweburl, null, cookiePath);
        }
        else {
            // deal with "returning to default page in app web (*before it was fixed in March 2013 update*)" case.. 
            COB.cookieHandler.ensureAppUrls();
        }
    }
    else {
        // deal with "browsing an app part page in the app web" case.. 
        COB.cookieHandler.ensureAppUrls();
    }
}

// jQuery plugin for fetching querystring parameters..
jQuery.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars; 
    },
    getUrlVar: function (name) {
        return jQuery.getUrlVars()[name];
    }
});






