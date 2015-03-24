
HtmlAttr("on-event", function () {
	
	return function onEvent (element, attribute, renderContext) { //TODO error handling
		
		attribute.setData(element, "wo-on-event", attribute.getValue());
    }
});