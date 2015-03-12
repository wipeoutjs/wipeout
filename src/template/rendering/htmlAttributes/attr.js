
HtmlAttr("attr", function () {
	
	attr.test = function (attributeName) {
		return /^\s*(data\-)?wo\-attr\-./.test(attributeName);
	};
	
	function attr (value, element, renderContext, attributeName) { //TODO error handling
		
		if (!attr.test(attributeName)) return;
		
		var attribute;
		attributeName = attributeName.substr(attributeName.indexOf("attr-") + 5);
		if (!(attribute = element.attributes[attributeName])) {
			element.setAttribute(attributeName, "");
			attribute = element.attributes[attributeName]
		}
		
		
        return wipeout.utils.htmlBindingTypes.onPropertyChange(renderContext, value, function (oldVal, newVal) {
            if (attribute.value !== newVal)
                attribute.value = newVal;
        }, true);
    }
	
	return attr;
});