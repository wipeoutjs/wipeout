
Class("wipeout.template.rendering.htmlAttributes.id", function () {
	return function id (value, element, renderContext, attributeName) {
        if (renderContext.$this instanceof wipeout.viewModels.view)
        	renderContext.$this.templateItems[value] = element;
		
        element.id = value;
        
        return function() {
            if (renderContext.$this instanceof wipeout.viewModels.view && renderContext.$this.templateItems[value] === element)
                delete renderContext.$this.templateItems[value]
        }
    };
});