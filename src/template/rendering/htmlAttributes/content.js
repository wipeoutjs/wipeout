
HtmlAttr("content", function () {
	return function content (value, element, renderContext, attributeName) { //TODO error handling
        var disp = wipeout.utils.htmlBindingTypes.onPropertyChange(renderContext, value, function (oldVal, newVal) {
            element.innerHTML = newVal == null ? "" : newVal;
        }, true);
		
		return disp.dispose.bind(disp);
    }
});