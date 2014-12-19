var APP_Name = "FacebookShare";

/*
 *	Window
 *  _Open (load the content from a file (fb-share.txt))
 *  _Close (small hack (replace the parent and close)
 */
function open_popupWindow() {
    var w = 700;
    var h = 400;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    wnd = window.open('../Pages/shareDialog.html', 'share', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    setWindowContent(wnd);
}

/*
 *  When the message is received we open the popup window
 */
var canvas;
window.addEventListener('message', function (e) {
    var textToShare = e.data;
    var s_appName = APP_Name.toString();
    if (textToShare.substring(0, s_appName.length) !== s_appName) //Message begin with the APPID
        return;
    canvas = textToShare.substring(s_appName.length + 1);
}, false);



/*
 *  Sharepoint list interactions ....
 */
function setWindowContent(wnd) {
    var hostweburl = getUrlVars("SPHostUrl");
    var id = getUrlVars("ID");
    getListName(function (listName) {
        /*
         *  Get the content of the post
         */
        jQuery.ajax({
            url: hostweburl + "/_api/web/lists/GetByTitle('" + listName + "')/getitembyid(" + id + ")",
            type: "GET",
            headers: {
                "Accept": "application/json; odata=verbose",
                "Content-Type": "application/json;odata=verbose"
            },

            /*
                *  On sucess try to set the content of the window
                */
            success: function (data) {
                var text = strip(data.d.Body);
                if (data.d.Thumb !== undefined && data.d.Thumb !== null)
                    var imageUrl = data.d.Thumb.Url;
                setTimeout(watchForWindow, 100);
                function watchForWindow() {
                    if (wnd.setContent) {
                        wnd.setContent(text, imageUrl, canvas);
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
    });
}

function getListName(continueFunction) {
    var file = "../Files/listName.txt";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && (rawFile.status === 200 || rawFile.status == 0)) {
            var listName = rawFile.responseText;
            continueFunction(listName);
        }
    }
    rawFile.send(null);
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




