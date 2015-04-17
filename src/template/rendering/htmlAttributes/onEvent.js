
HtmlAttr("on-event", function () {
	
	return function onEvent (element, attribute, renderContext) { //TODE
        ///<summary>Used by the wo-value attribute to get when the value change event should be triggered. Default is "change".</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlAttributeSetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		attribute.setData(element, "wo-on-event", attribute.value());
    }
});