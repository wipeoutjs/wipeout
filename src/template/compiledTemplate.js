
Class("wipeout.template.compiledTemplate", function () {
    
    var string = "string", idString = "id";
    
    function compiledTemplate(template) {
        ///<summary>Scans over an xml template and compiles it into something which can be rendered</summary>
        
        this.xml = template;
        this.html = [];
        this._addedElements = [];
        
        enumerateArr(template, this.addNode, this);
            
        // concat successive strings
        for (var i = this.html.length - 1; i > 0; i--) {
            if (typeof this.html[i] === string && typeof this.html[i - 1] === string)
                this.html[i - 1] += this.html.splice(i, 1)[0];
        }
        
        // protection from infite loops not needed
        delete this._addedElements;
    };
    
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
                
        var html = node.serialize();
        
        while (begin.exec(html)) {
            this.html.push(html.substring(end.lastIndex, begin.lastIndex - 2)); //TODO: -2 is for {{, what if it changes
            end.lastIndex = begin.lastIndex;
            if (!end.exec(html))
                throw "TODO";
            
            // add the beginning of a placeholder
            this.html.push("<script");

            // add the id flag and the id generator
            this.html.push([{
                action: wipeout.template.htmlAttributes.render, //TODO: ensure this is disposed of
                value: html.substring(begin.lastIndex, end.lastIndex - 2)//TODO: -2 is for {{, what if it changes
            }]);

            // add the end of the placeholder
            this.html.push(' type="placeholder"></script>');
        }
        
        this.html.push(html.substr(end.lastIndex));
    };
    
    compiledTemplate.prototype.addViewModel = function(vmNode) {
        ///<summary>Add a node which will be scanned and converted to a view model at a later stage</summary>
        ///<param name="node" type="wipeout.template.templateElement">The node</param>
        
        // add the beginning of a placeholder
        this.html.push("<script");
        
        // add the id flag and the id generator
        this.html.push([{
            action: wipeout.template.htmlAttributes.wipeoutCreateViewModel,
            value: vmNode
        }]);
        
        // add the end of the placeholder
        this.html.push(' type="placeholder"></script>');
    };
    
    compiledTemplate.prototype.addAttributes = function(attributes) {
        
        var modifications;
        
        enumerateObj(attributes, function (attribute, name) {
        
            // if it is a special attribute
            if (wipeout.template.htmlAttributes[name]) {

                // if it is the first special attribute for this element
                if (!modifications)
                    this.html.push(modifications = []);

                // ensure the "id" modification is the first to be done
                name === idString ?
                    modifications.splice(0, 0, {
                        action: wipeout.template.htmlAttributes[name],
                        value: attribute.value
                    }) :
                    modifications.push({
                        action: wipeout.template.htmlAttributes[name],
                        value: attribute.value
                    });
            } else {
                // add non special attribute
                this.html.push(" " + name + attribute.serializeValue()); //TODO: put this on attr class
            }
        }, this);
    };
    
    compiledTemplate.prototype.addElement = function(element) {
        ///<summary>Add an element which will be scanned for functionality and added to the dom</summary>
        ///<param name="node" type="wipeout.template.templateElement">The node</param>
        
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
        else if (wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(node.name)))//TODO
            this.addViewModel(node);
        else
            this.addElement(node);
        
    };
    
    compiledTemplate.prototype.getBuilder = function() {
        ///<summary>Get an item which will generate dynamic content to go with the static html</summary>
        
        // This only works if builder is gaurenteed to work synchronusly.
        // If not, create a new builder each time:
        //return new wipeout.template.builder(this);
        
        return this._builder || (this._builder = new wipeout.template.builder(this));        
    };
        
    return compiledTemplate;
});