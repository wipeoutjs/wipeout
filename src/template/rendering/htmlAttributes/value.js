
HtmlAttr("value", function () {
	
	return function value (value, element, renderContext, attributeName) { //TODO error handling
		
        if (!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(value))
            throw "Cannot bind to the property \"" + value + "\".";
        
        var d1 = wipeout.utils.htmlBindingTypes.onPropertyChange(renderContext, value, function (oldVal, newVal) {
            if (element.value !== newVal)
                element.value = newVal;
        }, true);
        
        d1.registerDisposeCallback(wipeout.utils.htmlAttributes.onElementEvent(element, "change", function () {
			wipeout.utils.obj.setObject(value, renderContext, element.value);
        }));
        
        return d1.dispose.bind(d1);
    }
});