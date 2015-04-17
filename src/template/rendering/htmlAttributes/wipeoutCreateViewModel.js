
Class("wipeout.template.rendering.htmlAttributes.wipeoutCreateViewModel", function () {
	return function wipeoutCreateViewModel (element, attribute, renderContext) {
        ///<summary>Used internally to add view model elements</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlAttributeSetter">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
        var op = new wipeout.template.rendering.viewModelElement(element, attribute.value(), renderContext);
        
        return function () {
            op.dispose(true);
        };
    };
});
        