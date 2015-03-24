
Class("wipeout.template.rendering.compiledTemplate", function () {
        
    function compiledTemplate(template) {
        ///<summary>Scans over an xml template and compiles it into something which can be rendered</summary>
        
        this.xml = template;
        this.html = [];
        this._addedElements = [];
        
        enumerateArr(template, this.addNode, this);
            
        // concat successive strings
        for (var i = this.html.length - 1; i > 0; i--) {
            if (typeof this.html[i] === "string" && typeof this.html[i - 1] === "string")
                this.html[i - 1] += this.html.splice(i, 1)[0];
        }
        
        // protection from infite loops not needed
        delete this._addedElements;
    }
    
    compiledTemplate.prototype.addNonElement = function(node) {
        ///<summary>Add a node to the html string without scanning for dynamic functionality</summary>
        ///<param name="node" type="Object">The node</param>
                
        this.html.push(node.serialize());
    };
    
    // TODO: ability to modify
    // TODO: escape characters
    var begin = /\{\{/g;
    var end = /\}\}/g;
    compiledTemplate.prototype.addTextNode = function(node) {
        ///<summary>Add a text node to the html string scanning for dynamic functionality</summary>
        ///<param name="node" type="Object">The node</param>
                
        begin.lastIndex = 0;
        end.lastIndex = 0;
        
        var html = node.serialize();
        while (begin.exec(html)) {
            this.html.push(html.substring(end.lastIndex, begin.lastIndex - 2)); //TODO: -2 is for {{, what if it changes
            end.lastIndex = begin.lastIndex;
            if (!end.exec(html))
                throw "TODO";
            
            // add the beginning of a placeholder
            this.html.push("<script");

            // add the id flag and the id generator
            this.html.push([new wipeout.template.rendering.htmlAttributeSetter("wo-render",
									  html.substring(begin.lastIndex, end.lastIndex - 2)//TODO: -2 is for {{, what if it changes
									  )]);

            // add the end of the placeholder
            this.html.push(' type="placeholder"></script>');
        }
        
        this.html.push(html.substr(end.lastIndex));
    };
    
    compiledTemplate.prototype.addViewModel = function(vmNode) {
        ///<summary>Add a node which will be scanned and converted to a view model at a later stage</summary>
        ///<param name="node" type="wipeout.wml.wmlElement">The node</param>
        
        // add the beginning of a placeholder
        this.html.push("<script");
        
        // add the id flag and the id generator
        this.html.push([new wipeout.template.rendering.htmlAttributeSetter("wipeoutCreateViewModel", vmNode)]);
        
        // add the end of the placeholder
        this.html.push(' type="placeholder"></script>');
    };
	
	compiledTemplate.getAttributeName = function (attributeName) {
		if (wipeout.template.rendering.htmlAttributes[attributeName])
			return attributeName;
		
		//TODO: document
		for (var i in wipeout.template.rendering.dynamicHtmlAttributes)
			if (wipeout.template.rendering.dynamicHtmlAttributes[i].test(attributeName))
				return i;
	};
    
    compiledTemplate.prototype.addAttributes = function(attributes) {
        
        var modifications;
        
		var attr;
        enumerateObj(attributes, function (attribute, name) {
        
            // if it is a special attribute
			attr = false;
            if (attr = compiledTemplate.getAttributeName(name)) {

                // if it is the first special attribute for this element
                if (!modifications)
                    this.html.push(modifications = []);
				
				if (attr !== name) {
					modifications.push(new wipeout.template.rendering.htmlAttributeSetter(name, attribute.value, attr));
				} else {
					// ensure the "id" modification is the first to be done
					name === "id" ?
						modifications.splice(0, 0, new wipeout.template.rendering.htmlAttributeSetter(name, attribute.value)) :
						modifications.push(new wipeout.template.rendering.htmlAttributeSetter(name, attribute.value));
				}
            } else {
                // add non special attribute
                this.html.push(" " + name + attribute.serializeValue()); //TODO: put this on attr class
            }
        }, this);
    };
    
    compiledTemplate.prototype.addElement = function(element) {
        ///<summary>Add an element which will be scanned for functionality and added to the dom</summary>
        ///<param name="node" type="wipeout.wml.wmlElement">The node</param>
        
        // add the element beginning
        this.html.push("<" + element.name);

        this.addAttributes(element.attributes);

        // add the element end
        if (element.inline) {
            this.html.push(" />");
        } else {
            this.html.push(">");
            enumerateArr(element, function(element) {
                this.addNode(element);
            }, this);
            this.html.push("</" + element.name + ">");
        }
    };
    
    compiledTemplate.prototype.addNode = function(node) {
        ///<summary>Add a node dynamic or not to the generated html</summary>
        ///<param name="node" type="Object">The node</param>
        
        if(this._addedElements.indexOf(node) !== -1)
            throw "Infinite loop"; //TODO
        
        this._addedElements.push(node);
        
        if (node.nodeType === 3)
            this.addTextNode(node);
        else if (node.nodeType !== 1)
            this.addNonElement(node);
        else if (wo.getViewModel(node.name))//TODO
            this.addViewModel(node);
        else
            this.addElement(node);
    };
    
    compiledTemplate.prototype.quickBuild = function(htmlAddCallback, renderContext) {
        ///<summary>Add html and execute dynamic content. Ensures synchronocity so reuses the same builder</summary>
        
        var builder = this._builder || (this._builder = this.getBuilder());
		
		htmlAddCallback(builder.html);
		return builder.execute(renderContext);
    };
    
    compiledTemplate.prototype.getBuilder = function() {
        ///<summary>Get an item which will generate dynamic content to go with the static html</summary>
        
        return new wipeout.template.rendering.builder(this);
    };
        
    return compiledTemplate;
});