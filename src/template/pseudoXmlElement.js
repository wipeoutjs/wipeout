Class("wipeout.template.pseudoXmlElement", function () {
    
    var pseudoXmlElement = wipeout.base.object.extend.call(Array, function pseudoXmlElement(name) {
        this._super();
        
        this.name = name;
        this.attributes = {};
    });
    
    return pseudoXmlElement;
});