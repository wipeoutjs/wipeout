
Class("wipeout.template.rendering.compiledTemplate", function () {
        
    function compiledTemplate(template) {
        ///<summary>Scans over an xml template and compiles it into something which can be rendered</summary>
        ///<param name="template" type="wipeout.xml.xmlElement">The template</param>
		
		///<summary type="wipeout.xml.xmlElement">The template</summary>
        this.xml = template;
		
		///<summary type="Array">Generated static html and modifiers</summary>
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
    
    var begin = "{{";
    var end = "}}";
	
	//TODM
    compiledTemplate.renderParenthesis = function(beginParenthesis, endParenthesis) {
        ///<summary>Change the escape values to render. Default is {{ and }}</summary>
        ///<param name="beginParenthesis" type="String">the beginnin</param>
        ///<param name="endParenthesis" type="String">the end</param>
		
		begin = beginParenthesis;
		end = endParenthesis;
	};
	
    compiledTemplate.prototype.addTextNode = function(node) {
        ///<summary>Add a text node to the html string scanning for dynamic functionality</summary>
        ///<param name="node" type="wipeout.wml.wmlString">The node</param>
        
        var html = node.serialize(), oldIndex = 0, index = 0;
        while ((index = html.indexOf(begin, oldIndex)) !== -1) {
            this.html.push(html.substring(oldIndex, index));
			
			oldIndex = index + begin.length;
			if ((index = html.indexOf(end, oldIndex)) === -1)
                throw "TODE";
            
            // add the beginning of a placeholder
            this.html.push("<script");

            // add the id flag and the id generator
            this.html.push([new wipeout.template.rendering.htmlAttributeSetter("wo-render", html.substring(oldIndex, index))]);

            // add the end of the placeholder
            this.html.push(' type="placeholder"></script>');
			
			oldIndex = index + begin.length;
        }
        
        this.html.push(html.substr(oldIndex));
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
        ///<summary>Returns the name of the wipeout attribute that this attributeName is pointing to. Sometimes wipeout modifies the actual attribute, for instance, "wo-attr-value" will be modified to "wo-attr"</summary>
        ///<param name="attributeName" type="String">The attribute name</param>
        ///<returns type="String">The altered attribute name, or null if the attribute is not a wipeout attribute</returns>
		
		if (wipeout.template.rendering.htmlAttributes[attributeName])
			return attributeName;
		
		//TODM
		for (var i in wipeout.template.rendering.dynamicHtmlAttributes)
			if (wipeout.template.rendering.dynamicHtmlAttributes[i].test(attributeName))
				return i;
	};
    
    compiledTemplate.prototype.addAttributes = function(attributes) {
        ///<summary>Add a group of attributes</summary>
        ///<param name="attributes" type="Object">The attributes</param>
        
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
					modifications.push(new wipeout.template.rendering.htmlAttributeSetter(name, attribute.value, null, attr));
				} else {
					// ensure the "id" modification is the first to be done
					name === "id" ?
						modifications.splice(0, 0, new wipeout.template.rendering.htmlAttributeSetter(name, attribute.value)) :
						modifications.push(new wipeout.template.rendering.htmlAttributeSetter(name, attribute.value));
				}
            } else {
                // add non special attribute
                this.html.push(" " + name + attribute.serializeValue());
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
            throw "Infinite loop"; //TODE
        
        this._addedElements.push(node);
        
        if (node.nodeType === 3)
            this.addTextNode(node);
        else if (node.nodeType !== 1)
            this.addNonElement(node);
        else if (wipeout.utils.viewModels.getViewModelConstructor(node))
            this.addViewModel(node);
        else
            this.addElement(node);
    };
    
    compiledTemplate.prototype.quickBuild = function(htmlAddCallback, renderContext) {
        ///<summary>Add html and execute dynamic content. Ensures synchronocity so reuses the same builder</summary>
        ///<param name="htmlAddCallback" type="Function">A function to add html to the DOM</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="obsjs.disposable">A disposable</returns>
        
        var builder = this._builder || (this._builder = this.getBuilder());
		
		htmlAddCallback(builder.html);
		return builder.execute(renderContext);
    };
    
    compiledTemplate.prototype.getBuilder = function() {
        ///<summary>Get an item which will generate dynamic content to go with the static html</summary>
        ///<returns type="wipeout.template.rendering.builder">Get a builder for this template</returns>
        
        return new wipeout.template.rendering.builder(this);
    };
        
    return compiledTemplate;
});