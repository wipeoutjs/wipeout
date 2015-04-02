
HtmlAttr("on-event", function () {
	
	return function onEvent (element, attribute, renderContext) { //TODE
		
		attribute.setData(element, "wo-on-event", attribute.getValue());
    }
});