
(function () {
    
    //TODO: Document fragments
	var renderedContent = wipeout.template.rendering.renderedContent;
	
	function getNodesAndRemoveDetatched(renderedContentOrHtml) {
              
		try {
			return renderedContentOrHtml instanceof renderedContent ? 
				renderedContentOrHtml.detatch() :
				(renderedContentOrHtml instanceof Array ? renderedContentOrHtml : [renderedContentOrHtml]);
		} finally {
			if (renderedContentOrHtml instanceof renderedContent)
				renderedContentOrHtml.detatched = null;
		}
	}
    
    //TODO: move rendered content also, so that disposing of this also disposes of that
    renderedContent.prototype.prepend = function (content) {
		///<summary>Prepend content to the renderedContent</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
        
        this.helper.prepend(this, getNodesAndRemoveDetatched(content));
    };
    
    //TODO: move rendered content also, so that disposing of this also disposes of that
    renderedContent.prototype.insertBefore = function (content) {
		///<summary>Insert content before this</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
		
        this.helper.insertBefore(this, getNodesAndRemoveDetatched(content));
    };
    
    //TODO: move rendered content also, so that disposing of this also disposes of that
    renderedContent.prototype.insertAfter = function (content) {
		///<summary>Insert content after this</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
        
        this.helper.insertAfter(this, getNodesAndRemoveDetatched(content));
    };
    
    renderedContent.prototype.detatch = function() {
		///<summary>This renderedContent and all of it's html from the DOM</summary>
        ///<returns type="Array" generic0="Element">The html</returns>
		
		if (!this.detatched)
            this.detatched = this.helper.detatch(this);
        
        return this.detatched.slice();
    };
        
    renderedContent.prototype.allHtml = function() {
		///<summary>Get all of the html for this</summary>
        ///<returns type="Array" generic0="Element">The html</returns>
		
		if (this.detatched) return this.detatch();
		
        return this.helper.allHtml(this);
    };
}());