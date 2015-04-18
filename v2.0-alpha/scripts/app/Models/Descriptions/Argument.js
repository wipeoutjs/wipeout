compiler.registerClass("wipeoutDocs.models.descriptions.argument", "wo.object", function() {
    function argument(itemDetails) {
        this._super();
        
        this.name = itemDetails.name;
        this.type = itemDetails.type;
        this.optional = !!itemDetails.optional;
        this.description = itemDetails.description;
        
        this.generics = itemDetails.description || [];
    }
    
    return argument;
});