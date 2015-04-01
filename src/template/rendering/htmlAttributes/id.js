
Class("wipeout.template.rendering.htmlAttributes.id", function () {
	return function id (element, attribute, renderContext) {
		
		var val = attribute.getValue();
        if (renderContext.$this instanceof wipeout.viewModels.view)
        	renderContext.$this.templateItems[val] = element;
		
        element.id = val;
        
        return function() {
            if (renderContext.$this instanceof wipeout.viewModels.view && renderContext.$this.templateItems[val] === element)
                delete renderContext.$this.templateItems[val]
        }
    };
});