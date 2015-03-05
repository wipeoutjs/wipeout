module("wipeout.template.initialization.compiledInitializer, integration", {
    setup: function() {
    },
    teardown: function() {
    }
});

test("success", function() {
	// arrange
	var template = wipeout.wml.wmlParser('<object val0="$parent.theValue" val1="true" val2--s="true">\
	<val3 value="true" />\
	<val4 value--s="true" />\
	<val5>true</val5>\
	<val6 parser="s">true</val6>\
	<val7>\
		<js-object>\
			<val1 value="55" />\
			<val2 value="$parent.theValue" />\
		</js-object>\
	</val7>\
<object>')[0];
	
	var theValue = {}, theVm = {};
	var rc = new wipeout.template.context({theValue: theValue}).contextFor(theVm);
	
	// act
	new wipeout.template.initialization.compiledInitializer(template).initialize(theVm, rc);
	
	// assert
	strictEqual(theVm.val0, theValue);
	strictEqual(theVm.val1, true);
	strictEqual(theVm.val2, "true");
	strictEqual(theVm.val3, true);
	strictEqual(theVm.val4, "true");
	strictEqual(theVm.val5, true);
	strictEqual(theVm.val6, "true");
	
	strictEqual(theVm.val7.val1, 55);
	strictEqual(theVm.val7.val2, theValue);
});




function aa () {
	    
    compiledInitializer.getPropertyFlags = function(name) {
        
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
        
        this.setters = {};
        
        // add attribute properties
        enumerateObj(template.attributes, this.addAttribute, this);
        
        // add element properties
        enumerateArr(template, this.addElement, this);
        
        if(!this.setters.model) {
            this.setters.model = new wipeout.template.initialization.propertySetter(new wipeout.wml.wmlAttribute("$parent ? $parent.model : null", null));
        }
    };
    
    compiledInitializer.prototype.addElement = function (element) {
        
        if (element.nodeType !== 1) return;
        
        var name = compiledInitializer.getPropertyFlags(element.name).name;
        if (this.setters.hasOwnProperty(name)) throw "The property \"" + name + "\"has been set more than once.";
        
        for (var val in element.attributes) {
            if (val === "value" || val.indexOf("value--") === 0) {
                enumerateArr(element, function(child) {
                    if (child.nodeType !== 3 || !child.serialize().match(/^\s*$/))
                        throw "You cannot set the value both in attributes and with elements." //TODO
                });
                
                this.setters[name] = new wipeout.template.initialization.propertySetter(element.attributes[val], compiledInitializer.getPropertyFlags(val).flags);
                return;
            }
        }
        
        var p = element.attributes.parser || element.attributes.parsers;
        if (!p && element._parentElement && element._parentElement.name) {
            var parent = wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element._parentElement.name))
            if (parent && parent.getGlobalParser) //TODO better way
                p = parent.getGlobalParser(name);
        }
            
        if (!p) {                
            for (var i = 0, ii = element.length; i < ii; i++) {
                if (element[i].nodeType === 1) {
                    this.setters[name] = new wipeout.template.initialization.propertySetter({
						xml: element[i],
						constructor: wipeout.utils.obj.getObject(wipeout.utils.obj.camelCase(element[i].name)),
                    }, ["templateElementSetter"]);

                    return;
                }
            }
        }

        if (p && p.constructor === Function) {
            this.setters[name] = new wipeout.template.initialization.propertySetter(element);
            this.setters[name].parser = p;
        } else if (p) {
            this.setters[name] = new wipeout.template.initialization.propertySetter(element, compiledInitializer.getPropertyFlags("--" + p.value).flags);
        } else {
            this.setters[name] = new wipeout.template.initialization.propertySetter(element);
        }
    };
    
    compiledInitializer.prototype.addAttribute = function (attribute, name) {
        
        // spit name and flags
        name = compiledInitializer.getPropertyFlags(name);
        if (this.setters[name.name]) throw "The property \"" + name.name + "\" has been set more than once.";

        this.setters[name.name] = new wipeout.template.initialization.propertySetter(attribute, name.flags);
    };
    
    compiledInitializer.prototype.initialize = function (viewModel, renderContext) { 
        
        var disposal = [this.set(viewModel, renderContext, "model")];
        
		for (var name in this.setters)
            if (name !== "model")
            	disposal.push(this.set(viewModel, renderContext, name));
		
		return function () {
			enumerateArr(disposal.splice(0, disposal.length), function (d) {
				if (d)
					d.dispose();
			});
		}
    };
    
    compiledInitializer.prototype.set = function (viewModel, renderContext, name) {
		if (!this.setters[name]) return;
		
        // use binding type, globally defined binding type or default binding type
        var bt = this.setters[name].bindingType || 
            (viewModel instanceof wipeout.base.bindable && viewModel.getGlobalBindingType(name)) || 
            "ow";
		
		if (!wipeout.htmlBindingTypes[bt]) throw "Invalid binding type :\"" + bt + "\" for property: \"" + name + "\".";

        return wipeout.htmlBindingTypes[bt](viewModel, this.setters[name], name, renderContext);
    };
    
    compiledInitializer.getAutoParser = function (value) {
		
        var output = new Function("value", "propertyName", "renderContext", "with (renderContext) return " + value + ";");
        output.wipeoutAutoParser = true;
        
        return output;
    };
        
    return compiledInitializer;
}