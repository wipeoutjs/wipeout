
(function () {
    
	var renderedContent = wipeout.template.rendering.renderedContent;
	
	function getNodesAndRemoveDetatched(renderedContentOrHtml) {
              
		try {
			return renderedContentOrHtml instanceof renderedContent ? 
				renderedContentOrHtml.detatch() :
				(renderedContentOrHtml instanceof Array ? renderedContentOrHtml : [renderedContentOrHtml]);
		} finally {
			if (renderedContentOrHtml instanceof renderedContent)
				delete renderedContentOrHtml.detatched;
		}
	}
    
    renderedContent.prototype.prepend = function (content) {
		///<summary>Prepend content to the renderedContent</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
              
		content = getNodesAndRemoveDetatched(content);
		
		content.push(this.openingTag.nextSibling || this.closingTag);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentNode.insertBefore(content[i], content[i + 1]);
    };
    
	/* this is not needed or tested
    renderedContent.prototype.append = function (content) {
              
		var nodes = getNodesAndRemoveDetatched(content);
		
		var closing = this.closingTag;
		enumerateArr(nodes, function (node) {
			closing.parentNode.insertBefore(node, closing);
		});
    };*/
    
    renderedContent.prototype.insertBefore = function (content) {
		///<summary>Insert content before this</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
		
		enumerateArr(getNodesAndRemoveDetatched(content), function (node) {
			this.parentNode.insertBefore(node, this);
		}, this.openingTag);
    };
    
    renderedContent.prototype.insertAfter = function (content) {
		///<summary>Insert content after this</summary>
        ///<param name="content" type="wipeout.template.rendering.renderedContent|Element|[Element]">The content to append</param>
              
		content = getNodesAndRemoveDetatched(content);
		
		if (this.closingTag.nextSibling)
			this.closingTag.parentNode.insertBefore(content[content.length - 1], this.closingTag.nextSibling);
		else
			this.closingTag.parentNode.appendChild(content[content.length - 1]);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentNode.insertBefore(content[i], content[i + 1]);
    };
    
    renderedContent.prototype.detatch = function() {
		///<summary>This renderedContent and all of it's html from the DOM</summary>
        ///<returns type="Array" generic0="Element">The html</retruns>
		
		if (!this.detatched) {		
			var current = this.openingTag;
			this.detatched = [this.openingTag];

			for (var i = 0; current && current !== this.closingTag; i++) {
				this.detatched.push(current = current.nextSibling); 
				this.detatched[i].parentNode.removeChild(this.detatched[i]);
			}
		}
        
        return this.detatched.slice();
    };
    
    renderedContent.prototype.allHtml = function() {
		///<summary>Get all of the html for this</summary>
        ///<returns type="Array" generic0="Element">The html</retruns>
		
		if (this.detatched) return this.detatch();
		
        var output = [this.openingTag], current = this.openingTag;
        
        while (current && current !== this.closingTag) {
            output.push(current = current.nextSibling); 
        }
        
        return output;
    };
}());