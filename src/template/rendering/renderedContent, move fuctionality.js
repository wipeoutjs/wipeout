
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
              
		content = getNodesAndRemoveDetatched(content);
		
		content.push(this.openingTag.nextSibling || this.closingTag);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentElement.insertBefore(content[i], content[i + 1]);
    };
    
	/* this is not tested
    renderedContent.prototype.append = function (content) {
              
		var nodes = getNodesAndRemoveDetatched(content);
		
		var closing = this.closingTag;
		enumerateArr(nodes, function (node) {
			closing.parentElement.insertBefore(node, closing);
		});
    };*/
    
    renderedContent.prototype.insertBefore = function (content) {
		
		enumerateArr(getNodesAndRemoveDetatched(content), function (node) {
			this.parentElement.insertBefore(node, this);
		}, this.openingTag);
    };
    
    renderedContent.prototype.insertAfter = function (content) {
              
		content = getNodesAndRemoveDetatched(content);
		
		if (this.closingTag.nextSibling)
			this.closingTag.nextSibling.parentElement.insertBefore(content[content.length - 1], this.closingTag.nextSibling);
		else
			this.closingTag.parentElement.appendChild(content[content.length - 1]);
		
		for (var i = content.length - 2; i >= 0; i--)
			content[i + 1].parentElement.insertBefore(content[i], content[i + 1]);
    };
    
    renderedContent.prototype.detatch = function() {
		
		if (!this.detatched) {		
			var current = this.openingTag;
			this.detatched = [this.openingTag];

			for (var i = 0; current && current !== this.closingTag; i++) {
				this.detatched.push(current = current.nextSibling); 
				this.detatched[i].parentElement.removeChild(this.detatched[i]);
			}
		}
        
        return this.detatched.slice();
    };
    
    renderedContent.prototype.allHtml = function() {
		if (this.detatched) return this.detatch();
		
        var output = [this.openingTag], current = this.openingTag;
        
        while (current && current !== this.closingTag) {
            output.push(current = current.nextSibling); 
        }
        
        return output;
    };
}());