
HtmlAttr("data", function () {
	
	//TODE
	return function data (element, attribute, renderContext) {
        ///<summary>Add data to an element</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		attribute.setData(element, "wo-data", attribute);
    }
});