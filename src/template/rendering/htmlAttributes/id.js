
Class("wipeout.template.rendering.htmlAttributes.id", function () {
	return function id (value, element, renderContext) {
        renderContext.$this.templateItems[value] = element;
        element.id = value;
        
        return function() {
            if (renderContext.$this.templateItems[value] === element)
                delete renderContext.$this.templateItems[value]
        }
    };
});