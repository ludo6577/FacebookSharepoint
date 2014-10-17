'use strict';

window.COB = window.COB || {};
window.COB.HostWebApp = function() {
	
    var hostWebUrl, appWebUrl, hostWebContext, errorOccured=false;		
		
	/*
	 *	Init hostWebUrl and hostWebContext
	 */
	function init() {
        var hostWebUrlFromQS = $.getUrlVar("SPHostUrl");
        hostWebUrl = (hostWebUrlFromQS !== undefined) ? decodeURIComponent(hostWebUrlFromQS) : undefined;

        var appWebUrlFromQS = $.getUrlVar("SPAppWebUrl");
        appWebUrl = (appWebUrlFromQS !== undefined) ? decodeURIComponent(appWebUrlFromQS) : undefined;
		
		hostWebContext = new SP.ClientContext(window.COB.appHelper.getRelativeUrlFromAbsolute(hostWebUrl));
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
					setMaster('/' + hostWebServerRelativeUrl + '/' + hostWebFileName);
		   }, 
		   function onProvisionFileFail(sender, args) {
				errorOccured = true;
				alert('Failed to provision file into host web. Error:' + sender.statusCode);
			});
    }

    function createConfigFile(hostWebServerRelativeUrl, hostWebFileName) {
        var createInfo = new SP.FileCreationInformation();
        createInfo.set_content(new SP.Base64EncodedByteArray());
        var contents = $("#AppID").val();
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
            },
            function onProvisionFileFail(sender, args) {
                errorOccured = true;
                alert('Failed to provision file into host web. Error:' + sender.statusCode);
            });
    }



    /*
	 * set master page on host web..
	 * TODO: modifier le master et pas le remplacer
	 */
    function setMaster(masterUrl) {
		var hostWeb = hostWebContext.get_web();
        hostWeb.set_masterUrl(masterUrl);
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
            //createConfigFile(appWebUrl + '/Files', 'fb-config.txt');
			readFromAppWebAndProvisionToHost(appWebUrl + '/Files/MasterPageProvisionedByApp.txt', '_catalogs/masterpage', 'ProvisionedByApp.master', true);        
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



