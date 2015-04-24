
HtmlAttr("render", function () {
	
	//TODE
	return function render (element, attribute, renderContext) {
        ///<summary>Render content inside a html element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		//TODO: is this a hack?
		if (element.nodeType === 1 && wipeout.utils.viewModels.getElementName(element) !== "script") {
			element.innerHTML = '<script type="placeholder"></script>';
			return render(element.firstChild, attribute, renderContext);
		}
		
        var htmlContent = new wipeout.template.rendering.renderedContent(element, attribute.value(), renderContext);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            htmlContent.render(newVal);
        }, true);
        
        return htmlContent.dispose.bind(htmlContent);
    }
});