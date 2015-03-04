
Class("wipeout.template.rendering.htmlAttributes.wipeoutCreateViewModel", function () {
	return function wipeoutCreateViewModel (value, element, renderContext) {
        var op = new wipeout.template.rendering.viewModelElement(element, value, renderContext);
        
        return function () {
            op.dispose(true);
        };
    };
});
        