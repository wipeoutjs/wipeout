
HtmlAttr("event", function () {
    
	var test = event.test = function (attributeName) {
        ///<summary>Test an attribute name to determine if it is this attribute</summary>
        ///<param name="attributeName" type="String">The attribute name</param>
        ///<returns type="Boolean">The result</returns>
		
		return /^\s*(data\-)?wo\-event\-./.test(attributeName);
	};
	
	//TODE
    function event (element, attribute, renderContext) {
        ///<summary>Subscribe to a html event</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		if (!test(attribute.name)) return;
		
		attribute.onElementEvent(attribute.name.substr(attribute.name.indexOf("event-") + 6));
    };
	
	return event;
});

// add some shortcuts to common html events
enumerateArr(["blur", "change", "click", "focus", "keydown", "keypress", "keyup", "mousedown", "mouseout", "mouseover", "mouseup", "submit"], 
	function (event) {
	HtmlAttr(event, function () {

		 //TODE
		return function (element, attribute, renderContext) {
			///<summary>Subscribe to a html event</summary>
			///<param name="element" type="Element">The element</param>
			///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
			///<param name="renderContext" type="wipeout.template.context">The current context</param>
			///<returns type="Function">A dispose function</returns>
			
			attribute.onElementEvent(event);
		};
	});
});