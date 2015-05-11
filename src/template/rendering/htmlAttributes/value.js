
HtmlAttr("value", function () {
	
	function radio (radio, attribute, renderContext) { 
		
		var val = attribute.value();
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + val + "\".";
		
		var tmpData;		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal === getRadioButtonVal(radio, attribute, renderContext))
				radio.setAttribute("checked", "checked");
			else
				radio.removeAttribute("checked");
        }, true);
		
		attribute.onElementEvent("change", renderContext, function () {
			attribute.set(renderContext, getRadioButtonVal(radio, attribute, renderContext), radio);
        });
	}
	
	var noVal = {};
	function getCheckboxVal(element, attribute, renderContext) {
		var tmpData;
		if (tmpData = attribute.getData(element, "wo-data"))
			return tmpData.get(renderContext, element);
		if ((tmpData = element.getAttribute("value")) != null)
			return tmpData;
		
		return noVal;		
	}
	
	function getRadioButtonVal(element, attribute, renderContext) {
		var tmpData = getCheckboxVal(element, attribute, renderContext);
		if (tmpData === noVal)
            throw "Radio buttons with the \"wo-value\" attribute must have a \"value\" or \"wo-data\" attribute.";
		
		return tmpData;
	}
	
	function checkbox (checkbox, attribute, renderContext) { 
		
		var val = attribute.value();
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + val + "\".";
		
		// set default
		var tmpData;
		if ((tmpData = getCheckboxVal(checkbox, attribute, renderContext)) !== noVal)
			attribute.set(renderContext, tmpData, checkbox);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal || newVal === "")
				checkbox.setAttribute("checked", "checked");
			else
				checkbox.removeAttribute("checked");
        }, true);
		
		attribute.onElementEvent("change", renderContext, function () {
			tmpData = getCheckboxVal(checkbox, attribute, renderContext);
			if (checkbox.getAttribute("checked") != null) {
				if (tmpData === noVal)
					tmpData = true;
			} else {
				tmpData = tmpData === noVal ? false : null;
			}
			
			attribute.set(renderContext, tmpData, checkbox);
        });
	}
	
	//TODE
	return function value (element, attribute, renderContext) {
        ///<summary>Bind to the value of a htl element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (element.type === "checkbox")
			return checkbox(element, attribute, renderContext);
		
		if (element.type === "radio")
			return radio(element, attribute, renderContext);
		
		var val = attribute.value();
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + val + "\".";
		
		var textarea = trimToLower(element.tagName) === "textarea";
		attribute.watch(renderContext, function (oldVal, newVal) {
            if (newVal == null) 
                newVal = "";
            
			if (textarea && element.innerHTML !== newVal)
                element.innerHTML = newVal;
			else if (!textarea && element.value !== newVal)
                element.value = newVal;
        }, true);
		
		attribute.onElementEvent(element.getAttribute("wo-on-event") || element.getAttribute("data-wo-on-event") || "change", renderContext, function () {
			attribute.set(renderContext, textarea ? element.innerHTML : element.value, element);
        });
    }
});