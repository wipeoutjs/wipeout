Class("wipeout.utils.htmlAttributes", function () { 
        
	function htmlAttributes () {}
	
	htmlAttributes.onElementEvent = function (element, event, callback) { //TODO error handling
        
        //TODO, third arg in addEventListener (capture)
        element.addEventListener(event, callback);
        
        return function() {
            if (callback) {
                //TODO, third arg (capture)
                element.removeEventListener(event, callback);
                callback = null;
            }
        };
    }
	
	return htmlAttributes;
});