
HtmlAttr("content", function () {
	return function content (element, attribute, renderContext) { //TODO error handling
		attribute.watch(renderContext, function (oldVal, newVal) {
            element.innerHTML = newVal == null ? "" : newVal;
        }, true);
    }
});