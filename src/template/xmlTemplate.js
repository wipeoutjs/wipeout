
var wpfko = wpfko || {};
wpfko.template = wpfko.template || {};

(function () {
    
    var xmlTemplate = function(xmlTemplate) {
                
        xmlTemplate = new DOMParser().parseFromString("<root>" + xmlTemplate + "</root>", "application/xml").documentElement;
        
        if(xmlTemplate.firstChild && xmlTemplate.firstChild.nodeName === "parsererror") {
			var ser = new XMLSerializer();
			throw "Invalid xml template:\n" + ser.serializeToString(xmlTemplate.firstChild);
		}
        
        this.viewModelBuilder = new wpfko.template.viewModelBuilder(xmlTemplate);
        this.htmlBuilder = new wpfko.template.htmlBuilder(xmlTemplate);
    }
    
    xmlTemplate.isCustomElement = function(xmlElement) {
        return xmlElement.nodeType == 1 && wpfko.base.visual.reservedTags.indexOf(xmlElement.nodeName.toLowerCase()) === -1;
    };
    
    xmlTemplate.getId = function(xmlElement) {
        for(var i = 0, ii = xmlElement.attributes.length; i < ii; i++) {
            if(xmlElement.attributes[i].nodeName === "id") {
                return xmlElement.attributes[i].value;
            }
        }
        
        return null;
    };
    
    xmlTemplate.prototype.render = function(bindingContext) {        
        var html = this.htmlBuilder.render(bindingContext);
        this.viewModelBuilder.addReferencedElements(bindingContext.$data, html);
            
        if (bindingContext.$data instanceof wpfko.base.view)
            bindingContext.$data.onInitialized();
        
        return html;
    };
    
    xmlTemplate.prototype.rebuild = function(bindingContext) {
        this.viewModelBuilder.rebuild(bindingContext);
    };
    
    wpfko.template.xmlTemplate = xmlTemplate;
})();