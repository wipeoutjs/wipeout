Class("wipeout.template.rendering.renderedContentElementHelper", function () {
    
    var elementHelper = wipeout.template.rendering.renderedContentHelperBase.extend(function renderedContentElementHelper() {
		///<summary>Base object which alters the html of a renderedContent</summary>
        
        this._super();
    });
    
    elementHelper.prototype.init = function (renderedContent, element, name) {
		///<summary>Create html tags fot a rendered content and append them to the DOM</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="element" type="Element">The initial tag</param>
        ///<param name="name" type="String">The name of the view model</param>
        ///<returns type="Object">The opening and closing tags</returns>
        
        element.setAttribute("data-wo-view-model", name);
        return {
            opening: element,
            closing: element
        };
    };
    
    elementHelper.prototype.rename = function (renderedContent, name) {
		///<summary>Rename a rendered content's tags</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="name" type="String">The new name of the view model</param>
        
		renderedContent.openingTag.setAttribute("data-wo-view-model", name);
    };
    
    elementHelper.prototype.empty = function (renderedContent) {
		///<summary>Empty the contents of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        
        renderedContent.openingTag.innerHTML = "";
    };
    
    elementHelper.prototype.disposeOf = function (renderedContent) {
		///<summary>Dispose of the html for a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        
        this.empty(renderedContent);
        renderedContent.openingTag.removeAttribute("data-wo-view-model");
    };
    
    elementHelper.prototype.appendHtml = function (renderedContent, html) {
		///<summary>Append html to a rendered content</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="html" type="String">The html</param>
        
        renderedContent.openingTag.insertAdjacentHTML("beforeend", html);
    };
    
    elementHelper.prototype.prepend = function (renderedContent, content) {
		///<summary>Prepend content to a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content to prepend the content to</param>
        ///<param name="content" type="[Element]">The content to insert</param>
        
        var firstChild;
        if (firstChild = renderedContent.openingTag.firstChild)
            enumerateArr(content, function (node) {
                renderedContent.openingTag.insertBefore(node, firstChild);
            });
        else
            enumerateArr(content, function (node) {
                renderedContent.openingTag.appendChild(node);
            });
    };
    
    elementHelper.prototype.detatch = function (renderedContent) {
		///<summary>Detatch all of the content of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<returns type="[Element]">The content</returns>
        
        renderedContent.openingTag.parentNode.removeChild(renderedContent.openingTag);
        return [renderedContent.openingTag];
    };
    
    elementHelper.prototype.allHtml = function (renderedContent) {
		///<summary>Return all of the content of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<returns type="[Element]">The content</returns>
        
        return [renderedContent.openingTag];
    };
    
    return elementHelper;
});