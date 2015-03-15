
Class("wipeout.template.rendering.htmlAttributes.id", function () {
	return function id (element, attribute, renderContext) {
		
        if (renderContext.$this instanceof wipeout.viewModels.view)
        	renderContext.$this.templateItems[attribute.value] = element;
		
        element.id = attribute.value;
        
        return function() {
            if (renderContext.$this instanceof wipeout.viewModels.view && renderContext.$this.templateItems[attribute.value] === element)
                delete renderContext.$this.templateItems[attribute.value]
        }
    };
});