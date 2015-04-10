
HtmlAttr("event", function () {
    
	var test = event.test = function (attributeName) {
		return /^\s*(data\-)?wo\-event\-./.test(attributeName);
	};
	
    function event (element, attribute, renderContext) { //TODE
        ///<summary>Subscribe to a html event</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlAttributeSetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		attribute.onElementEvent(element, attribute.name.substr(attribute.name.indexOf("event-") + 6), renderContext);
    };
	
	return event;
});

// add some shortcuts to common html events
enumerateArr(["blur", "change", "click", "focus", "keydown", "keypress", "keyup", "mousedown", "mouseout", "mouseover", "mouseup", "submit"], 
	function (event) {
	HtmlAttr(event, function () {

		return function (element, attribute, renderContext) { //TODE
			///<summary>Subscribe to a html event</summary>
			///<param name="element" type="Element">The element</param>
			///<param name="attribute" type="wipeout.template.rendering.htmlAttributeSetter">The setter object</param>
			///<param name="renderContext" type="wipeout.template.context">The current context</param>
			///<returns type="Function">A dispose function</returns>

			attribute.onElementEvent(element, event, renderContext);
		};
	});
});