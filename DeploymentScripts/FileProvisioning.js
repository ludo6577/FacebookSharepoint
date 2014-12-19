'use strict';

window.COB = window.COB || {};
window.COB.HostWebApp = function() {
	
    var hostWebUrl, appWebUrl, hostWebContext, appWebContext, errorOccured=false;		
		
	/*
	 *	Init hostWebUrl and hostWebContext
	 */
	function init() {
        var hostWebUrlFromQS = $.getUrlVar("SPHostUrl");
        hostWebUrl = (hostWebUrlFromQS !== undefined) ? decodeURIComponent(hostWebUrlFromQS) : undefined;

        var appWebUrlFromQS = $.getUrlVar("SPAppWebUrl");
        appWebUrl = (appWebUrlFromQS !== undefined) ? decodeURIComponent(appWebUrlFromQS) : undefined;
		
        hostWebContext = new SP.ClientContext(window.COB.appHelper.getRelativeUrlFromAbsolute(hostWebUrl));
        appWebContext = new SP.ClientContext(window.COB.appHelper.getRelativeUrlFromAbsolute(appWebUrl));
    }

	/*
	 * locate a file in the app web and retrieve the contents. If successful, provision to host web..
	 */
    function readFromAppWebAndProvisionToHost(appPageUrl, hostWebServerRelativeUrl, hostWebFileName, isMasterPage) {
		isMasterPage = typeof isMasterPage !== 'undefined' ? isMasterPage : false; //By defaut is false
		
		$.ajax({
            url: appPageUrl,
            type: "GET",
            cache: false
        }).done(function (fileContents) {
            if (fileContents !== undefined && fileContents.length > 0) {
				$('#message').append('<br />File extracted from App successfully: ' + appPageUrl);
                uploadFileToHostWebViaCSOM(hostWebServerRelativeUrl, hostWebFileName, fileContents, isMasterPage);
            }
            else {
				errorOccured = true;
                alert('Failed to read file ' + appPageUrl + ' from app web, so not uploading to host web..');
            }
	        }).fail(function (jqXHR, textStatus) {
				errorOccured = true;
	            alert("Failed request to read file in App failed: " + appPageUrl);
	        });
    }	
	
	/*
	 * utility method for uploading files to host web..
	 */
    function uploadFileToHostWebViaCSOM(hostWebServerRelativeUrl, hostWebFileName, contents, isMasterPage) {
        var createInfo = new SP.FileCreationInformation();
        createInfo.set_content(new SP.Base64EncodedByteArray());
        for (var i = 0; i < contents.length; i++) {
            createInfo.get_content().append(contents.charCodeAt(i));
        }
        createInfo.set_overwrite(true);
        createInfo.set_url(hostWebFileName);
        var files = hostWebContext.get_web().getFolderByServerRelativeUrl(hostWebServerRelativeUrl).get_files();
        hostWebContext.load(files);
        files.add(createInfo);

       hostWebContext.executeQueryAsync(
		   function onProvisionFileSuccess() {
		        $('#message').append('<br />File provisioned in host web successfully: ' + hostWebServerRelativeUrl + '/' + hostWebFileName);

				if(isMasterPage && !errorOccured)
					setMaster(hostWebServerRelativeUrl + '/' + hostWebFileName);
		   }, 
		   function onProvisionFileFail(sender, args) {
				errorOccured = true;
				alert('Failed to provision file into host web. Error:' + sender.statusCode);
			});
    }

    function createConfigFile(context, hostWebServerRelativeUrl, fileName, content) {
        var createInfo = new SP.FileCreationInformation();
        createInfo.set_content(new SP.Base64EncodedByteArray());
        for (var i = 0; i < content.length; i++) {
            createInfo.get_content().append(content.charCodeAt(i));
        }
        createInfo.set_overwrite(true);
        createInfo.set_url(fileName);
        var files = context.get_web().getFolderByServerRelativeUrl(hostWebServerRelativeUrl).get_files();
        context.load(files);
        files.add(createInfo);

        context.executeQueryAsync(
            function onProvisionFileSuccess() {
                $('#message').append('<br />File provisioned in app successfully: ' + hostWebServerRelativeUrl + '/' + fileName);
            },
            function onProvisionFileFail(sender, args) {
                errorOccured = true;
                alert('Failed to provision file into app. Error:' + sender.statusCode);
            });
    }

    function ifValidAppId(continueFunction) {
        var appId = $("#AppID").val();
        var URL = "https://graph.facebook.com/" + appId;

        var appIdPage = new XMLHttpRequest();
        appIdPage.open("GET", URL, false);
        appIdPage.onreadystatechange = function () {
            if (appIdPage.readyState === 4 && (appIdPage.status === 200 || appIdPage.status == 0)) {
                continueFunction();
            }
            else {
                alert("Invalid AppID !")
            }
        }
        appIdPage.send(null);
    }

    /*
	 * set master page on host web..
	 * TODO: modifier le master et pas le remplacer
	 */
    function setMaster(masterUrl) {
        var hostWeb = hostWebContext.get_web();
        var relativeURL = window.COB.AppHelper.getRelativeUrlFromAbsolute(hostWebUrl);
        hostWeb.set_masterUrl(relativeURL + masterUrl);
        hostWeb.update();

        hostWebContext.load(hostWeb);
        hostWebContext.executeQueryAsync(    
			function onSetMasterSuccess() {
				$('#message').append('<br />Master page updated successfully: ' + masterUrl);
			}, 
			function onSetMasterFail(sender, args) {
				errorOccured = true;
				alert('Failed to update master page on host web. Error:' + args.get_message());
			});
    }		
	

    return {
        execute: function () {
            init();
            ifValidAppId(function () {
                createConfigFile(appWebContext, appWebUrl + '/Files', 'appId.txt', $("#AppID").val());
                createConfigFile(appWebContext, appWebUrl + '/Files', 'listName.txt', $("#ListName").val());
                createConfigFile(hostWebContext, '_catalogs/masterpage', 'listName.txt', $("#ListName").val());

                readFromAppWebAndProvisionToHost(appWebUrl + '/Files/fb-masterScript.txt', '_catalogs/masterpage', 'fb-masterScript.js');
                //readFromAppWebAndProvisionToHost(appWebUrl + '/Files/fb-masterPage.txt', '_catalogs/masterpage', 'fb-masterPage.master', true);
            });
        }
    }
}();




window.COB.AppHelper = {
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

//$(document).ready(function () {
//    window.COB.HostWebApp.execute();
//});



