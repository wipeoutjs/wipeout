Class("wipeout.template.rendering.renderedContentHelperBase", function () {
    
    var helperBase = orienteer.extend(function renderedContentHelperBase() {
		///<summary>Base object which alters the html of a renderedContent</summary>
        
        this._super();
        
        if (this.constructor === helperBase)
            throw "Abstract classes must be overridden.";
    });
    
    helperBase.prototype.init = function (renderedContent, element, name) {
		///<summary>Create html tags fot a rendered content and append them to the DOM</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="element" type="Element">The initial tag</param>
        ///<param name="name" type="String">The name of the view model</param>
        ///<returns type="Object">The opening and closing tags</returns>
        
        throw "Abstract methods must be overridden";
    };
    
    helperBase.prototype.rename = function (renderedContent, name) {
		///<summary>Rename a rendered content's tags</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="name" type="String">The new name of the view model</param>
        
        throw "Abstract methods must be overridden";
    };
    
    helperBase.prototype.empty = function (renderedContent) {
		///<summary>Empty the contents of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        
        throw "Abstract methods must be overridden";
    };
    
    helperBase.prototype.disposeOf = function (renderedContent) {
		///<summary>Dispose of the html for a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        
        throw "Abstract methods must be overridden";
    };
    
    helperBase.prototype.appendHtml = function (renderedContent, html) {
		///<summary>Append html to a rendered content</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="html" type="String">The html</param>
        
        throw "Abstract methods must be overridden";
    };
    
    helperBase.prototype.prepend = function (renderedContent, content) {
		///<summary>Prepend content to a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content to prepend the content to</param>
        ///<param name="content" type="[Element]">The content to insert</param>
        
        throw "Abstract methods must be overridden";
    };
    
    helperBase.prototype.insertBefore = function (renderedContent, content) {
		///<summary>Insert content before the renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content to insert the content before</param>
        ///<param name="content" type="[Element]">The content to insert</param>
		
		enumerateArr(content, function (node) {
			this.parentNode.insertBefore(node, this);
		}, renderedContent.openingTag);
    };
    
    helperBase.prototype.insertAfter = function (renderedContent, content) {
		///<summary>Insert content the renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content to insert the content after</param>
        ///<param name="content" type="[Element]">The content to append</param>
		
		if (renderedContent.closingTag.nextSibling)
			renderedContent.closingTag.parentNode.insertBefore(content[content.length - 1], renderedContent.closingTag.nextSibling);
		else
			renderedContent.closingTag.parentNode.appendChild(content[content.length - 1]);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentNode.insertBefore(content[i], content[i + 1]);
    };
    
    helperBase.prototype.detatch = function (renderedContent) {
		///<summary>Detatch all of the content of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<returns type="[Element]">The content</returns>
        
        throw "Abstract methods must be overridden";
    };
    
    helperBase.prototype.allHtml = function (renderedContent) {
		///<summary>Return all of the content of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<returns type="[Element]">The content</returns>
        
        throw "Abstract methods must be overridden";
    };
    
    return helperBase;
});