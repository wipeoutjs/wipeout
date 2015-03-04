
Class("wipeout.template.rendering.htmlAttributes", function () {
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
        
        var d1 = wipeout.utils.htmlBindingTypes.onPropertyChange(renderContext, value, function (oldVal, newVal) {
            if (element.value !== newVal)
                element.value = newVal;
        }, true);
        
        d1.registerDisposeCallback(onElementEvent(element, "change", function () {
			wipeout.utils.obj.setObject(value, renderContext, element.value);
        }));
        
        return function () {
            if (d1) {
                d1.dispose();                
                d1 = null;
            }
        }
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
		
        var htmlContent = new wipeout.template.rendering.renderedContent(element, value, renderContext);
        var disposal = wipeout.utils.htmlBindingTypes.onPropertyChange(renderContext, value, function (oldVal, newVal) {
            htmlContent.render(newVal);
        }, true);
        
        return function() {
			if (disposal) {
				disposal.dispose();
				htmlContent.dispose();
				
				disposal = null;
				htmlContent = null;
			}
        };
    };  
    
    htmlAttributes.content = function (value, element, renderContext) { //TODO error handling
        var disp = wipeout.utils.htmlBindingTypes.onPropertyChange(renderContext, value, function (oldVal, newVal) {
            element.innerHTML = newVal == null ? "" : newVal;
        }, true);
		
		return disp.dispose.bind(disp);
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
        var op = new wipeout.template.rendering.viewModelElement(element, value, renderContext);
        
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