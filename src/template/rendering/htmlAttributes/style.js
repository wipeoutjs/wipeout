
HtmlAttr("style", function () {
	
	var test = style.test = function (attributeName) {
        ///<summary>Test an attribute name to determine if it is this attribute</summary>
        ///<param name="attributeName" type="String">The attribute name</param>
        ///<returns type="Boolean">The result</returns>
		
		return /^\s*(data\-)?wo\-style\-./.test(attributeName);
	};
	
	//TODE
	function style (element, attribute, renderContext) {
        ///<summary>Bind to the style of a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
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