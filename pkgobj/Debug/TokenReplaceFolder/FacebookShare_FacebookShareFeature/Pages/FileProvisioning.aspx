<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.requestexecutor.js" ></script> 

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Styles/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../DeploymentScripts/COB_AppHelper.js"></script>
    <script type="text/javascript" src="../DeploymentScripts/FileProvisioning.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Installation
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <br />
        <table>
            <tr><td>App ID:</td><td><input id="AppID" type="text" name="AppID"></td></tr>
            <tr><td>Nom de la liste:</td><td><input id="ListName" type="text" name="ListName" value="Billets"><td></tr>
            <tr><td></td><td><button type="button" onclick="window.COB.HostWebApp.execute();">Valider</button></td></tr>
        </table>
    
    <h1>Results:</h1>
    <p id="message">        
    </p>

    <h1>Notes (Important):</h1>
    <ul>
      <li>L'application facebook correspondant à l'<b>App ID</b> entré ci-dessus doit être validé par Facebook pour permettre à tout le monde de publier.<br /> 
          (Sinon seul l'utilisateur facebook qui heberge l'application pourra publier)</li>
      <li>Si vous ne pouvez pas éditer votre page de blog, l'application ne pourra pas se déployer correctement (voir partie fonctionnement)</li>
      <li>L'image doit être hébergé sur le site Sharepoint (dans la liste Photos)</li>
      <!--<li>Problème de compatiblité avec Internet Explorer (Cross site scripting). Fonctionne avec Chrome et Firefox</li>-->
    </ul><br />

    <h1>Fonctionnement:</h1><br />
        <h2>Entrez votre <b>AppID</b>:</h2><br />
        Créez une application Facebook et entrez votre <b>AppID</b> dans le champs ci dessus puis cliquez sur valider.<br />
        Si aucune erreur n'apparait passez à l'étape suivante.


        <h2>Ajout du script à votre blog:</h2><br />
        Une fois que vous avez validé votre application, rendez vous sur la page d'acceuil de votre blog.<br />
        Cliquez sur <b>Edit Page</b> (<b>Modifier la page</b>):<br /><br />
        <img src="../HowTo/EditPage01.PNG" /><br /><br /><br />

        Ensuite ajoutez le lien vers le script de l'application.<br />
        <b>~site/_catalogs/masterPage/fb-masterScript.js</b><br />
        De la façon suivante:<br /><br />
        <img src="../HowTo/EditPage02.PNG" /><br /><br /><br />

        Répétez l'opération dans le billet du blog afin d'afficher le bouton dans chaque posts.<br /><br /><br />

        <h2>Ajout de la gestion des images:</h2>
        Pour partager des images liés à un post il faut rajouter une colonne à la liste de post.<br />
        Pour cela cliquez sur l'icone paramètre (en haut a droite). Puis sur <b>Site contents</b> (<b>Contenu du site</b>):<br /><br />
        <img src="../HowTo/AddColumnPost01.PNG" /><br /><br /><br />
    
        Sur cette page cliquez sur <b>...</b> en haut a droite du cadre <b>Posts</b> (<b>Billets</b>), puis sur <b>Settings</b> (<b>Paramètres</b>):<br /><br />
        <img src="../HowTo/AddColumnPost02.PNG" /><br /><br /><br />

        Sur la page qui s'ouvre cliquez sur <b>Create column</b> (<b>Créer une colonne</b>):<br /><br />
        <img src="../HowTo/AddColumnPost03.PNG" /><br /><br /><br />
        
        Ajoutez une colonne portant le nom <b>Thumb</b> de type <b>Hyperlink or Picture</b> (<b>Lien hypertexte ou image</b>) Puis validez<br />
        (Si la colonne ne porte pas ce nom le partage d'images sur Facebook sera impossible)<br /><br />
        <img src="../HowTo/AddColumnPost04.PNG" /><br /><br /><br />

        Lorsque vous éditez vos billet de blog vous pouvez maintenant ajouter une image grâce au champ <b>Thumb</b><br /><br />
        <img src="../HowTo/AddColumnPost05.PNG" /><br /><br /><br />

</asp:Content>
