
HtmlAttr("content", function () {
	return function content (element, attribute, renderContext) { //TODE
		attribute.watch(renderContext, function (oldVal, newVal) {
            element.innerHTML = newVal == null ? "" : newVal;
        }, true);
    }
});