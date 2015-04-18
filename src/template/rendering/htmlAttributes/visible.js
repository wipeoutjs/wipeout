
HtmlAttr("visible", function () {
	return function visible (element, attribute, renderContext) { //TODE
        ///<summary>Determine element visibility</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		element.style.display = attribute.get(renderContext) ? "" : "none";
		
		attribute.watch(renderContext, function (oldVal, newVal) {
			if (newVal && !oldVal)
                element.style.display = "";
			else if (!newVal && oldVal)
                element.style.display = "none";
        }, false);
    }
});