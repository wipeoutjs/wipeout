
HtmlAttr("click", function () {
	
    var functionCall = /^\)[\s;]*$/;
    
    return function click (value, element, renderContext) { //TODO error handling
        if (!functionCall.test(value))
            value = value + "(e, element);";
        
        //TODO non standard (with)
        var callback = new Function("e", "element", "renderContext", "with (renderContext) " + value);
        
        return wipeout.utils.htmlAttributes.onElementEvent(element, "click", function (e) {
            callback(e, element, renderContext);
        });
    };
});