
Class("wipeout.template.initialization.compiledInitializer", function () {
	    
    compiledInitializer.getPropertyFlags = function(name) {
		///<summary>Seperate name from flags by "--"</summary>
        ///<param name="name" type="String">The combined name and flags</param>
        ///<returns type="Object">The name and flags</returns>
        
        var flags = name.indexOf("--");
        if (flags === -1)
            return {
                flags: [],
                name: wipeout.utils.obj.camelCase(name)
            };
        
        return {
            flags: name.substr(flags + 2).toLowerCase().split("-"),
            name: wipeout.utils.obj.camelCase(name.substr(0, flags))
        };
    };
    
	function compiledInitializer(template) {
		///<summary>Given a piece of template xml, compile all of the setters for a view model</summary>
        ///<param name="template" type="wipeout.wml.wmlElement">The xml</param>
        
        this.setters = {};
		
        // add attribute properties
        enumerateObj(template.attributes, this.addAttribute, this);
        
        // add element properties
        enumerateArr(template, this.addElement, this);
        
        if(!this.setters.model) {
            this.setters.model = compiledInitializer.modelSetter ||
				(compiledInitializer.modelSetter = new wipeout.template.initialization.propertySetter("model", new wipeout.wml.wmlAttribute("$parent ? $parent.model : null")));
        }
    };
    
    compiledInitializer.prototype.addElement = function (element) {
		///<summary>Create and cache all of the setters from an element and its children if applicable</summary>
        ///<param name="element" type="wipeout.wml.wmlElement">The element</param>
		
        if (element.nodeType !== 1) return;
        
        var name = wipeout.utils.viewModels.getElementName(element);
		name = compiledInitializer.getPropertyFlags(name).name;
        if (this.setters.hasOwnProperty(name)) throw "The property \"" + name + "\"has been set more than once.";
        
        for (var val in element.attributes) {
            if (val === "value" || val.indexOf("value--") === 0) {
                enumerateArr(element, function(child) {
                    if (child.nodeType !== 3 || !child.serialize().match(/^\s*$/))
                        throw "You cannot set the value both in attributes and with elements." //TODE
                });
				
                this.setters[name] = new wipeout.template.initialization.propertySetter(name, element.attributes[val], compiledInitializer.getPropertyFlags(val).flags);
                return;
            }
        }
        
        var p = element.attributes.parser || element.attributes.parsers;
        if (!p && element._parentElement && element._parentElement.name) {
            var parent = wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element._parentElement.name))
            if (parent && parent.getGlobalParser)
                p = parent.getGlobalParser(name);
        }
            
        if (!p) {                
            for (var i = 0, ii = element.length; i < ii; i++) {
                if (element[i].nodeType === 1) {
					var vm = wipeout.utils.viewModels.getViewModelConstructor(element[i]);
					if (!vm)
						throw "Cannot create an instance of element: \"" + element[i].name + "\"";
					
                    this.setters[name] = new wipeout.template.initialization.propertySetter(name, {
						xml: element[i],
						constructor: vm.constructor
                    }, ["templateElementSetter"]);

                    return;
                }
            }
        }

        if (p && p.constructor === Function) {
            this.setters[name] = new wipeout.template.initialization.propertySetter(name, element);
            this.setters[name].parser = p;
        } else if (p) {
            this.setters[name] = new wipeout.template.initialization.propertySetter(name, element, compiledInitializer.getPropertyFlags("--" + p.value).flags);
        } else {
            this.setters[name] = new wipeout.template.initialization.propertySetter(name, element);
        }
    };
    
    compiledInitializer.prototype.addAttribute = function (attribute, name) {
		///<summary>Add a setter from a wml attribute</summary>
        ///<param name="attribute" type="wipeout.wml.wmlAttribute">The element</param>
        ///<param name="name" type="String">The element name</param>
        
        // spit name and flags
        name = compiledInitializer.getPropertyFlags(name);
        if (this.setters[name.name]) throw "The property \"" + name.name + "\" has been set more than once.";

        this.setters[name.name] = new wipeout.template.initialization.propertySetter(name.name, attribute, name.flags);
    };
    
    compiledInitializer.prototype.initialize = function (viewModel, renderContext) {
		///<summary>Initialize a view model with the cached setter in this compiledInitializer</summary>
        ///<param name="viewModel" type="Any">The view model</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">Dispose of initialization</returns>
		
		// only auto set model if model wasn't already set
        var disposal = this.setters.model === compiledInitializer.modelSetter && viewModel.model != null ?
			[] :
			this.setters.model.applyToViewModel(viewModel, renderContext);
        
		for (var name in this.setters)
            if (name !== "model")
            	disposal.push.apply(disposal, this.setters[name].applyToViewModel(viewModel, renderContext));
		
		return function () {
			enumerateArr(disposal.splice(0, disposal.length), function (d) {
				if (d)
					d.dispose();
			});
		}
    };
        
    return compiledInitializer;
});