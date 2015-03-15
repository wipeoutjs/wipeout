
HtmlAttr("click", function () {
    
    return function click (element, attribute, renderContext) { //TODO error handling
		
		attribute.onElementEvent(element, "click", renderContext);
    };
});