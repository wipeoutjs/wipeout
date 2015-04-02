
HtmlAttr("attr", function () {
	
	var test = attr.test = function (attributeName) {
		return /^\s*(data\-)?wo\-attr\-./.test(attributeName);
	};
	
	function attr (element, attribute, renderContext) { //TODE
		
		if (!test(attribute.name)) return;
		
		var attr;
		var attributeName = attribute.name.substr(attribute.name.indexOf("attr-") + 5);
		if (!(attr = element.attributes[attributeName])) {
			element.setAttribute(attributeName, "");
			attr = element.attributes[attributeName]
		}
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            if (attr.value !== newVal)
                attr.value = newVal;
		}, true);
    }
	
	return attr;
});