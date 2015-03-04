
HtmlAttr("value", function () {
	
	return function value (value, element, renderContext) { //TODO error handling
		
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
    }
});