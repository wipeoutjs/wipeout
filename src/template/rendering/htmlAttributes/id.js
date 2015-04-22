
Class("wipeout.template.rendering.htmlAttributes.id", function () {
	return function id (element, attribute, renderContext) {
        ///<summary>Add an id to an element and add the element to tempalteItems</summary>
        ///<param name="element" type="Element">The element</param>
        ///<param name="attribute" type="wipeout.template.rendering.htmlPropertyValue">The setter object</param>
        ///<param name="renderContext" type="wipeout.template.context">The current context</param>
        ///<returns type="Function">A dispose function</returns>
		
		var val = attribute.value();
        if (renderContext.$this instanceof wipeout.viewModels.view)
        	renderContext.$this.templateItems[val] = element;
		
        element.id = val;
        
        return function() {
            if (renderContext.$this instanceof wipeout.viewModels.view && renderContext.$this.templateItems[val] === element)
                delete renderContext.$this.templateItems[val]
        }
    };
});