
HtmlAttr("value", function () {
	
	//TODE
	return function value (element, attribute, renderContext) {
        ///<summary>Bind to the value of a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
        // for checkboxes, radios and options "value" works in conjunction with "checked-value"
		if (element.type === "checkbox" || element.type === "radio" || trimToLower(element.tagName) === "option")
			return;
		
        if (!attribute.canSet())
            throw "Cannot bind to the property \"" + attribute.value(true) + "\".";
		
		var textarea = trimToLower(element.tagName) === "textarea";
		attribute.watch(renderContext, function (oldVal, newVal) {
            if (newVal == null) 
                newVal = "";
            
			if (textarea && element.innerHTML !== newVal)
                element.innerHTML = newVal;
			else if (!textarea && element.value !== newVal)
                element.value = newVal;
        }, true);
		
        var setter = attribute.setter();
		attribute.onElementEvent(element.getAttribute("wo-on-event") || element.getAttribute("data-wo-on-event") || "change", renderContext, function () {
			setter(textarea ? element.innerHTML : element.value);
        });
    }
});