
HtmlAttr("value", function () {
	//TODO: change, blur, keyup?
	return function value (element, attribute, renderContext) { //TODO error handling
		
		var val = attribute.getValue();
        if (!wipeout.utils.htmlBindingTypes.isSimpleBindingProperty(val))
            throw "Cannot bind to the property \"" + val + "\".";
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            if (element.value !== newVal)
                element.value = newVal;
        }, true);
		
		attribute.onElementEvent(element, "change", renderContext, function () {
			wipeout.utils.obj.setObject(val, renderContext, element.value);
        }, renderContext);
    }
});