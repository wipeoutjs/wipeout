
HtmlAttr("render", function () {
	return function render (element, attribute, renderContext) {
        ///<summary>Render content inside a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlAttributeSetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
        var htmlContent = new wipeout.template.rendering.renderedContent(element, attribute.getValue(), renderContext);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            htmlContent.render(newVal);
        }, true);
        
        return htmlContent.dispose.bind(htmlContent);
    }
});