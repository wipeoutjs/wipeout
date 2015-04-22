compiler.registerClass("wipeoutDocs.models.descriptions.classItem", "busybody.observable", function() {
    return function(itemName, itemSummary, isStatic) {
        this._super();
        
        this.name = itemName;
        this.summary = itemSummary;
        this.isStatic = isStatic;
    }
});