<WebPartPages:AllowFraming runat="server" />
<!DOCTYPE html>
<!-- 
    This page must be opened in an iframe ! 
    It only contain the Share button
-->
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>Share on facebook</title>
    <link rel="stylesheet" href="../Styles/fb-styles.css">
</head>
<body>
    <div id="fb-root"></div>
    <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.1.min.js"></script>
    <script src="../Scripts/shareButton-script.js"></script>

    <span class='pluginButton' onclick="open_popupWindow();">
        <span class='pluginButtonContainer'>
            <span class='pluginButtonImage'>
                <span class='pluginButtonIconPlaceholder'></span>
            </span><span class='pluginButtonLabel'>Partager</span>  
        </span>
    </span>
</body>
</html>
