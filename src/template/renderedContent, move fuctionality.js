
(function () {
    
	var renderedContent = wipeout.template.renderedContent;
	
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
    
    //TODO: test
    renderedContent.prototype.prepend = function (content) {
              
		var nodes = getNodesAndRemoveDetatched(content);
		
		nodes.push(this.openingTag.nextSibling || this.closingTag);
		
		for (var i = nodes.length - 2; i >= 0; i--)
			nodes[i + 1].parentElement.insertBefore(nodes[i], nodes[i + 1]);
    };
    
    //TODO: test
    renderedContent.prototype.append = function (content) {
              
		var nodes = getNodesAndRemoveDetatched(content);
		
		var closing = this.closingTag;
		enumerateArr(nodes, function (node) {
			closing.parentElement.insertBefore(node, closing);
		});
    };
    
    //TODO: test
    renderedContent.prototype.insertBefore = function (content) {
              
		var nodes = getNodesAndRemoveDetatched(content);
		
		var opening = this.opeingTag;
		enumerateArr(nodes, function (node) {
			opening.parentElement.insertBefore(node, opening);
		});
    };
    
    //TODO: test
    renderedContent.prototype.insertAfter = function (content) {
              
		var nodes = getNodesAndRemoveDetatched(content);
		
		if (this.closingTag.nextSibling)
			this.closingTag.nextSibling.parentElement.insertBefore(nodes[nodes.length - 1], this.closingTag.nextSibling);
		else
			this.closingTag.parentElement.appendChild(nodes[nodes.length - 1]);
		
		for (var i = nodes.length - 2; i >= 0; i--)
			nodes[i + 1].parentElement.insertBefore(nodes[i], nodes[i + 1]);
    };
    
    //TODO: test
    renderedContent.prototype.detatch = function() {
		
		if (this.detatched) return;
		
        this.detatched = [this.openingTag], current = this.openingTag;
        
        for (var i = 0; current && current !== this.closingTag; i++) {
            this.detatched.push(current = current.nextSibling); 
			this.detatched[i].parentElement.removeChild(this.detatched[i]);
        }
        
        return this.detatched;
    };
    
    //TODO: test
    renderedContent.prototype.allHtml = function() {
		if (this.detatched) return this.detatched.slice();
		
        var output = [this.openingTag], current = this.openingTag;
        
        while (current && current !== this.closingTag) {
            output.push(current = current.nextSibling); 
        }
        
        return output;
    };
}());