
Class("wipeout.template.htmlAttributes", function () {
    function htmlAttributes() {
    }  
    
    var functionCall = /^\)[\s;]*$/;
    
    //TODO: types of inputs
    htmlAttributes.click = function (value, element, renderContext) { //TODO error handling
        
        if (!functionCall.test(value))
            value = value + "(e, element);";
        
        //TODO non standard (with)
        var callback = new Function("e", "element", "renderContext", "with (renderContext) " + value);
        
        return onElementEvent(element, "click", function (e) {
            callback(e, element, renderContext);
        });
    };
    
    //TODO: types of inputs
    htmlAttributes.value = function (value, element, renderContext) { //TODO error handling
        
        if (!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(value))
            throw "Cannot bind to the property \"" + value + "\".";
        
        var d1 = onRenderContextPropertyChanged(renderContext, value, function (oldVal, newVal) {
            if (element.value !== newVal)
                element.value = newVal;
        });
        
        var d2 = onElementEvent(element, "change", function () {
			wipeout.utils.obj.setObject(value, renderContext, element.value);
        });
        
        return function () {
            if (d1) {
                d1();
                d2();
                
                d1 = null;
                d2 = null;
            }
        }
    };   
    
    function onRenderContextPropertyChanged (renderContext, propertyPath, callback) { //TODO error handling
		
		var watcher = wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(propertyPath) ?
			new obsjs.observeTypes.pathObserver(renderContext, propertyPath) :
			new obsjs.observeTypes.computed(wipeout.template.compiledInitializer.getAutoParser(propertyPath), null, {
				watchVariables: renderContext.variablesForComputed({
					value: propertyPath, 
					propertyName: "",
					renderContext: renderContext
				}),
				allowWith: true
			});
		
		watcher.onValueChanged(callback, true);
		return watcher.dispose.bind(watcher);
    };
    
    function onElementEvent (element, event, callback) { //TODO error handling
        
        //TODO, third arg in addEventListener (capture)
        element.addEventListener(event, callback);
        
        return function() {
            if (callback) {
                //TODO, third arg (capture)
                element.removeEventListener(event, callback);
                callback = null;
            }
        };
    };
    
    htmlAttributes.render = function (value, element, renderContext) { //TODO error handling
		
        var htmlContent = new wipeout.template.renderedContent(element, value, renderContext);
        var disposal = onRenderContextPropertyChanged(renderContext, value, function (oldVal, newVal) {
            htmlContent.render(newVal);
        });
        
        return function() {
            disposal();
            htmlContent.dispose();
        };
    };  
    
    htmlAttributes.content = function (value, element, renderContext) { //TODO error handling
        return onRenderContextPropertyChanged(renderContext, value, function (oldVal, newVal) {
            element.innerHTML = newVal == null ? "" : newVal;
        });
    };
    
    htmlAttributes.id = function (value, element, renderContext) {
        renderContext.$this.templateItems[value] = element;
        element.id = value;
        
        return function() {
            if (renderContext.$this.templateItems[value] === element)
                delete renderContext.$this.templateItems[value]
        }
    };
    
    htmlAttributes.wipeoutCreateViewModel = function (value, element, renderContext) {
        var op = new wipeout.template.viewModelElement(element, value, renderContext);
        
        return function () {
            op.dispose(true);
        };
    };
    
    var tmp = {};
    for (var i in htmlAttributes) {
        tmp[i] = true;
    }
    
    for (var i in tmp) {
        htmlAttributes["wo-" + i] = htmlAttributes[i];
        htmlAttributes["data-wo-" + i] = htmlAttributes[i];
    }
    
    return htmlAttributes;
});