
HtmlAttr("attr", function () {
	
	var test = attr.test = function (attributeName) {
		return /^\s*(data\-)?wo\-attr\-./.test(attributeName);
	};
	
	function attr (element, attribute, renderContext) { //TODE
        ///<summary>Add html attributes to an element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		var attributeName = attribute.name.substr(attribute.name.indexOf("attr-") + 5);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            if (element.getAttribute(attributeName) !== newVal)
                element.setAttribute(attributeName, newVal)
		}, true);
    }
	
	return attr;
});