
HtmlAttr("style", function () {
	
	var test = style.test = function (attributeName) {
		return /^\s*(data\-)?wo\-style\-./.test(attributeName);
	};
	
	function style (element, attribute, renderContext) { //TODE
        ///<summary>Bind to the style of a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlAttributeSetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		var styleName = attribute.name.substr(attribute.name.indexOf("style-") + 6);
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (element.style[styleName] != newVal)
				element.style[styleName] = newVal;
		}, true);
    }
	
	return style;
});