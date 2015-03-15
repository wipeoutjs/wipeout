
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
            this.html.push([new setter("wo-render",
									  null, //TODO: ensure this is disposed of
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
        this.html.push([new setter(
			"wipeoutCreateViewModel",
            null,
            vmNode
		)]);
        
        // add the end of the placeholder
        this.html.push(' type="placeholder"></script>');
    };
    
    compiledTemplate.prototype.addAttributes = function(attributes) {
        
        var modifications;
        
		var attr;
        enumerateObj(attributes, function (attribute, name) {
        
            // if it is a special attribute
			attr = false;
            if (wipeout.template.rendering.htmlAttributes[name] || (attr = wipeout.template.rendering.htmlAttributes["wo-attr"].test(name))) {

                // if it is the first special attribute for this element
                if (!modifications)
                    this.html.push(modifications = []);
				
				if (attr) {
					modifications.push(new setter(
						name,
						"wo-attr",
						attribute.value
					));
				} else {
					// ensure the "id" modification is the first to be done
					name === "id" ?
						modifications.splice(0, 0, new setter(
							name,
							null,
							attribute.value
					)) :
						modifications.push(new setter(
							name,
							null,
							attribute.value
					));
				}
            } else {
                // add non special attribute
                this.html.push(" " + name + attribute.serializeValue()); //TODO: put this on attr class
            }
        }, this);
    };
	
	//52,73,96
	function setter (name, action, value) {
		this.name = name;
		this.action = action;
		this.value = value;
	}
	
	setter.prototype.build = function () {
		
		return this._built || (this._built = wipeout.template.context.buildGetter(this.value));
	};
	
	setter.prototype.getWatchable = function (renderContext) {
		
		return wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(this.value) ?
			new obsjs.observeTypes.pathWatch(renderContext, this.value) :
			renderContext.getComputed(this.build());
	};
	
	setter.prototype.watch = function (renderContext, callback, evaluateImmediately) {
		if (!this._caching)
			throw "The watch function can only be called in the context of a cacheAllWatched call. Otherwise the watcher object will be lost, causing memory leaks";
				
		var watched = this.getWatchable(renderContext);
		if (this._caching)
			this._caching.push(watched);
		
		return watched.onValueChanged(callback, evaluateImmediately);
	};
	
	setter.prototype.apply = function (element, renderContext) {
		var op = [];
		op.push.apply(op, this.cacheAllWatched((function () {
			var o = wipeout.template.rendering.htmlAttributes[this.action || this.name](this, element, renderContext);
			if (o instanceof Function)
				op.push(o);
		}).bind(this)));
		
		return op;
	};
	
	setter.prototype.execute = function (renderContext) {
		return this.build().apply(null, renderContext.asGetterArgs());
	};
	
	setter.prototype.cacheAllWatched = function (logic) {
		if (this._caching)
			throw "cacheAllWatched cannot be asynchronus or nested.";
		
		try {
			this._caching = [];
			logic();
			return this._caching;
		} finally {
			delete this._caching;
		}
	}
    
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