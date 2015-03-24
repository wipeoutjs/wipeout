
HtmlAttr("data", function () {
	
	return function data (element, attribute, renderContext) { //TODO error handling
		
		attribute.setData(element, "wo-data", attribute);
    }
});