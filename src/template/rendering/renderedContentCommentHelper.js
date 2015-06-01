Class("wipeout.template.rendering.renderedContentCommentHelper", function () {
    
    var commentHelper = wipeout.template.rendering.renderedContentHelperBase.extend(function renderedContentCommentHelper() {
		///<summary>Alter the html of a renderedContent who's root elements are comments</summary>
        
        this._super();
    });
    
    commentHelper.prototype.init = function (renderedContent, element, name) {
		///<summary>Create html tags fot a rendered content and append them to the DOM</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="element" type="Element">The initial tag</param>
        ///<param name="name" type="String">The name of the view model</param>
        ///<returns type="Object">The opening and closing tags</returns>
        
        //issue-#38
        //var closingTag = document.createElement("script");
        
        // create opening and closing tags and link to renderedContent
        var openingTag = document.createComment(" " + name + " ");
        var closingTag = document.createComment(" /" + name + " ");

        // add renderedContent to DOM and remove placeholder
        element.parentNode.insertBefore(openingTag, element);
        element.parentNode.insertBefore(closingTag, element);
        element.parentNode.removeChild(element);
        
        return {
            opening: openingTag,
            closing: closingTag
        };
    };
    
    commentHelper.prototype.rename = function (renderedContent, name) {
		///<summary>Rename a rendered content's tags</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="name" type="String">The new name of the view model</param>
        
		renderedContent.openingTag.nodeValue = " " + name + " ";
		renderedContent.closingTag.nodeValue = " /" + name + " ";
    };
    
    commentHelper.prototype.empty = function (renderedContent) {
		///<summary>Empty the contents of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        
        var ns;
        while ((ns = renderedContent.openingTag.nextSibling) && ns !== renderedContent.closingTag) {
            //issue-#40
            if (ns.elementType === 1)
                ns.innerHTML = "";

            ns.parentNode.removeChild(renderedContent.openingTag.nextSibling);
        }
    };
    
    commentHelper.prototype.disposeOf = function (renderedContent) {
		///<summary>Dispose of the html for a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        
        this.empty(renderedContent);
        renderedContent.closingTag.parentNode.removeChild(renderedContent.closingTag);
        renderedContent.openingTag.parentNode.removeChild(renderedContent.openingTag);
    };
    
    commentHelper.prototype.appendHtml = function (renderedContent, html) {
		///<summary>Append html to a rendered content</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<param name="html" type="String">The html</param>
        
		if (renderedContent.openingTag && renderedContent.openingTag.nodeType === 1) {
			renderedContent.openingTag.insertAdjacentHTML('afterend', html);
		} else {
        	//issue-#38
			var scr = document.createElement("script");
			renderedContent.closingTag.parentNode.insertBefore(scr, renderedContent.closingTag);
			scr.insertAdjacentHTML('afterend', html);
			scr.parentNode.removeChild(scr);
		}
    };
    
    commentHelper.prototype.prepend = function (renderedContent, content) {
		///<summary>Prepend content to a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content to prepend the content to</param>
        ///<param name="content" type="[Element]">The content to insert</param>
        
		content.push(renderedContent.openingTag.nextSibling || renderedContent.closingTag);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentNode.insertBefore(content[i], content[i + 1]);
    };
    
    commentHelper.prototype.detatch = function (renderedContent) {
		///<summary>Detatch all of the content of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<returns type="[Element]">The content</returns>
        
        var current = renderedContent.openingTag;
        var detatched = [renderedContent.openingTag];

        for (var i = 0; current && current !== renderedContent.closingTag; i++) {
            detatched.push(current = current.nextSibling); 
            detatched[i].parentNode.removeChild(detatched[i]);
        }
        
        detatched[i].parentNode.removeChild(detatched[i]);
        return detatched;
    };
    
    commentHelper.prototype.allHtml = function (renderedContent) {
		///<summary>Return all of the content of a renderedContent</summary>
        ///<param name="renderedContent" type="wipeout.template.rendering.renderedContent">The render content</param>
        ///<returns type="[Element]">The content</returns>
        
        var output = [renderedContent.openingTag], current = renderedContent.openingTag;

        while (current && current !== renderedContent.closingTag) {
            output.push(current = current.nextSibling); 
        }

        return output;
    };
    
    return commentHelper;
});