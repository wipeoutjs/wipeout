
HtmlAttr("value", function () {
	//TODO: change, blur, keyup?
	//TODO: radio, checkbox
	
	function radio (element, attribute, renderContext) { 
		throw "not implemented";
	}
	
	function checkbox (element, attribute, renderContext) { 
		
		var val = attribute.getValue();
        if (!wipeout.template.setter.isSimpleBindingProperty(val))
            throw "Cannot bind to the property \"" + val + "\".";
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal) {
				if (element.attributes["checked"])
					element.attributes["checked"].value = "checked";
				else
					element.setAttribute("checked", "checked");
			} else {
				if (element.attributes["checked"])
					element.removeAttribute("checked");
			}
        }, true);
		
		attribute.onElementEvent(element, "change", renderContext, function () {
			wipeout.utils.obj.setObject(val, renderContext, !!element.attributes["checked"]);
        }, renderContext);
	}
	
	return function value (element, attribute, renderContext) { //TODO error handling
		
		if (element.type === "checkbox")
			return checkbox(element, attribute, renderContext);
		
		if (element.type === "radio")
			return radio(element, attribute, renderContext);
		
		var val = attribute.getValue();
        if (!wipeout.template.setter.isSimpleBindingProperty(val))
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