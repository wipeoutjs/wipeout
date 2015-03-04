
HtmlAttr("render", function () {
	return function render (value, element, renderContext) {
		
        var htmlContent = new wipeout.template.rendering.renderedContent(element, value, renderContext);
        var disposal = wipeout.utils.htmlBindingTypes.onPropertyChange(renderContext, value, function (oldVal, newVal) {
            htmlContent.render(newVal);
        }, true);
        
        return function() {
			if (disposal) {
				disposal.dispose();
				htmlContent.dispose();
				
				disposal = null;
				htmlContent = null;
			}
        };
    }
});