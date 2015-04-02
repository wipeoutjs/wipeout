
HtmlAttr("style", function () {
	
	var test = style.test = function (attributeName) {
		return /^\s*(data\-)?wo\-style\-./.test(attributeName);
	};
	
	function style (element, attribute, renderContext) { //TODE
		
		if (!test(attribute.name)) return;
		
		var styleName = attribute.name.substr(attribute.name.indexOf("style-") + 6);
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (element.style[styleName] != newVal)
				element.style[styleName] = newVal;
		}, true);
    }
	
	return style;
});