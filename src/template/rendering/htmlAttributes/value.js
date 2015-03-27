
HtmlAttr("value", function () {
	
	function radio (radio, attribute, renderContext) { 
		
		var val = attribute.getValue();
        if (!wipeout.template.setter.isSimpleBindingProperty(val))
            throw "Cannot bind to the property \"" + val + "\".";
		
		var tmpData;		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal === getRadioButtonVal(radio, attribute, renderContext)) {
				if (radio.attributes["checked"])
					radio.attributes["checked"].value = "checked";
				else
					radio.setAttribute("checked", "checked");
			} else {
				if (radio.attributes["checked"])
					radio.removeAttribute("checked");
			}
        }, true);
		
		attribute.onElementEvent(radio, "change", renderContext, function () {			
			wipeout.utils.obj.setObject(val, renderContext, getRadioButtonVal(radio, attribute, renderContext));
        }, renderContext);
	}
	
	var noVal = {};
	function getCheckboxVal(element, attribute, renderContext) {
		var tmpData;
		if (tmpData = attribute.getData(element, "wo-data"))
			return tmpData.execute(renderContext);
		if (tmpData = element.attributes["value"])
			return tmpData.value;
		
		return noVal;		
	}
	
	function getRadioButtonVal(element, attribute, renderContext) {
		var tmpData = getCheckboxVal(element, attribute, renderContext);
		if (tmpData === noVal)
            throw "Radio buttons with the \"wo-value\" attribute must have a \"value\" or \"wo-data\" attribute.";
		
		return tmpData;
	}
	
	function checkbox (checkbox, attribute, renderContext) { 
		
		var val = attribute.getValue();
        if (!wipeout.template.setter.isSimpleBindingProperty(val))
            throw "Cannot bind to the property \"" + val + "\".";
		
		// set default
		var tmpData;
		if ((tmpData = getCheckboxVal(checkbox, attribute, renderContext)) !== noVal)
			wipeout.utils.obj.setObject(val, renderContext, tmpData);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal || newVal === "") {
				if (checkbox.attributes["checked"])
					checkbox.attributes["checked"].value = "checked";
				else
					checkbox.setAttribute("checked", "checked");
			} else {
				if (checkbox.attributes["checked"])
					checkbox.removeAttribute("checked");
			}
        }, true);
		
		//TODO: test if wo-data is null
		attribute.onElementEvent(checkbox, "change", renderContext, function () {
			tmpData = getCheckboxVal(checkbox, attribute, renderContext);
			if (checkbox.attributes["checked"]) {
				if (tmpData === noVal)
					tmpData = true;
			} else {
				tmpData = tmpData === noVal ? false : null;
			}
			
			wipeout.utils.obj.setObject(val, renderContext, tmpData);
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
				console.log(attribute.getData(element, "wo-on-event"))
		attribute.onElementEvent(element, attribute.getData(element, "wo-on-event") || "change", renderContext, function () {
			wipeout.utils.obj.setObject(val, renderContext, element.value);
        }, renderContext);
    }
});