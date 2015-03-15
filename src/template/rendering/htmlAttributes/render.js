
HtmlAttr("render", function () {
	return function render (element, attribute, renderContext) {
		
        var htmlContent = new wipeout.template.rendering.renderedContent(element, attribute.value, renderContext);
		
		attribute.watch(renderContext, function (oldVal, newVal) {
            htmlContent.render(newVal);
        }, true);
        
        return htmlContent.dispose.bind(htmlContent);
    }
});