
HtmlAttr("content", function () {
	//TODE
	return function content (element, attribute, renderContext) {
        ///<summary>Set the content of a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            element.innerHTML = newVal == null ? "" : newVal;
        }, true);
    }
});