Class("wipeout.utils.htmlBindingTypes", function () {  
        
    function htmlBindingTypes() {
    }
	
    htmlBindingTypes.onPropertyChange = function(object, propertyPath, callback, allowComplexProperties) {
		
		var watcher;
		if (wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(propertyPath)) {
			watcher = new obsjs.observeTypes.pathObserver(object, propertyPath);
		} else if (!allowComplexProperties) {
			throw "The property " + propertyPath + 
				" is not valid for this binding. Only simple paths (e.g. \"$this.prop1.prop2\" are allowed";
		} else {
			
			var watchVariables = {
				value: propertyPath, 
				propertyName: "",
				renderContext: object
			};
			
			if (object instanceof wipeout.template.renderContext)
				watchVariables = object.variablesForComputed(watchVariables);
			
			watcher = new obsjs.observeTypes.computed(wipeout.template.compiledInitializer.getAutoParser(propertyPath), null, {
				watchVariables: watchVariables,
				allowWith: true
			});
		}
		
		watcher.onValueChanged(callback, true);
		return watcher;
    };  
	
    htmlBindingTypes.bindOneWay = function(bindFrom, bindFromName, bindTo, bindToName, allowComplexProperties) {
        //TODO: it doesn't make sense to call out to another lib for this
        var callback = obsjs.utils.obj.createBindFunction(bindTo, bindToName);
		var watcher = htmlBindingTypes.onPropertyChange(bindFrom, bindFromName, callback, allowComplexProperties);
		watcher.registerDisposable(callback);
		return watcher;
    };    
    
    htmlBindingTypes.isSimpleBindingProperty = function (property) {
        return /^[\$\w\s\.\[\]]+$/.test(property);
    };
    
    return htmlBindingTypes;
});