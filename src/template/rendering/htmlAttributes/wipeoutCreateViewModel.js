
Class("wipeout.template.rendering.htmlAttributes.wipeoutCreateViewModel", function () {
	return function wipeoutCreateViewModel (element, attribute, renderContext) {
        var op = new wipeout.template.rendering.viewModelElement(element, attribute.value, renderContext);
        
        return function () {
            op.dispose(true);
        };
    };
});
        