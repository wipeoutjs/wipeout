
HtmlAttr("value", function () {
	//TODO: change, blur, keyup?
	return function value (element, attribute, renderContext) { //TODO error handling
		
        if (!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(attribute.value))
            throw "Cannot bind to the property \"" + attribute.value + "\".";
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            if (element.value !== newVal)
                element.value = newVal;
        }, true);
		
		attribute.onElementEvent(element, "change", renderContext, function () {
			wipeout.utils.obj.setObject(attribute.value, renderContext, element.value);
        }, renderContext);
    }
});